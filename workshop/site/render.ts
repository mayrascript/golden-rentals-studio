import { Marked, Renderer } from 'marked';
import { repository, routeForFile } from './steps.js';

export function escapeHtml(text: string) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function guideHref(href: string): string | null {
  const route = routeForFile(href.replace(/^\.\//, ''));
  if (route) return `#/${route}`;
  if (/^https?:\/\//i.test(href) || href.startsWith('#/')) return href;
  if (!/^[a-z][a-z\d+.-]*:/i.test(href) && !href.startsWith('//')) {
    return `${repository}/blob/main/workshop/guide/${href}`;
  }
  return null;
}

// El HTML sale de archivos explícitos del temario, nunca de campañas o del .env.
// Escapamos HTML y código: un fragmento pegable se muestra como texto, no se ejecuta.
export function renderGuideMarkdown(markdown: string): string {
  const renderer = new Renderer();
  renderer.html = ({ text }) => escapeHtml(text);
  renderer.code = ({ text, lang }) => {
    const label = lang === 'ts' ? 'TypeScript' : ['sh', 'bash'].includes(lang ?? '') ? 'Terminal' : 'Código';
    return `<div class="code-block"><div class="code-toolbar"><span>${label}</span><button type="button" class="copy-code" aria-label="Copiar bloque de código">Copiar</button></div><pre tabindex="0"><code>${escapeHtml(text)}</code></pre></div>`;
  };
  renderer.link = function ({ href, tokens }) {
    const target = guideHref(href);
    const label = this.parser.parseInline(tokens);
    if (!target) return label;
    return `<a href="${escapeHtml(target)}"${target.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
  };
  const table = renderer.table;
  renderer.table = function (token) {
    return `<div class="table-scroll" tabindex="0" role="region" aria-label="Tabla desplazable">${table.call(this, token)}</div>`;
  };
  const marked = new Marked({ renderer, gfm: true, async: false });
  return marked.parse(markdown.replace(/^# [^\n]+\n+/, '')) as string;
}
