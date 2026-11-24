import { useCallback, useEffect, useState } from 'react';

export type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  summary: string;
  kind: 'push' | 'pr' | 'issue' | 'star' | 'fork' | 'create' | 'other';
};

export type OpenIssue = {
  id: number;
  number: number;
  title: string;
  repo: string;
  url: string;
  updated_at: string;
  labels: { name: string; color: string }[];
};

type State = {
  events: GitHubEvent[];
  issues: OpenIssue[];
  openIssues: number | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  pulse: number;
};

const USER = 'felipebarraza6';
// Unauthenticated GitHub API allows 60 requests/hour per IP (search: 10/min); each poll spends one of each.
const POLL_MS = 90_000;
const ISSUES_URL = `https://api.github.com/search/issues?q=${encodeURIComponent(`user:${USER} is:issue is:open`)}&sort=updated&order=desc&per_page=20`;
const HEADERS = { Accept: 'application/vnd.github+json' };

async function fetchOpenIssues() {
  const res = await fetch(ISSUES_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { total_count: number; items: Record<string, unknown>[] };
  const issues: OpenIssue[] = data.items.map((raw) => ({
    id: Number(raw.id),
    number: Number(raw.number),
    title: String(raw.title ?? ''),
    repo: String(raw.repository_url ?? '').split('/').slice(-2).join('/'),
    url: String(raw.html_url ?? `https://github.com/${USER}`),
    updated_at: String(raw.updated_at ?? new Date().toISOString()),
    labels: ((raw.labels as { name?: string; color?: string }[]) ?? []).map((l) => ({
      name: l.name ?? '',
      color: `#${l.color ?? 'a89984'}`,
    })),
  }));
  return { total: data.total_count, issues };
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
      summary: `PR #${pr?.number ?? '?'} ${action}${pr?.title ? ` · ${pr.title}` : ''}`,
    };
  }
  if (type === 'IssuesEvent') {
    const action = String(payload.action ?? 'updated');
    const issue = payload.issue as { title?: string; number?: number } | undefined;
    return {
      kind: 'issue',
      summary: `issue #${issue?.number ?? '?'} ${action}${issue?.title ? ` · ${issue.title}` : ''}`,
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
    openIssues: null,
    loading: true,
    error: null,
    lastFetch: null,
    pulse: 0,
  });

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) {
      setState((s) => ({ ...s, loading: s.events.length === 0, error: null }));
    }
    fetchOpenIssues()
      .then(({ total, issues }) => setState((s) => ({ ...s, issues, openIssues: total })))
      .catch(() => undefined);
    try {
      const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=100`, {
        headers: HEADERS,
      });
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
        .slice(0, 18);
      setState((s) => ({
        ...s,
        events,
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
