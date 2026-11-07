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
  renderer.blockquote = function ({ tokens }) {
    const content = this.parser.parse(tokens);
    const kind = content.match(/^<p>\[!(TIP|NOTE|IMPORTANT|WARNING)\]/)?.[1];
    if (!kind) return `<blockquote>${content}</blockquote>`;
    const labels: Record<string, string> = { TIP: 'Para avanzar', NOTE: 'Contexto útil', IMPORTANT: 'Qué debes recordar', WARNING: 'Antes de continuar' };
    return `<aside class="info-card info-${kind.toLowerCase()}" aria-label="${labels[kind]}"><strong class="info-label">${labels[kind]}</strong>${content.replace(/\[!(TIP|NOTE|IMPORTANT|WARNING)\]\s*/, '')}</aside>`;
  };
  renderer.image = ({ href, text }) => {
    // La única imagen de la guía está incluida en el repo; no cargamos URLs arbitrarias.
    if (href !== '../assets/workshop-architecture.png') return escapeHtml(text);
    const src = './guide-assets/workshop-architecture.png';
    return `<figure class="architecture-figure"><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Ampliar el diagrama de arquitectura"><img src="${src}" alt="${escapeHtml(text)}" width="2048" height="1152" loading="lazy"></a><figcaption>Arquitectura del proyecto en TypeScript. <a href="${src}" target="_blank" rel="noopener noreferrer">Abrir diagrama en tamaño completo ↗</a></figcaption></figure>`;
  };
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
  // Solo aceptamos este componente editorial; el resto del HTML sigue escapado.
  marked.use({ extensions: [{
    name: 'guideDisclosure', level: 'block',
    start: source => source.indexOf('<details>'),
    tokenizer(source) {
      const match = /^<details>\s*\n<summary>([^\n<>]+)<\/summary>\s*\n([\s\S]*?)\n<\/details>(?:\n|$)/.exec(source);
      if (match) return { type: 'guideDisclosure', raw: match[0], title: match[1], body: match[2] };
      return undefined;
    },
    renderer: token => `<details class="guide-details"><summary>${escapeHtml(token.title)}</summary><div class="details-body">${marked.parse(token.body)}</div></details>`,
  }] });
  return marked.parse(markdown.replace(/^# [^\n]+\n+/, '')) as string;
}
