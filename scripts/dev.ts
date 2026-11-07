import { spawn, type ChildProcess } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { config } from 'dotenv';
config({ path: resolve('.env'), quiet: true });
const port = Number(process.env.PORT ?? 4319);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT debe estar entre 1024 y 65535.');
// Angular observa la interfaz; Node observa sólo las dependencias de la API.
// La configuración temporal vive fuera del código observado para evitar ciclos de recarga.
const reservation = createServer();
await new Promise<void>((done, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', done); });
const address = reservation.address();
if (!address || typeof address === 'string') throw new Error('No se pudo reservar el puerto de la API.');
const apiPort = address.port;
await new Promise<void>((done, reject) => reservation.close(error => error ? reject(error) : done()));
const directory = await mkdtemp(join(tmpdir(), 'golden-angular-dev-'));
const proxy = join(directory, 'proxy.json');
// Preservar Host y Origin mantiene la protección de origen de la API.
await writeFile(proxy, JSON.stringify({ '/api/**': { target: `http://127.0.0.1:${apiPort}`, changeOrigin: false } }));
const children: ChildProcess[] = []; let stopping = false;
async function stop(code: number) {
  if (stopping) return; stopping = true;
  const exits = children.map(child => new Promise<void>(done => {
    if (child.exitCode !== null || child.signalCode !== null) return done();
    child.once('exit', () => done()); child.kill('SIGTERM');
  }));
  const deadline = setTimeout(() => children.forEach(child => child.kill('SIGKILL')), 5000);
  await Promise.all(exits); clearTimeout(deadline); await rm(directory, { recursive: true, force: true }); process.exitCode = code;
}
function launch(args: string[], env: NodeJS.ProcessEnv) {
  const child = spawn(process.execPath, args, { stdio: 'inherit', env }); children.push(child);
  child.once('error', error => { console.error(error.message); void stop(1); });
  child.once('exit', code => { if (!stopping) void stop(code ?? 1); });
}
process.once('SIGINT', () => void stop(0)); process.once('SIGTERM', () => void stop(0));
launch(['--watch', '--import', 'tsx', 'apps/server/src/index.ts'], { ...process.env, PORT: String(apiPort) });
launch(['node_modules/@angular/cli/bin/ng.js', 'serve', '--host', '127.0.0.1', '--port', String(port), '--proxy-config', proxy], { ...process.env, NG_CLI_ANALYTICS: 'false' });
