import { mkdir, readFile, writeFile, readdir, unlink, copyFile } from 'node:fs/promises';
import QRCode from 'qrcode';
import { createHash } from 'node:crypto';
import { transpileModule, ScriptTarget, ModuleKind } from 'typescript';
import { steps, repository, notionGuide, siteUrl, workshopName, workshopSubtitle, workshopTitle } from '../workshop/site/steps.js';
import { escapeHtml, renderGuideMarkdown } from '../workshop/site/render.js';
import { illustrations } from '../workshop/site/illustrations.js';

const output = 'docs/guide-assets';
await mkdir(output, { recursive: true });
// Consumimos los recursos versionados de la skill: no duplicamos la paleta.
const brandAssets = '.agents/skills/mayrascript-brand/assets';
const css = (await Promise.all([
  `${brandAssets}/brand-fonts.css`,
  `${brandAssets}/brand-tokens.css`,
  'workshop/site/style.css',
].map(file => readFile(file, 'utf8')))).join('\n');
for (const file of ['mayrascript-isotipo.png', 'ibm-plex-mono-regular.ttf', 'ibm-plex-mono-bold.ttf', 'OFL.txt']) {
  await copyFile(`${brandAssets}/${file}`, `${output}/${file}`);
}
const client = transpileModule(await readFile('workshop/site/client.ts', 'utf8'), {
  compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.ES2022 },
}).outputText;
const theme = transpileModule(await readFile('workshop/site/theme.ts', 'utf8'), {
  compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
}).outputText;
const hash = (source: string) => createHash('sha256').update(source).digest('hex').slice(0, 12);
const cssName = `style.${hash(css)}.css`;
const jsName = `client.${hash(client)}.js`;
const themeName = `theme.${hash(theme)}.js`;
// Solo retiramos versiones anteriores de los estilos y scripts generados.
for (const name of await readdir(output)) {
  if (/^(style\.[a-f0-9]+\.css|(?:client|theme)\.[a-f0-9]+\.js)$/.test(name) && ![cssName, jsName, themeName].includes(name)) await unlink(`${output}/${name}`);
}
await writeFile(`${output}/${cssName}`, css);
await writeFile(`${output}/${jsName}`, client);
await writeFile(`${output}/${themeName}`, theme);
await writeFile('docs/.nojekyll', '');
for (const name of Object.keys(illustrations)) {
  await copyFile(`workshop/assets/${name}`, `${output}/${name}`);
}
await writeFile(`${output}/workshop-qr.svg`, await QRCode.toString(siteUrl, { type: 'svg', errorCorrectionLevel: 'M', margin: 4, width: 256 }));
// Retiramos únicamente el favicon genérico sustituido por el isotipo original.
if ((await readdir(output)).includes('icon.svg')) await unlink(`${output}/icon.svg`);

const navigation = (resource: boolean) => steps.filter(step => (step.number === null) === resource).map(step => {
  const marker = step.number === null ? (step.id === 'laboratorio' ? '◇' : '☷') : step.number === 0 ? '⌂' : String(step.number).padStart(2, '0');
  return `<li><a class="step-link" href="#/${step.id}" data-nav="${step.id}"${step.id === 'inicio' ? ' aria-current="step"' : ''}><span class="step-number" data-number="${marker}" aria-hidden="true">${marker}</span><span class="step-label">${escapeHtml(step.label)}${'minutes' in step ? ` <small class="step-duration">${step.minutes} min aprox.</small>` : ''}</span></a></li>`;
}).join('\n');

const sections: string[] = [];
for (const step of steps) {
  // Allowlist del temario: no se recorre el repositorio ni se leen datos personales.
  let source = await readFile(`workshop/guide/${step.file}`, 'utf8');
  source = source.replace(/^\[(?:Seguir este recorrido en Notion|Abrir la guía web con menú lateral)\].*\n?/m, '').replace(/^\[Volver al recorrido\]\(README.md\)\s*$/m, '');
  const exercise = 'exercise' in step ? step.exercise : null;
  const links = `<div class="step-tools"><a href="${repository}/blob/starter/workshop/guide/${step.file}" target="_blank" rel="noopener noreferrer">↗ Ver guía en GitHub</a>${exercise ? `<a href="${repository}/blob/starter/workshop/exercises/${exercise}" target="_blank" rel="noopener noreferrer">⌘ Abrir ejercicio</a><a href="${repository}/blob/main/workshop/exercises/${exercise}" target="_blank" rel="noopener noreferrer">✓ Ver solución</a>` : ''}</div>`;
  const intro = step.id === 'inicio' ? `<p class="workshop-subtitle">${escapeHtml(workshopSubtitle)}</p><div class="intro-chips"><span>TypeScript</span><span>Google ADK</span><span>Gemini</span><span>~140 min + práctica opcional</span></div><div class="welcome-note"><span class="note-icon" aria-hidden="true">◎</span><div><strong>Empieza sin API key.</strong><br>Practica primero con la demo y las comprobaciones offline. Activa Gemini cuando estés listo.</div></div><div class="join-workshop"><img src="./guide-assets/workshop-qr.svg" width="150" height="150" alt="QR para abrir la dirección pública del workshop"><div><strong>Abre el workshop en tu dispositivo</strong><p>Escanea el QR o comparte el enlace.</p><a href="${siteUrl}">${escapeHtml(siteUrl.replace('https://', ''))}</a><p><a href="./guide-assets/workshop-qr.svg" download="workshop-qr.svg">Descargar QR ↗</a></p></div></div>${renderGuideMarkdown('![Los cuatro especialistas colaboran alrededor de una mesa. Una silla vacía dice Tú, human in the loop: tu lugar para orientar y revisar el trabajo del equipo.](../assets/team-collaboration.png)')}` : '';
  sections.push(`<section data-step="${step.id}" aria-label="${escapeHtml(step.title)}"${step.id === 'inicio' ? '' : ' hidden'}>${links}${'minutes' in step ? `<p class="lesson-time">◷ ${step.minutes} min estimados · Puedes avanzar a tu ritmo.</p>` : ''}${intro}<div class="step-body">${renderGuideMarkdown(source)}</div></section>`);
}

