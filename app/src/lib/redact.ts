/** Hallazgos de seguridad sin corregir no se publican: el portafolio no debe servir de guía de ataque. */
const SENSITIVE =
  /(token|cors|contraseñ|password|seguridad|security|\.env|credencial|\bcsp\b|xss|inyecci|injection|secret|vulnerab|bypass|sesión|session|\bauth|entra al admin|permis)/i;

export const isSensitiveText = (text: string) => SENSITIVE.test(text);

export function isSensitiveIssue(issue: { state: string; title: string; labels: { name: string }[] }) {
  if (issue.state !== 'open') return false;
  return issue.labels.some((l) => l.name.toLowerCase() === 'area:seguridad') || isSensitiveText(issue.title);
}

export const REDACTED_TITLE = 'hallazgo de seguridad · en corrección';
