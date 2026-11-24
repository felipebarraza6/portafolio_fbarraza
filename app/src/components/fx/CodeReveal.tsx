import type { CSSProperties } from 'react';
import type { CodeLine } from '../../lib/codegen';

export default function CodeReveal({ lines, file }: { lines: CodeLine[]; file: string }) {
  return (
    <div className="code-layer" aria-hidden="true">
      <div className="code-head">
        <span className="code-dot" style={{ background: '#fb4934' }} />
        <span className="code-dot" style={{ background: '#fabd2f' }} />
        <span className="code-dot" style={{ background: '#b8bb26' }} />
        <span className="ml-2">~/felipe/{file}</span>
      </div>
      <pre className="code-body">
        {lines.map((line, i) => (
          <div key={i} className="code-line" style={{ '--i': i } as CSSProperties}>
            <span className="code-ln">{i + 1}</span>
            {line.map((tok, j) => (
              <span key={j} style={tok.c ? { color: tok.c } : undefined}>
                {tok.t}
              </span>
            ))}
          </div>
        ))}
        <span className="code-cursor" />
      </pre>
    </div>
  );
}
