import { useCallback, useEffect, useState } from 'react';
import { isSensitiveIssue, isSensitiveText, REDACTED_TITLE } from '../lib/redact';

export type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  summary: string;
  kind: 'push' | 'pr' | 'issue' | 'star' | 'fork' | 'create' | 'other';
};

export type Issue = {
  id: number;
  number: number;
  title: string;
  repo: string;
  url: string;
  state: 'open' | 'closed';
  updated_at: string;
  closed_at: string | null;
  labels: { name: string; color: string }[];
  redacted?: boolean;
};

type State = {
  events: GitHubEvent[];
  issues: Issue[];
  issuesTotal: number | null;
  hourly: number[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  pulse: number;
};

const USER = 'felipebarraza6';
// Unauthenticated GitHub API allows 60 requests/hour per IP (search: 10/min); each poll spends up to MAX_PAGES + 1.
const POLL_MS = 120_000;
const MAX_PAGES = 3;
const ISSUES_URL = `https://api.github.com/search/issues?q=${encodeURIComponent(`user:${USER} is:issue`)}&sort=updated&order=desc&per_page=100`;
const HEADERS = { Accept: 'application/vnd.github+json' };
const FETCH_OPTS: RequestInit = { headers: HEADERS, credentials: 'omit', referrerPolicy: 'no-referrer' };

function redactIssue(issue: Issue): Issue {
  if (!isSensitiveIssue(issue)) return issue;
  return {
    ...issue,
    title: REDACTED_TITLE,
    url: '',
    redacted: true,
    labels: issue.labels.filter((l) => /^P\d$/.test(l.name)),
  };
}

function mapIssue(raw: Record<string, unknown>): Issue {
  return redactIssue({
    id: Number(raw.id),
    number: Number(raw.number),
    title: String(raw.title ?? ''),
    repo: String(raw.repository_url ?? '').split('/').slice(-2).join('/'),
    url: String(raw.html_url ?? `https://github.com/${USER}`),
    state: raw.state === 'closed' ? 'closed' : 'open',
    updated_at: String(raw.updated_at ?? new Date().toISOString()),
    closed_at: raw.closed_at ? String(raw.closed_at) : null,
    labels: ((raw.labels as { name?: string; color?: string }[]) ?? []).map((l) => ({
      name: l.name ?? '',
      color: `#${l.color ?? 'a89984'}`,
    })),
  });
}

const titled = (title: string | undefined, action: string) => {
  if (!title) return '';
  const settled = action === 'closed' || action === 'merged';
  return ` · ${!settled && isSensitiveText(title) ? 'detalle reservado' : title}`;
};

async function fetchIssues() {
  const issues: Issue[] = [];
  let total = 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`${ISSUES_URL}&page=${page}`, FETCH_OPTS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { total_count: number; items: Record<string, unknown>[] };
    total = data.total_count;
    issues.push(...data.items.map(mapIssue));
    if (issues.length >= total || data.items.length < 100) break;
  }
  return { total, issues };
}

function hourlyActivity(raw: Record<string, unknown>[]) {
  const bins = new Array(24).fill(0) as number[];
  const now = Date.now();
  for (const e of raw) {
    const h = Math.floor((now - new Date(String(e.created_at)).getTime()) / 3_600_000);
    if (h >= 0 && h < 24) bins[23 - h] += 1;
  }
  return bins;
}

function summarize(raw: Record<string, unknown>): Omit<GitHubEvent, 'id' | 'type' | 'created_at' | 'repo'> {
  const type = String(raw.type ?? 'Event');
  const payload = (raw.payload ?? {}) as Record<string, unknown>;

  if (type === 'PushEvent') {
    const commits = (payload.commits as unknown[]) ?? [];
    const size = Number(payload.size ?? commits.length ?? 0);
    const first = commits[0] as { message?: string } | undefined;
    return {
      kind: 'push',
      summary: first?.message
        ? `push · ${size} commit${size === 1 ? '' : 's'} · ${first.message.split('\n')[0]}`
        : `push · ${size} commit${size === 1 ? '' : 's'}`,
    };
  }
  if (type === 'PullRequestEvent') {
    const action = String(payload.action ?? 'updated');
    const pr = payload.pull_request as { title?: string; number?: number } | undefined;
    return {
      kind: 'pr',
      summary: `PR #${pr?.number ?? '?'} ${action}${titled(pr?.title, action)}`,
    };
  }
  if (type === 'IssuesEvent') {
    const action = String(payload.action ?? 'updated');
    const issue = payload.issue as { title?: string; number?: number } | undefined;
    return {
      kind: 'issue',
      summary: `issue #${issue?.number ?? '?'} ${action}${titled(issue?.title, action)}`,
    };
  }
  if (type === 'WatchEvent') return { kind: 'star', summary: 'starred repo' };
  if (type === 'ForkEvent') return { kind: 'fork', summary: 'forked repo' };
  if (type === 'CreateEvent') {
    const refType = String(payload.ref_type ?? 'ref');
    return { kind: 'create', summary: `created ${refType}${payload.ref ? ` · ${payload.ref}` : ''}` };
  }
  return { kind: 'other', summary: type.replace(/Event$/, '').toLowerCase() };
}

function mapEvent(raw: Record<string, unknown>): GitHubEvent {
  const repo = (raw.repo ?? {}) as { name?: string; url?: string };
  const { kind, summary } = summarize(raw);
  return {
    id: String(raw.id),
    type: String(raw.type ?? 'Event'),
    created_at: String(raw.created_at ?? new Date().toISOString()),
    repo: {
      name: repo.name ?? 'unknown',
      url: repo.name ? `https://github.com/${repo.name}` : 'https://github.com/felipebarraza6',
    },
    summary,
    kind,
  };
}

export function useGitHubLive() {
  const [state, setState] = useState<State>({
    events: [],
    issues: [],
    issuesTotal: null,
    hourly: new Array(24).fill(0),
    loading: true,
    error: null,
    lastFetch: null,
    pulse: 0,
  });

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) {
      setState((s) => ({ ...s, loading: s.events.length === 0, error: null }));
    }
    fetchIssues()
      .then(({ total, issues }) => setState((s) => ({ ...s, issues, issuesTotal: total })))
      .catch(() => undefined);
    try {
      const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, FETCH_OPTS);
      if (!res.ok) {
        throw new Error(res.status === 403 ? 'rate limit GitHub' : `HTTP ${res.status}`);
      }
      const data = (await res.json()) as Record<string, unknown>[];
      const seen = new Set<string>();
      const events = data
        .map(mapEvent)
        .filter((e) => {
          const ref = e.summary.match(/#\d+/)?.[0];
          const key = ref ? `${e.repo.name}|${e.kind}|${ref}` : e.id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, 40);
      setState((s) => ({
        ...s,
        events,
        hourly: hourlyActivity(data),
        loading: false,
        error: null,
        lastFetch: Date.now(),
        pulse: s.pulse + 1,
      }));
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : 'error de red',
      }));
    }
  }, []);

  useEffect(() => {
    fetchEvents(false);
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') fetchEvents(true);
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [fetchEvents]);

  return { ...state, refresh: () => fetchEvents(false), user: USER };
}