const data = JSON.stringify(steps.map(({ id, title, number }) => ({ id, title, number }))).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(workshopTitle)}</title><meta name="application-name" content="${escapeHtml(workshopName)}">
<meta name="description" content="Construye cuatro agentes con TypeScript, Google ADK y Gemini. Un workshop guiado con 14 ejercicios, código comentado y comprobaciones paso a paso.">
<meta name="theme-color" content="#f9f6f0"><meta name="color-scheme" content="light dark"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'">
<script src="./guide-assets/${themeName}"></script>
<link rel="icon" type="image/png" href="./guide-assets/mayrascript-isotipo.png"><link rel="canonical" href="${siteUrl}"><link rel="stylesheet" href="./guide-assets/${cssName}"></head>
<body><a href="#page-title" class="skip-link">Saltar al contenido</a>
<header class="topbar"><button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Abrir menú de pasos">☰</button>
<a class="brand" href="#/inicio" aria-label="MayraScript · Inicio del workshop"><span class="brand-mark" aria-hidden="true"><img src="./guide-assets/mayrascript-isotipo.png" alt="" width="43" height="43"></span><span><strong>MayraScript</strong><small>${escapeHtml(workshopName)}</small></span></a>
<nav class="header-links" aria-label="Enlaces del workshop"><button id="theme-toggle" class="theme-toggle" type="button" aria-label="Modo oscuro" aria-pressed="false" title="Cambiar a modo oscuro"><svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg><svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><span class="theme-label">Modo oscuro</span></button><a aria-label="Abrir código del workshop en GitHub" href="${repository}/tree/starter" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/></svg><span class="github-label">Código en GitHub</span></a><a class="notion-link" href="${notionGuide}" target="_blank" rel="noopener noreferrer">Abrir en Notion ↗</a><span class="language">ES · Español</span></nav></header>
<button class="menu-shade" id="menu-shade" type="button" aria-label="Cerrar menú"></button>
<aside class="sidebar" id="sidebar"><nav aria-label="Pasos del workshop"><p class="sidebar-label">EL RECORRIDO</p><ol class="step-list">${navigation(false)}</ol></nav>
<nav class="sidebar-resources" aria-label="Recursos adicionales"><p class="sidebar-label">PARA IR MÁS ALLÁ</p><ul class="step-list">${navigation(true)}</ul></nav>
<div class="progress-card"><div class="progress-heading"><strong>Tu progreso</strong></div><p id="progress-label" class="progress-heading">0 de 8 pasos completados</p><progress id="progress" max="8" value="0" aria-labelledby="progress-label"></progress><p class="progress-note">Se guarda solo en este navegador.<br>Avanza a tu ritmo.</p></div></aside>
<main class="main" id="main"><div class="reading-wrap"><div class="breadcrumbs"><a href="https://mayrascript.com/" target="_blank" rel="noopener noreferrer">MayraScript</a><span aria-hidden="true">/</span><span>Workshop · Google ADK</span></div><article class="article"><p class="eyebrow" id="step-position">ANTES DE EMPEZAR</p><h1 id="page-title" tabindex="-1">${steps[0].title}</h1>${sections.join('\n')}<div class="lesson-complete"><button class="complete-button" id="complete" type="button" aria-pressed="false" hidden>Marcar como completado</button></div></article><div class="reading-note"><span>Un caso educativo con datos ficticios. Tú decides cuándo activar Gemini.</span><a href="https://docs.google.com/forms/d/e/1FAIpQLSev_Fj0cqByC75TMAMUZPag1pSpk4iUmRMLcPKUb0stvRmR7g/viewform" target="_blank" rel="noopener noreferrer">Compartir feedback ↗</a><a href="${repository}/issues" target="_blank" rel="noopener noreferrer">Reportar un problema ↗</a></div></div></main>
<footer class="footer"><nav class="footer-inner" aria-label="Navegación entre pasos"><div class="footer-side"><a class="nav-button" id="previous" href="#/inicio" hidden>← Anterior</a><span class="footer-position" id="footer-position">Workshop · Google ADK</span></div><a class="nav-button primary" id="next" href="#/preparacion">Comenzar el taller →</a></nav></footer>
<p class="sr-only" id="announcer" role="status" aria-live="polite"></p>
<noscript>Activa JavaScript para navegar por los pasos o consulta <a href="${repository}/blob/starter/workshop/guide/README.md">la guía completa en GitHub</a>.</noscript>
<script type="application/json" id="guide-data">${data}</script><script type="module" src="./guide-assets/${jsName}"></script></body></html>`;
await writeFile('docs/index.html', html);
console.log(`Guía generada: ${steps.length} páginas, 8 pasos y 2 recursos. Salida: docs/index.html`);
