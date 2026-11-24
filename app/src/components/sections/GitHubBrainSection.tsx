import { useMemo, useState, type CSSProperties } from "react";
import {
  CircleDot,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  GitPullRequest,
  Github,
  RefreshCw,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import SectionTitle from "./SectionTitle";
import EnergyCore from "../pixel/EnergyCore";
import {
  useGitHubLive,
  type GitHubEvent,
  type OpenIssue,
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

const HOLO_POS: CSSProperties[] = [
  { top: "12%", left: "4%", animationDelay: "0s" },
  { top: "20%", right: "4%", animationDelay: "1.4s" },
  { bottom: "18%", left: "6%", animationDelay: "2.6s" },
];

const ISSUE_COLOR = KIND.issue.color;

function HoloCard({
  style,
  color,
  head,
  repo,
  text,
}: {
  style: CSSProperties;
  color: string;
  head: string;
  repo: string;
  text: string;
}) {
  return (
    <div className="holo-card hidden md:block" style={style}>
      <p style={{ color }}>
        {">"} {head}
      </p>
      <p className="text-[#d5c4a1] truncate">{repo}</p>
      <p className="opacity-70 truncate">{text}</p>
    </div>
  );
}

function IssueItem({
  issue,
  index,
  onHover,
}: {
  issue: OpenIssue;
  index: number;
  onHover: () => void;
}) {
  return (
    <li
      className="stream-item stream-in border-b border-[#32302f] px-4 py-2.5"
      style={{ animationDelay: `${index * 35}ms` }}
      onPointerEnter={onHover}
    >
      <a
        href={issue.url}
        target="_blank"
        rel="noreferrer"
        className="flex gap-3 no-underline"
      >
        <span className="mt-0.5 shrink-0" style={{ color: ISSUE_COLOR }}>
          <CircleDot size={14} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-[var(--blue)] truncate">
              {issue.repo.split("/")[1]}{" "}
              <span className="text-[var(--yellow)]">#{issue.number}</span>
            </span>
            <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
              {timeAgo(issue.updated_at)}
            </span>
          </span>
          <span className="block text-xs text-[var(--text-secondary)] line-clamp-2">
            {issue.title}
          </span>
          {issue.labels.length > 0 && (
            <span className="mt-1.5 flex flex-wrap gap-1">
              {issue.labels.slice(0, 3).map((l) => (
                <span
                  key={l.name}
                  className="font-mono text-[9px] px-1.5 py-px border"
                  style={{
                    color: l.color,
                    borderColor: `${l.color}66`,
                    background: `${l.color}14`,
                  }}
                >
                  {l.name}
                </span>
              ))}
            </span>
          )}
        </span>
      </a>
    </li>
  );
}

export default function GitHubBrainSection() {
  const {
    events,
    issues,
    openIssues,
    loading,
    error,
    lastFetch,
    pulse,
    refresh,
    user,
  } = useGitHubLive();
  const [kick, setKick] = useState(0);
  const [tab, setTab] = useState<"issues" | "actividad">("issues");
  const bump = () => setKick((k) => k + 1);

  const colors = useMemo(
    () => [
      ...events.slice(0, 8).map((e) => KIND[e.kind].color),
      ...(issues.length ? [ISSUE_COLOR, ISSUE_COLOR] : []),
    ],
    [events, issues.length],
  );
  const stats = useMemo(() => {
    const counts: Partial<Record<GitHubEvent["kind"], number>> = {};
    for (const e of events) counts[e.kind] = (counts[e.kind] ?? 0) + 1;
    return counts;
  }, [events]);
  const repos = useMemo(
    () => new Set(events.map((e) => e.repo.name)).size,
    [events],
  );

  const status = error
    ? "degradado"
    : loading && !events.length
      ? "iniciando"
      : "sincronizado";

  return (
    <section id="cerebro" className="section">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="reveal">
          <SectionTitle comment="lab cortex" />
        </div>

        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-4">
          <div className="reveal stagger-1 panel hud hud-aqua lab-chamber relative min-h-[440px] md:min-h-[500px] overflow-hidden">
            <div className="holo-floor" aria-hidden="true" />
            <EnergyCore
              burstKey={`${pulse}-${kick}`}
              colors={colors}
              className="absolute inset-0"
            />

            <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono text-[10px]">
              <span className="text-[var(--aqua)]">SEBAS CORTEX · v2</span>
              <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <span
                  className="status-dot"
                  style={
                    error
                      ? {
                          background: "var(--red)",
                          boxShadow: "0 0 8px var(--red)",
                        }
                      : undefined
                  }
                />
                {status}
              </span>
            </div>

            {issues.length > 0
              ? issues
                  .slice(0, 3)
                  .map((it, i) => (
                    <HoloCard
                      key={it.id}
                      style={HOLO_POS[i]}
                      color={ISSUE_COLOR}
                      head={`issue abierta · ${timeAgo(it.updated_at)}`}
                      repo={`${it.repo.split("/")[1]} #${it.number}`}
                      text={it.title}
                    />
                  ))
              : events
                  .slice(0, 3)
                  .map((e, i) => (
                    <HoloCard
                      key={e.id}
                      style={HOLO_POS[i]}
                      color={KIND[e.kind].color}
                      head={`${KIND[e.kind].label} · ${timeAgo(e.created_at)}`}
                      repo={e.repo.name.split("/")[1]}
                      text={e.summary}
                    />
                  ))}

            <div className="absolute bottom-3 left-4 right-4 grid grid-cols-3 gap-2 font-mono text-[10px]">
              <div className="border border-[rgba(142,192,124,0.3)] bg-[rgba(29,32,33,0.7)] px-2 py-1.5">
                <p className="text-[var(--text-muted)]">issues abiertas</p>
                <p className="font-pixel text-base text-[var(--yellow)]">
                  {openIssues ?? "--"}
                </p>
              </div>
              <div className="border border-[rgba(142,192,124,0.3)] bg-[rgba(29,32,33,0.7)] px-2 py-1.5">
                <p className="text-[var(--text-muted)]">repos activos</p>
                <p className="font-pixel text-base text-[var(--aqua)]">
                  {repos}
                </p>
              </div>
              <div className="border border-[rgba(142,192,124,0.3)] bg-[rgba(29,32,33,0.7)] px-2 py-1.5">
                <p className="text-[var(--text-muted)]">última sync</p>
                <p className="font-pixel text-base text-[var(--gx-accent)]">
                  {lastFetch
                    ? new Date(lastFetch).toLocaleTimeString("es-CL", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "--:--"}
                </p>
              </div>
            </div>
          </div>

          <div className="reveal stagger-2 panel flex flex-col max-h-[500px]">
            <div className="px-4 py-3 border-b border-[#3c3836] flex items-center justify-between gap-2">
              <a
                href={`https://github.com/${user}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-[var(--blue)] hover:text-[var(--gx-accent)] transition-colors"
              >
                <Github size={14} /> @{user}
              </a>
              <button
                type="button"
                onClick={() => {
                  refresh();
                  setKick((k) => k + 1);
                }}
                className="icon-btn"
                aria-label="Sincronizar ahora"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            <div
              className="px-4 py-2 flex gap-1.5 border-b border-[#3c3836]"
              role="tablist"
              aria-label="Vista del laboratorio"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "issues"}
                className={`chip-btn ${tab === "issues" ? "active" : ""}`}
                style={{ "--accent-color": ISSUE_COLOR } as CSSProperties}
                onClick={() => setTab("issues")}
              >
                <CircleDot size={12} /> issues activas · {openIssues ?? "…"}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "actividad"}
                className={`chip-btn ${tab === "actividad" ? "active" : ""}`}
                style={{ "--accent-color": KIND.push.color } as CSSProperties}
                onClick={() => setTab("actividad")}
              >
                <Zap size={12} /> actividad · {events.length}
              </button>
            </div>

            {tab === "issues" ? (
              <ul key="issues" className="flex-1 overflow-y-auto">
                {!issues.length && (
                  <li className="px-4 py-6 font-mono text-xs text-[var(--text-muted)]">
                    leyendo issues abiertas…
                  </li>
                )}
                {issues.map((it, i) => (
                  <IssueItem key={it.id} issue={it} index={i} onHover={bump} />
                ))}
                {openIssues !== null && openIssues > issues.length && (
                  <li className="px-4 py-3">
                    <a
                      href={`https://github.com/issues?q=${encodeURIComponent(`is:open is:issue user:${user}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-[var(--blue)] hover:text-[var(--gx-accent)]"
                    >
                      ver las {openIssues} en GitHub →
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <>
                <div className="px-4 py-2 flex flex-wrap gap-1.5 border-b border-[#3c3836]">
                  {(["push", "pr", "issue", "create"] as const).map((kind) => {
                    const { label, color, Icon } = KIND[kind];
                    return (
                      <span
                        key={kind}
                        className="tag"
                        style={{ color, borderColor: `${color}66` }}
                      >
                        <Icon size={11} /> {label} {stats[kind] ?? 0}
                      </span>
                    );
                  })}
                </div>

                <ul key="actividad" className="flex-1 overflow-y-auto">
                  {loading && !events.length && (
                    <li className="px-4 py-6 font-mono text-xs text-[var(--text-muted)]">
                      despertando núcleo…
                    </li>
                  )}
                  {!loading && !events.length && !error && (
                    <li className="px-4 py-6 font-mono text-xs text-[var(--text-muted)]">
                      sin eventos públicos recientes
                    </li>
                  )}
                  {error && !events.length && (
                    <li className="px-4 py-6 font-mono text-xs text-[var(--red)]">
                      no pude leer GitHub ({error})
                    </li>
                  )}
                  {events.map((e, i) => {
                    const { label, color, Icon } = KIND[e.kind];
                    return (
                      <li
                        key={e.id}
                        className="stream-item stream-in border-b border-[#32302f] px-4 py-2.5"
                        style={{ animationDelay: `${i * 35}ms` }}
                        onPointerEnter={bump}
                      >
                        <a
                          href={e.repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex gap-3 no-underline"
                        >
                          <span className="mt-0.5 shrink-0" style={{ color }}>
                            <Icon size={14} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] text-[var(--blue)] truncate">
                                {e.repo.name}
                              </span>
                              <span className="font-mono text-[10px] text-[var(--text-muted)] shrink-0">
                                {timeAgo(e.created_at)}
                              </span>
                            </span>
                            <span className="block text-xs text-[var(--text-secondary)] line-clamp-2">
                              <span
                                className="font-pixel mr-1"
                                style={{ color }}
                              >
                                {label}
                              </span>
                              {e.summary}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
