import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('docs');
const base = '/golden-rentals-workshop/';
const port = Number(process.env.GUIDE_PORT ?? 4321);
const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) { response.writeHead(405).end(); return; }
  const url = new URL(request.url ?? '/', 'http://localhost');
  if (url.pathname === '/' || url.pathname === base.slice(0, -1)) { response.writeHead(302, { Location: base }).end(); return; }
  if (!url.pathname.startsWith(base)) { response.writeHead(404).end('No encontrado'); return; }
  try {
    const relative = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
    const file = resolve(root, relative);
    if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(404).end('No encontrado'); }
}).listen(port, '127.0.0.1', () => console.log(`Guía del workshop: http://127.0.0.1:${port}${base}`));
