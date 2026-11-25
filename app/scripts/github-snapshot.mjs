// Snapshot de GitHub Actions para el cortex: respaldo cuando la API pública agota su cuota.
import { writeFile } from 'node:fs/promises';

const USER = 'felipebarraza6';
const REPOS = ['proyecto-90', 'frig', 'muninn', 'heir', 'forja', 'nxord', 'gungir', 'nxrd_apr', 'portafolio_fbarraza'];
// Mismo patrón que src/lib/redact.ts: el JSON es público y no debe describir hallazgos abiertos.
const SENSITIVE =
  /(token|cors|contraseñ|password|seguridad|security|\.env|credencial|\bcsp\b|xss|inyecci|injection|secret|vulnerab|bypass|sesión|session|\bauth|entra al admin|permis)/i;
const FIELDS = ['id', 'name', 'status', 'conclusion', 'event', 'head_branch', 'run_started_at', 'created_at', 'updated_at', 'html_url'];

const headers = { Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const repos = [];
for (const repo of REPOS) {
  const res = await fetch(`https://api.github.com/repos/${USER}/${repo}/actions/runs?per_page=40`, { headers });
  if (!res.ok) {
    console.warn(`snapshot: ${repo} → HTTP ${res.status}`);
    continue;
  }
  const data = await res.json();
  const runs = data.workflow_runs.map((raw) => {
    const run = Object.fromEntries(FIELDS.map((k) => [k, raw[k]]));
    const title = String(raw.display_title ?? '').split('\n')[0];
    run.display_title = SENSITIVE.test(title) ? 'detalle reservado' : title;
    return run;
  });
  repos.push({ repo, total: data.total_count, runs });
}

const out = new URL('../public/github-snapshot.json', import.meta.url);
await writeFile(out, JSON.stringify({ at: Date.now(), repos }));
console.log(`snapshot: ${repos.length}/${REPOS.length} repos`);
