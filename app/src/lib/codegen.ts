export type CodeToken = { t: string; c?: string };
export type CodeLine = CodeToken[];

const C = {
  kw: '#fb4934',
  id: '#fabd2f',
  key: '#83a598',
  str: '#b8bb26',
  num: '#d3869b',
  p: '#a89984',
  com: '#928374',
};

export function toIdent(name: string) {
  const id = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, ch: string | undefined) => (ch ? ch.toUpperCase() : ''))
    .replace(/^./, (c) => c.toLowerCase());
  return /^[a-zA-Z_]/.test(id) ? id : `_${id}`;
}

function wrap(text: string, width: number) {
  const words = text.split(' ');
  const out: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + w).length > width && line) {
      out.push(line.trimEnd());
      line = '';
    }
    line += `${w} `;
  }
  if (line.trim()) out.push(line.trimEnd());
  return out;
}

function inline(v: unknown): CodeLine {
  if (typeof v === 'string') return [{ t: `'${v.replace(/'/g, "\\'")}'`, c: C.str }];
  if (typeof v === 'number' || typeof v === 'boolean') return [{ t: String(v), c: C.num }];
  if (Array.isArray(v)) {
    const toks: CodeLine = [{ t: '[', c: C.p }];
    v.forEach((item, i) => {
      toks.push(...inline(item));
      if (i < v.length - 1) toks.push({ t: ', ', c: C.p });
    });
    toks.push({ t: ']', c: C.p });
    return toks;
  }
  return [{ t: 'null', c: C.kw }];
}

export function toCode(name: string, obj: Record<string, unknown>, comment?: string): CodeLine[] {
  const lines: CodeLine[] = [];
  if (comment) lines.push([{ t: `// ${comment}`, c: C.com }]);
  lines.push([
    { t: 'export const ', c: C.kw },
    { t: toIdent(name), c: C.id },
    { t: ' = {', c: C.p },
  ]);

  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    const key: CodeToken = { t: k, c: C.key };

    if (Array.isArray(v) && v.join(', ').length > 34) {
      lines.push([{ t: '  ' }, key, { t: ': [', c: C.p }]);
      v.forEach((item) => lines.push([{ t: '    ' }, ...inline(item), { t: ',', c: C.p }]));
      lines.push([{ t: '  ],', c: C.p }]);
    } else if (typeof v === 'string' && v.length > 36) {
      lines.push([{ t: '  ' }, key, { t: ':', c: C.p }]);
      const chunks = wrap(v, 34);
      chunks.forEach((chunk, i) =>
        lines.push([
          { t: '    ' },
          { t: `'${chunk.replace(/'/g, "\\'")}${i < chunks.length - 1 ? ' ' : ''}'`, c: C.str },
          { t: i < chunks.length - 1 ? ' +' : ',', c: C.p },
        ]),
      );
    } else {
      lines.push([{ t: '  ' }, key, { t: ': ', c: C.p }, ...inline(v), { t: ',', c: C.p }]);
    }
  }

  lines.push([{ t: '};', c: C.p }]);
  return lines;
}
