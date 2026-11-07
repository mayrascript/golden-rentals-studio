import { expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { guideHref, renderGuideMarkdown } from '../workshop/site/render.js';
import { steps } from '../workshop/site/steps.js';

it('enlaza todos los módulos locales de la guía con rutas de la web', async () => {
  expect(steps.filter(step => step.number && step.number > 0)).toHaveLength(8);
  for (const step of steps) {
    const markdown = await readFile(`workshop/guide/${step.file}`, 'utf8');
    for (const match of markdown.matchAll(/\[[^\]]+\]\(([^)]+\.md)\)/g)) {
      expect(guideHref(match[1]), `Enlace de ${step.file}`).toMatch(/^#\//);
    }
  }
});

it('muestra código copiable como texto, sin ejecutar HTML del documento', () => {
  const html = renderGuideMarkdown('```ts\nconst x = "<script>&";\n```\n\n<script>alert(1)</script>');
  expect(html).toContain('const x = &quot;&lt;script&gt;&amp;&quot;;');
  expect(html).toContain('class="copy-code"');
  expect(html).not.toContain('<script>');
});

it('rechaza enlaces ejecutables y conserva enlaces de consulta seguros', () => {
  expect(guideHref('javascript:alert(1)')).toBeNull();
  expect(guideHref('data:text/html,hello')).toBeNull();
  expect(guideHref('README.md')).toBe('#/inicio');
  expect(guideHref('https://github.com/mayrascript/multiagent-adk-workshop')).toMatch(/^https:/);
});

it('permite las ilustraciones locales sin cargar imágenes externas ni rutas arbitrarias', () => {
  const html = renderGuideMarkdown('![Una tool](../assets/tool-illustration.png)\n\n![Externa](https://example.com/tracker.png)\n\n![Privada](../../.env)');
  expect(html).toContain('src="./guide-assets/tool-illustration.png"');
  expect(html).toContain('alt="Una tool"');
  expect(html.match(/<img\b/g)).toHaveLength(1);
  expect(html).not.toContain('https://example.com/tracker.png');
  expect(html).not.toContain('../../.env');
});

it('incluye los 14 TODO con sus fragmentos de solución en la guía generada', async () => {
  let total = 0;
  for (const step of steps) {
    if (!('exercise' in step)) continue;
    const markdown = await readFile(`workshop/guide/${step.file}`, 'utf8');
    const source = await readFile(`workshop/solution/${step.exercise}`, 'utf8');
    for (const match of source.matchAll(/@solution:start ([\d.]+)/g)) {
      expect(markdown).toContain(`### TODO ${match[1]}`);
      expect(renderGuideMarkdown(markdown)).toContain(`TODO ${match[1]}</h3>`);
      total++;
    }
  }
  expect(total).toBe(14);
});

it('renderiza ayudas desplegables sin permitir atributos o HTML ejecutable', () => {
  const html = renderGuideMarkdown('<details>\n<summary>Instalar herramientas</summary>\n\n```sh\nnode --version\n```\n\n<script>alert(1)</script>\n</details>');
  expect(html).toContain('<details class="guide-details">');
  expect(html).toContain('<summary>Instalar herramientas</summary>');
  expect(html).toContain('copy-code');
  expect(html).not.toContain('<script>');
  expect(renderGuideMarkdown('<details onclick="alert(1)">x</details>')).not.toContain('<details onclick');
});

it('resalta información importante y mantiene el texto accesible', () => {
  const html = renderGuideMarkdown('> [!IMPORTANT]\n> Definir no es ejecutar.');
  expect(html).toContain('class="info-card info-important"');
  expect(html).toContain('Definir no es ejecutar.');
  expect(html).not.toContain('[!IMPORTANT]');
});
