import { useMemo, useState, type CSSProperties } from "react";
import { ChevronRight, CircleCheck, CircleX, ExternalLink, Loader, MinusCircle, RefreshCw } from "lucide-react";
import { STAGES, type Run, type RunStatus, type Source, type StageId, type useGitHubActions } from "../../hooks/useGitHubActions";

const STATUS: Record<RunStatus, { color: string; label: string; Icon: typeof CircleCheck }> = {
  success: { color: "#b8bb26", label: "ok", Icon: CircleCheck },
  failure: { color: "#fb4934", label: "falló", Icon: CircleX },
  running: { color: "#fabd2f", label: "corriendo", Icon: Loader },
  other: { color: "#7c6f64", label: "omitido", Icon: MinusCircle },
};

const SOURCE: Record<Source, { label: string; color: string }> = {
  live: { label: "en vivo", color: "#8ec07c" },
  mixed: { label: "en vivo + snapshot", color: "#fabd2f" },
  snapshot: { label: "snapshot del último deploy", color: "#fe8019" },
};

const HISTORY = 14;

function ago(iso: string, now: number) {
  const m = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60_000));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return h < 48 ? `${h}h` : `${Math.floor(h / 24)}d`;
}

function duration(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, "0")}s`;
}

function summarize(runs: Run[]) {
  const done = runs.filter((r) => r.status === "success" || r.status === "failure");
  const ok = done.filter((r) => r.status === "success").length;
  const timed = done.flatMap((r) => (r.durationS === null ? [] : [r.durationS])).sort((a, b) => a - b);
  return {
    runs: runs.length,
    ok,
    failed: done.length - ok,
    rate: done.length ? Math.round((ok / done.length) * 100) : null,
    median: timed.length ? timed[Math.floor(timed.length / 2)] : null,
    last: runs[0] ?? null,
    history: runs.slice(0, HISTORY).reverse(),
  };
}

type Props = {
  actions: ReturnType<typeof useGitHubActions>;
  autoIssues: number;
  onActivity?: () => void;
};

export default function CiCdPipeline({ actions, autoIssues, onActivity }: Props) {
  const { data, error, loading, refresh, user } = actions;
  const [stage, setStage] = useState<StageId | null>(null);
  const now = data?.at ?? 0;

  const byStage = useMemo(() => {
    const runs = data?.runs ?? [];
    return Object.fromEntries(STAGES.map((s) => [s.id, summarize(runs.filter((r) => r.stage === s.id))])) as Record<
      StageId,
      ReturnType<typeof summarize>
    >;
  }, [data]);

  const delivery = useMemo(() => {
    const runs = data?.runs ?? [];
    const deploys = runs.filter((r) => r.stage === "prod" && r.status === "success");
    return { ...summarize(runs), deploys: deploys.length, lastDeploy: deploys[0] ?? null };
  }, [data]);

  const list = useMemo(() => {
    const pool = (data?.runs ?? []).filter((r) => !stage || r.stage === stage);
    const seen = new Set<string>();
    const latestPerRepo = pool.filter((r) => !seen.has(r.repo) && seen.add(r.repo));
    const rest = pool.filter((r) => !latestPerRepo.includes(r));
    return [...latestPerRepo, ...rest].slice(0, 9);
  }, [data, stage]);
  const active = STAGES.find((s) => s.id === stage);

  return (
    <div className="reveal stagger-4 panel hud p-4 md:p-5 mt-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="section-comment !mb-1 flex items-center gap-2">
            pipeline ci/cd · github actions
            {data && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] normal-case" style={{ color: SOURCE[data.source].color }}>
                <span className="status-dot" style={{ background: SOURCE[data.source].color, boxShadow: `0 0 8px ${SOURCE[data.source].color}` }} />
                {SOURCE[data.source].label}
                {data.snapshotAt && ` · ${new Date(data.snapshotAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}`}
              </span>
            )}
          </p>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Cada push o PR pasa por CI, contrato de API y review; luego staging y producción. Si el CI falla, un workflow abre
            la issue solo{autoIssues ? ` (${autoIssues} registradas con ci-failure)` : ""}. Cada ejecución enlaza a su log real en GitHub.
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--text-muted)]">
          {data && (
            <span className="text-right leading-snug">
              <span className="font-pixel text-sm text-[var(--aqua)]">{data.totalRuns.toLocaleString("es-CL")}</span>{" "}
              ejecuciones
              <br />
              {data.repos} repos · {delivery.deploys} deploys a producción
              {delivery.lastDeploy && ` · último ${ago(delivery.lastDeploy.started, now)}`}
            </span>
          )}
          <a href={`https://github.com/${user}?tab=repositories`} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Ver repos en GitHub">
            <ExternalLink size={14} />
          </a>
          <button type="button" onClick={refresh} className="icon-btn" aria-label="Releer GitHub Actions" disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
        {STAGES.map((s, i) => {
          const st = byStage[s.id];
          const on = stage === s.id;
          return (
            <li key={s.id} className="relative">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setStage(on ? null : s.id)}
                onPointerEnter={onActivity}
                className={`data-row block w-full h-full text-left cursor-pointer ${on ? "is-active" : ""}`}
                style={on ? ({ borderColor: s.color } as CSSProperties) : undefined}
              >
                <span className="flex items-center justify-between font-mono text-[10px]">
                  <span style={{ color: s.color }}>
                    {String(i + 1).padStart(2, "0")} {s.label}
                  </span>
                  {st.last && <span className="text-[var(--text-muted)]">{ago(st.last.started, now)}</span>}
                </span>
                <span className="block font-pixel text-lg leading-none mt-2" style={{ color: st.rate === null ? "var(--text-muted)" : s.color }}>
                  {st.rate === null ? "--" : `${st.rate}%`}
                </span>
                <span className="block font-mono text-[9px] text-[var(--text-muted)] mt-1 truncate">{s.detail}</span>
                <span className="flex gap-[2px] mt-2 h-2" aria-label={`${st.ok} ok, ${st.failed} fallas`}>
                  {Array.from({ length: HISTORY }, (_, k) => {
                    const run = st.history[k - (HISTORY - st.history.length)];
                    return (
                      <span
                        key={k}
                        className="flex-1"
                        style={{ background: run ? STATUS[run.status].color : "#32302f", opacity: run ? 0.9 : 1 }}
                      />
                    );
                  })}
                </span>
                <span className="flex justify-between font-mono text-[9px] mt-1.5">
                  <span className="text-[var(--text-muted)]">
                    {st.runs ? (
                      <>
                        {st.ok} ok{st.failed ? <span style={{ color: STATUS.failure.color }}> · {st.failed} ✕</span> : null}
                      </>
                    ) : (
                      "sin ejecuciones recientes"
                    )}
                  </span>
                  {st.median !== null && <span className="text-[var(--text-muted)]">~{duration(st.median)}</span>}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <ChevronRight
                  size={12}
                  className="hidden lg:block absolute top-1/2 -right-[11px] -translate-y-1/2 text-[var(--text-muted)] z-10"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-center justify-between gap-2 mt-4 mb-2">
        <p className="font-mono text-[10px] text-[var(--text-muted)]">
          {active ? (
            <>
              últimas ejecuciones · <span style={{ color: active.color }}>{active.label}</span>
            </>
          ) : (
            "última ejecución de cada repo · todas las etapas"
          )}
        </p>
        {stage && (
          <button type="button" onClick={() => setStage(null)} className="model-tab !text-[10px]">
            ver todas
          </button>
        )}
      </div>

      <ul key={stage ?? "all"} className="panel-swap grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
        {list.map((r) => {
          const { color, label, Icon } = STATUS[r.status];
          const tone = STAGES.find((s) => s.id === r.stage)!.color;
          return (
            <li key={r.id}>
              <a href={r.url} target="_blank" rel="noreferrer" className="data-row flex gap-2.5 no-underline h-full" onPointerEnter={onActivity}>
                <Icon size={13} className={`mt-0.5 shrink-0 ${r.status === "running" ? "animate-spin" : ""}`} style={{ color }} aria-label={label} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="truncate text-[var(--blue)]">
                      {r.repo} <span style={{ color: tone }}>· {r.workflow}</span>
                    </span>
                    <span className="shrink-0 text-[10px] text-[var(--text-muted)]">{ago(r.started, now)}</span>
                  </span>
                  <span className="block text-xs text-[var(--text-secondary)] truncate">{r.title}</span>
                  <span className="block font-mono text-[10px] text-[var(--text-muted)] truncate">
                    {r.branch} · {r.event}
                    {r.durationS !== null && ` · ${duration(r.durationS)}`}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
        {!data && (
          <li className="data-row font-mono text-xs text-[var(--text-muted)] sm:col-span-2 lg:col-span-3">
            {error ? `no pude leer GitHub Actions (${error}) · reintenta en unos minutos` : "leyendo workflows…"}
          </li>
        )}
      </ul>
    </div>
  );
}
