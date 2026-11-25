import { useMemo, useState, type CSSProperties } from "react";
import {
  CircleCheck,
  CircleDot,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  GitPullRequest,
  Github,
  RefreshCw,
  ShieldCheck,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import EnergyCore from "../pixel/EnergyCore";
import CiCdPipeline from "./CiCdPipeline";
import { deliveryStats, useGitHubActions } from "../../hooks/useGitHubActions";
import {
  useGitHubLive,
  type GitHubEvent,
  type Issue,
} from "../../hooks/useGitHubLive";

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const KIND: Record<
  GitHubEvent["kind"],
  { label: string; color: string; Icon: LucideIcon }
> = {
  push: { label: "commit", color: "#fe8019", Icon: GitCommitHorizontal },
  pr: { label: "pr", color: "#83a598", Icon: GitPullRequest },
  issue: { label: "issue", color: "#fabd2f", Icon: CircleDot },
  star: { label: "star", color: "#b8bb26", Icon: Star },
  fork: { label: "fork", color: "#d3869b", Icon: GitFork },
  create: { label: "create", color: "#8ec07c", Icon: GitBranch },
  other: { label: "event", color: "#a89984", Icon: Zap },
};

const OPEN_COLOR = "#fabd2f";
const CLOSED_COLOR = "#8ec07c";
const URGENT_COLOR = "#fb4934";
const WEEK_MS = 7 * 24 * 3_600_000;

const hasLabel = (it: Issue, test: (name: string) => boolean) =>
  it.labels.some((l) => test(l.name.toLowerCase()));
const isUrgent = (it: Issue) => hasLabel(it, (n) => n === "p0" || n === "p1");
const isBlocked = (it: Issue) => hasLabel(it, (n) => n.startsWith("blocked"));
const isBug = (it: Issue) => hasLabel(it, (n) => n === "bug");

type Project = {
  repo: string;
  name: string;
  open: number;
  closed: number;
  urgent: number;
  blocked: number;
  bugs: number;
  updated: string;
};

type Tab = "abiertas" | "cerradas" | "actividad";

type NodeSpec = {
  key: string;
  side: "l" | "r";
  anchor: [number, number];
  elbow: [number, number];
  target: [number, number];
};

/** Posiciones en % de la cámara: cada stat apunta a una zona del cortex. */
const NODES: NodeSpec[] = [
  { key: "open", side: "l", anchor: [24, 17], elbow: [31, 17], target: [38, 36] },
  { key: "urgent", side: "l", anchor: [22, 50], elbow: [27, 50], target: [32, 50] },
  { key: "closed", side: "l", anchor: [24, 83], elbow: [31, 83], target: [38, 64] },
  { key: "progress", side: "r", anchor: [76, 17], elbow: [69, 17], target: [62, 36] },
  { key: "cicd", side: "r", anchor: [78, 50], elbow: [73, 50], target: [68, 50] },
  { key: "pulse", side: "r", anchor: [76, 83], elbow: [69, 83], target: [62, 64] },
];

type NodeData = {
  value: string | number;
  label: string;
  sub?: string;
  color: string;
  extra?: React.ReactNode;
  onClick?: () => void;
};

function IssueRow({ issue, onHover }: { issue: Issue; onHover: () => void }) {
  const open = issue.state === "open";
  const color = open ? (isUrgent(issue) ? URGENT_COLOR : OPEN_COLOR) : CLOSED_COLOR;
  const Icon = issue.redacted ? ShieldCheck : open ? CircleDot : CircleCheck;
  const Row = issue.redacted ? "div" : "a";
  const link = issue.redacted ? {} : { href: issue.url, target: "_blank", rel: "noreferrer" };
  return (
    <li onPointerEnter={onHover}>
      <Row {...link} className="data-row flex gap-2.5 no-underline" title={issue.redacted ? "Detalle reservado hasta su corrección" : undefined}>
        <Icon size={13} className="mt-0.5 shrink-0" style={{ color }} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2 font-mono text-[11px]">
            <span className="truncate text-[var(--blue)]">
              {issue.repo.split("/")[1]} <span style={{ color: OPEN_COLOR }}>#{issue.number}</span>
            </span>
            <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
              {timeAgo(open ? issue.updated_at : (issue.closed_at ?? issue.updated_at))}
            </span>
          </span>
          <span className={`block text-xs line-clamp-2 ${issue.redacted ? "italic text-[var(--text-muted)]" : "text-[var(--text-secondary)]"}`}>{issue.title}</span>
          {issue.labels.length > 0 && (
            <span className="mt-1 flex flex-wrap gap-x-1.5 font-mono text-[10px]">
              {issue.labels.slice(0, 3).map((l) => (
                <span key={l.name} style={{ color: l.color }}>
                  {l.name}
                </span>
              ))}
            </span>
          )}
        </span>
      </Row>
    </li>
  );
}

function EventRow({ event, onHover }: { event: GitHubEvent; onHover: () => void }) {
  const { label, color, Icon } = KIND[event.kind];
  return (
    <li onPointerEnter={onHover}>
      <a href={event.repo.url} target="_blank" rel="noreferrer" className="data-row flex gap-2.5 no-underline">
        <Icon size={13} className="mt-0.5 shrink-0" style={{ color }} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2 font-mono text-[11px]">
            <span className="truncate text-[var(--blue)]">{event.repo.name.split("/")[1]}</span>
            <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{timeAgo(event.created_at)}</span>
          </span>
          <span className="block text-xs text-[var(--text-secondary)] line-clamp-2">
            <span className="font-mono mr-1" style={{ color }}>
              {label}
            </span>
            {event.summary}
          </span>
        </span>
      </a>
    </li>
  );
}

export default function GitHubBrainSection() {
  const { events, issues, issuesTotal, hourly, loading, error, lastFetch, pulse, refresh, user } = useGitHubLive();
  const actions = useGitHubActions();
  const [kick, setKick] = useState(0);
  const [tab, setTab] = useState<Tab>("abiertas");
  const [repo, setRepo] = useState<string | null>(null);
  const [hot, setHot] = useState<number | null>(null);
  const bump = () => setKick((k) => k + 1);

  const open = useMemo(() => issues.filter((i) => i.state === "open"), [issues]);
  const closed = useMemo(() => issues.filter((i) => i.state === "closed"), [issues]);

  const projects = useMemo<Project[]>(() => {
    const map = new Map<string, Project>();
    for (const it of issues) {
      const p = map.get(it.repo) ?? {
        repo: it.repo,
        name: it.repo.split("/")[1],
        open: 0,
        closed: 0,
        urgent: 0,
        blocked: 0,
        bugs: 0,
        updated: it.updated_at,
      };
      if (it.state === "open") {
        p.open += 1;
        if (isUrgent(it)) p.urgent += 1;
        if (isBlocked(it)) p.blocked += 1;
        if (isBug(it)) p.bugs += 1;
      } else p.closed += 1;
      if (it.updated_at > p.updated) p.updated = it.updated_at;
      map.set(it.repo, p);
    }
    return [...map.values()].sort((a, b) => b.open - a.open || b.updated.localeCompare(a.updated));
  }, [issues]);

  const stats = useMemo(() => {
    const total = open.length + closed.length;
    const weekStart = lastFetch ? lastFetch - WEEK_MS : Infinity;
    return {
      urgent: open.filter(isUrgent).length,
      blocked: open.filter(isBlocked).length,
      closedWeek: closed.filter((i) => i.closed_at && new Date(i.closed_at).getTime() > weekStart).length,
      progress: total ? Math.round((closed.length / total) * 100) : 0,
      withWork: projects.filter((p) => p.open > 0).length,
      events24: hourly.reduce((a, b) => a + b, 0),
    };
  }, [open, closed, projects, hourly, lastFetch]);

  const delivery = useMemo(() => deliveryStats(actions.data?.runs ?? []), [actions.data]);
  const autoIssues = useMemo(() => issues.filter((i) => hasLabel(i, (n) => n === "ci-failure")).length, [issues]);

  const colors = useMemo(
    () => [...events.slice(0, 8).map((e) => KIND[e.kind].color), OPEN_COLOR, CLOSED_COLOR],
    [events],
  );

  const byRepo = <T,>(list: T[], key: (x: T) => string) => (repo ? list.filter((x) => key(x) === repo) : list);
  const feedOpen = byRepo(open, (i) => i.repo);
  const feedClosed = byRepo(closed, (i) => i.repo);
  const feedEvents = byRepo(events, (e) => e.repo.name);
  const peak = Math.max(1, ...hourly);
  const ready = issuesTotal !== null;
  const status = error ? "degradado" : loading && !events.length ? "iniciando" : "sincronizado";

  const show = (v: string | number) => (ready ? v : "--");
  const nodeData: Record<string, NodeData> = {
    open: {
      value: show(open.length),
      label: "abiertas",
      sub: "todos los repos",
      color: OPEN_COLOR,
      onClick: () => setTab("abiertas"),
    },
    urgent: {
      value: show(stats.urgent),
      label: "P0 / P1",
      sub: `${stats.blocked} bloqueadas`,
      color: URGENT_COLOR,
      onClick: () => setTab("abiertas"),
    },
    closed: {
      value: show(closed.length),
      label: "cerradas",
      sub: `${stats.closedWeek} en 7 días`,
      color: CLOSED_COLOR,
      onClick: () => setTab("cerradas"),
    },
    progress: {
      value: show(`${stats.progress}%`),
      label: "avance",
      color: "#83a598",
      extra: (
        <span className="block h-1 bg-[#32302f] mt-1.5">
          <span className="block h-full bg-[var(--aqua)] transition-all duration-700" style={{ width: `${stats.progress}%` }} />
        </span>
      ),
    },
    cicd: {
      value: delivery.rate === null ? "--" : `${delivery.rate}%`,
      label: "CI/CD verde",
      sub: `${delivery.deploys} deploys a prod`,
      color: "#b8bb26",
      onClick: () => document.getElementById("cortex-pipeline")?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    },
    pulse: {
      value: stats.events24,
      label: "pulso 24h",
      color: KIND.push.color,
      onClick: () => setTab("actividad"),
      extra: (
        <span className="flex items-end gap-px h-4 mt-1.5">
          {hourly.map((n, i) => (
            <span
              key={i}
              className="flex-1"
              style={{ height: `${Math.max(10, (n / peak) * 100)}%`, background: n ? KIND.push.color : "#32302f" }}
            />
          ))}
        </span>
      ),
    },
  };

  const tabs: { id: Tab; label: string; count: number; color: string }[] = [
    { id: "abiertas", label: "abiertas", count: feedOpen.length, color: OPEN_COLOR },
    { id: "cerradas", label: "cerradas", count: feedClosed.length, color: CLOSED_COLOR },
    { id: "actividad", label: "actividad", count: feedEvents.length, color: KIND.push.color },
  ];

  return (
    <section id="cerebro" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="observation cortex" />
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.5fr_0.85fr] gap-4">
          <div className="reveal stagger-2 panel hud p-4 md:p-5 flex flex-col order-2 lg:order-1 lg:h-[480px]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="section-comment !mb-0">proyectos</p>
              <button
                type="button"
                onClick={() => setRepo(null)}
                className={`model-tab ${repo === null ? "active" : ""}`}
                style={repo === null ? { color: "var(--aqua)", borderColor: "var(--aqua)" } : undefined}
              >
                todos
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[360px] lg:max-h-none">
              {!ready && <li className="data-row font-mono text-xs text-[var(--text-muted)]">leyendo repos…</li>}
              {projects.map((p) => {
                const total = p.open + p.closed;
                const pct = total ? Math.round((p.closed / total) * 100) : 0;
                const active = repo === p.repo;
                return (
                  <li key={p.repo}>
                    <button
                      type="button"
                      onClick={() => setRepo(active ? null : p.repo)}
                      onPointerEnter={bump}
                      aria-pressed={active}
                      className={`data-row block w-full text-left cursor-pointer ${active ? "is-active" : ""}`}
                    >
                      <span className="flex items-center justify-between gap-2 font-mono text-xs">
                        <span className="truncate text-[var(--text-primary)]">{p.name}</span>
                        <span className="shrink-0 text-[10px] text-[var(--text-muted)]">
                          {p.closed}/{total} · {timeAgo(p.updated)}
                        </span>
                      </span>
                      <span className="block h-1 bg-[#32302f] my-1.5">
                        <span
                          className="block h-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: p.open ? "var(--aqua)" : CLOSED_COLOR }}
                        />
                      </span>
                      <span className="flex flex-wrap gap-x-2 font-mono text-[10px]">
                        {p.open > 0 ? (
                          <span style={{ color: OPEN_COLOR }}>{p.open} abiertas</span>
                        ) : (
                          <span style={{ color: CLOSED_COLOR }}>al día</span>
                        )}
                        {p.urgent > 0 && <span style={{ color: URGENT_COLOR }}>{p.urgent} P0/P1</span>}
                        {p.blocked > 0 && <span className="text-[var(--purple)]">{p.blocked} bloqueadas</span>}
                        {p.bugs > 0 && <span className="text-[var(--gx-accent)]">{p.bugs} bugs</span>}
                        <span className="text-[var(--text-muted)]">{pct}%</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="reveal stagger-1 panel hud hud-aqua lab-chamber relative overflow-hidden order-1 lg:order-2 h-[420px] md:h-[480px]"
            onPointerLeave={() => setHot(null)}
          >
            <div className="cortex-rings" aria-hidden="true">
              <span className="cortex-ring cortex-ring-ticks" />
              <span className="cortex-ring cortex-ring-dash" />
              <span className="cortex-ring cortex-ring-arcs" />
              <span className="cortex-ring cortex-sweep" />
            </div>
            <EnergyCore burstKey={`${pulse}-${kick}`} colors={colors} radius={0.24} className="absolute inset-0" />

            <svg className="cortex-links hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {NODES.map((n, i) => (
                <polyline
                  key={n.key}
                  points={[n.anchor, n.elbow, n.target].map((p) => p.join(",")).join(" ")}
                  className={`cortex-link ${hot === i ? "is-hot" : ""}`}
                  style={{ "--c": nodeData[n.key].color } as CSSProperties}
                />
              ))}
            </svg>

            {NODES.map((n, i) => (
              <span
                key={n.key}
                className={`cortex-target hidden md:block ${hot === i ? "is-hot" : ""}`}
                style={{ left: `${n.target[0]}%`, top: `${n.target[1]}%`, "--c": nodeData[n.key].color } as CSSProperties}
                aria-hidden="true"
              />
            ))}

            {NODES.map((n, i) => {
              const d = nodeData[n.key];
              const pos: CSSProperties =
                n.side === "l"
                  ? { right: `${100 - n.anchor[0]}%`, top: `${n.anchor[1]}%` }
                  : { left: `${n.anchor[0]}%`, top: `${n.anchor[1]}%` };
              return (
                <button
                  key={n.key}
                  type="button"
                  className={`cortex-node hidden md:block ${n.side === "r" ? "text-right" : ""}`}
                  style={{ ...pos, "--c": d.color } as CSSProperties}
                  onPointerEnter={() => {
                    setHot(i);
                    bump();
                  }}
                  onClick={d.onClick}
                >
                  <span className="block font-pixel text-base leading-none" style={{ color: d.color }}>
                    {d.value}
                  </span>
                  <span className="block font-mono text-[10px] text-[var(--text-primary)] mt-1">{d.label}</span>
                  {d.extra ?? (d.sub && <span className="block font-mono text-[9px] text-[var(--text-muted)]">{d.sub}</span>)}
                </button>
              );
            })}

            <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[10px]">
              <span className="text-[var(--aqua)] tracking-wider">OBSERVATION CORTEX</span>
              <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <span
                  className="status-dot"
                  style={error ? { background: "var(--red)", boxShadow: "0 0 8px var(--red)" } : undefined}
                />
                {status}
              </span>
            </div>
            <p className="absolute bottom-3 inset-x-0 text-center font-mono text-[10px] text-[var(--text-muted)] hidden md:block">
              sync{" "}
              {lastFetch
                ? new Date(lastFetch).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })
                : "--:--"}{" "}
              · @{user}
            </p>

            <div className="absolute bottom-3 inset-x-3 grid grid-cols-3 gap-1.5 md:hidden">
              {NODES.map((n) => {
                const d = nodeData[n.key];
                return (
                  <button
                    key={n.key}
                    type="button"
                    className="cortex-node-mini"
                    style={{ "--c": d.color } as CSSProperties}
                    onClick={d.onClick}
                  >
                    <span className="block font-pixel text-sm leading-none" style={{ color: d.color }}>
                      {d.value}
                    </span>
                    <span className="block font-mono text-[9px] text-[var(--text-muted)] mt-1">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="reveal stagger-3 panel hud p-4 md:p-5 flex flex-col order-3 lg:h-[480px]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="section-comment !mb-0 truncate">
                {repo ? repo.split("/")[1] : "todo el trabajo"}
              </p>
              <span className="flex items-center gap-2">
                <a
                  href={repo ? `https://github.com/${repo}/issues` : `https://github.com/${user}`}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-btn"
                  aria-label="Abrir en GitHub"
                >
                  <Github size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    refresh();
                    bump();
                  }}
                  className="icon-btn"
                  aria-label="Sincronizar ahora"
                >
                  <RefreshCw size={14} />
                </button>
              </span>
            </div>

            <div role="tablist" aria-label="Vista del trabajo" className="grid grid-cols-3 gap-1.5 mb-3">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`model-tab !px-1 !text-[10px] ${tab === t.id ? "active" : ""}`}
                  style={tab === t.id ? { color: t.color, borderColor: t.color } : undefined}
                >
                  {t.label} · {t.count}
                </button>
              ))}
            </div>

            <ul key={`${tab}-${repo}`} className="panel-swap flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[360px] lg:max-h-none">
              {tab === "abiertas" && feedOpen.map((it) => <IssueRow key={it.id} issue={it} onHover={bump} />)}
              {tab === "cerradas" && feedClosed.map((it) => <IssueRow key={it.id} issue={it} onHover={bump} />)}
              {tab === "actividad" && feedEvents.map((e) => <EventRow key={e.id} event={e} onHover={bump} />)}
              {tab !== "actividad" && !ready && (
                <li className="data-row font-mono text-xs text-[var(--text-muted)]">leyendo issues…</li>
              )}
              {tab === "abiertas" && ready && !feedOpen.length && (
                <li className="data-row font-mono text-xs" style={{ color: CLOSED_COLOR }}>
                  sin issues abiertas · al día
                </li>
              )}
              {tab === "actividad" && !feedEvents.length && (
                <li className="data-row font-mono text-xs text-[var(--text-muted)]">
                  {error ? `no pude leer GitHub (${error})` : loading ? "despertando núcleo…" : "sin actividad pública reciente"}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div id="cortex-pipeline">
          <CiCdPipeline actions={actions} autoIssues={autoIssues} onActivity={bump} />
        </div>
      </div>
    </section>
  );
}
