import { useCallback, useEffect, useState } from 'react';
import { isSensitiveText } from '../lib/redact';

export type StageId = 'ci' | 'contract' | 'review' | 'staging' | 'prod' | 'watch';
export type RunStatus = 'success' | 'failure' | 'running' | 'other';

export type Run = {
  id: number;
  repo: string;
  workflow: string;
  stage: StageId;
  status: RunStatus;
  event: string;
  branch: string;
  title: string;
  started: string;
  durationS: number | null;
  url: string;
};

export const STAGES: { id: StageId; label: string; detail: string; color: string }[] = [
  { id: 'ci', label: 'CI', detail: 'lint · tipos · tests', color: '#fabd2f' },
  { id: 'contract', label: 'contrato', detail: 'front vs contrato API', color: '#83a598' },
  { id: 'review', label: 'review', detail: 'code review automático', color: '#d3869b' },
  { id: 'staging', label: 'staging', detail: 'preview por PR · staging', color: '#fe8019' },
  { id: 'prod', label: 'producción', detail: 'deploy desde main', color: '#8ec07c' },
  { id: 'watch', label: 'vigilancia', detail: 'smoke · falla → issue', color: '#fb4934' },
];

const USER = 'felipebarraza6';
const REPOS = ['proyecto-90', 'frig', 'muninn', 'heir', 'forja', 'nxord', 'gungir', 'nxrd_apr', 'portafolio_fbarraza'];
// One core request per repo; cached per tab so reloads don't burn the 60 req/h unauthenticated quota.
const CACHE_KEY = 'gh-actions-v3';
const CACHE_MS = 15 * 60_000;

function stageOf(workflow: string): StageId | null {
  if (/failure issue|status issues|smoke/i.test(workflow)) return 'watch';
  if (/code review/i.test(workflow)) return 'review';
  if (/staging/i.test(workflow)) return 'staging';
  if (/production|^deploy/i.test(workflow)) return 'prod';
  if (/^contract/i.test(workflow)) return 'contract';
  if (/^ci\b/i.test(workflow)) return 'ci';
  return null;
}

function statusOf(status: unknown, conclusion: unknown): RunStatus {
  if (status !== 'completed') return 'running';
  if (conclusion === 'success') return 'success';
  if (conclusion === 'failure' || conclusion === 'timed_out') return 'failure';
  return 'other';
}

// updated_at also moves when a run is re-run or annotated later, so long spans aren't real durations.
const MAX_RUN_S = 3 * 3600;
function runDuration(started: string, updated: string) {
  const s = (new Date(updated).getTime() - new Date(started).getTime()) / 1000;
  return s >= 0 && s <= MAX_RUN_S ? s : null;
}

function mapRun(repo: string, raw: Record<string, unknown>): Run | null {
  const workflow = String(raw.name ?? '');
  const found = stageOf(workflow);
  if (!found) return null;
  const branch = String(raw.head_branch ?? '');
  const preview = String(raw.event).startsWith('pull_request') || !/^(main|master)$/.test(branch);
  const stage = found === 'prod' && preview ? 'staging' : found;
  const started = String(raw.run_started_at ?? raw.created_at ?? '');
  const title = String(raw.display_title ?? '').split('\n')[0];
  return {
    id: Number(raw.id),
    repo,
    workflow,
    stage,
    status: statusOf(raw.status, raw.conclusion),
    event: String(raw.event ?? ''),
    branch,
    title: isSensitiveText(title) ? 'detalle reservado' : title,
    started,
    durationS: runDuration(started, String(raw.updated_at)),
    url: String(raw.html_url ?? `https://github.com/${USER}/${repo}/actions`),
  };
}

export function deliveryStats(runs: Run[]) {
  const done = runs.filter((r) => r.status === 'success' || r.status === 'failure');
  const ok = done.filter((r) => r.status === 'success').length;
  return {
    rate: done.length ? Math.round((ok / done.length) * 100) : null,
    deploys: runs.filter((r) => r.stage === 'prod' && r.status === 'success').length,
  };
}

export type Source = 'live' | 'mixed' | 'snapshot';
type Payload = { at: number; runs: Run[]; totalRuns: number; repos: number; source: Source; snapshotAt: number | null };
type RepoRuns = { repo: string; total: number; runs: Record<string, unknown>[] };
type Snapshot = { at: number; repos: RepoRuns[] };

async function fetchRepo(repo: string): Promise<RepoRuns> {
  const res = await fetch(`https://api.github.com/repos/${USER}/${repo}/actions/runs?per_page=40`, {
    headers: { Accept: 'application/vnd.github+json' },
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  });
  if (!res.ok) throw new Error(res.status === 403 ? 'rate limit GitHub' : `HTTP ${res.status}`);
  const data = (await res.json()) as { total_count: number; workflow_runs: Record<string, unknown>[] };
  return { repo, total: data.total_count, runs: data.workflow_runs };
}

/** Generado por scripts/github-snapshot.mjs en cada deploy. */
async function fetchSnapshot(): Promise<Snapshot | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}github-snapshot.json`, {
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    return res.ok ? ((await res.json()) as Snapshot) : null;
  } catch {
    return null;
  }
}

async function fetchAll(): Promise<Payload> {
  const results = await Promise.allSettled(REPOS.map(fetchRepo));
  const live = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  const missing = REPOS.filter((repo) => !live.some((r) => r.repo === repo));
  const snapshot = missing.length ? await fetchSnapshot() : null;
  const fallback = snapshot?.repos.filter((r) => missing.includes(r.repo)) ?? [];
  const all = [...live, ...fallback];
  if (!all.length) {
    const first = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    throw first?.reason instanceof Error ? first.reason : new Error('error de red');
  }
  const runs = all
    .flatMap((r) => r.runs.map((raw) => mapRun(r.repo, raw)))
    .filter((r): r is Run => r !== null)
    .sort((a, b) => b.started.localeCompare(a.started));
  return {
    at: Date.now(),
    runs,
    totalRuns: all.reduce((n, r) => n + r.total, 0),
    repos: new Set(runs.map((r) => r.repo)).size,
    source: !fallback.length ? 'live' : live.length ? 'mixed' : 'snapshot',
    snapshotAt: fallback.length ? (snapshot?.at ?? null) : null,
  };
}

function readCache(): Payload | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    const data = raw ? (JSON.parse(raw) as Payload) : null;
    return data && Date.now() - data.at < CACHE_MS ? data : null;
  } catch {
    return null;
  }
}

export function useGitHubActions() {
  const [data, setData] = useState<Payload | null>(readCache);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (force = false) => {
    if (!force && readCache()) return;
    setLoading(true);
    try {
      const payload = await fetchAll();
      if (payload.source === 'live') sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      setData(payload);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error de red');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, refresh: () => load(true), user: USER };
}
