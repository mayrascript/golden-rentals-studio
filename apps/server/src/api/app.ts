import express, { type ErrorRequestHandler } from 'express';
import { z } from 'zod';
import { basename } from 'node:path';
import { AGENTS, type Brand } from '../../../../packages/contracts/index.js';
import { CampaignService, LIMITS } from '../workflow/service.js';
import { AppError } from '../workflow/rules.js';
import { exportCampaign } from './export.js';

export function createApi(service: CampaignService, demo: Brand, realReady: boolean) {
  const app = express(); app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'no-referrer');
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(req.hostname)) return res.status(403).json({ error: 'Solo se admite acceso local.' });
    if (!['GET', 'HEAD'].includes(req.method)) {
      const origin = req.get('origin');
      if (origin && origin !== `http://${req.get('host')}`) return res.status(403).json({ error: 'Origen no permitido.' });
      if (!req.is('application/json')) return res.status(415).json({ error: 'Se requiere contenido JSON.' });
    }
    next();
  });
  app.use(express.json({ limit: '32kb' }));
  app.get('/api/config', (_req, res) => res.json({ mode: service.mode, realReady, agents: AGENTS, limits: LIMITS, demo }));
  app.get('/api/campaigns', (_req, res) => res.json(service.list().map(c => ({ id: c.id, name: c.brief.brand.name, state: c.state, createdAt: c.createdAt, mode: c.mode }))));
  app.post('/api/campaigns', async (req, res) => res.status(201).json(await service.create(req.body, req.get('idempotency-key') ?? '')));
  app.get('/api/campaigns/:id', (req, res) => res.json(service.get(req.params.id)));
  app.post('/api/campaigns/:id/run', async (req, res) => res.status(202).json(await service.start(req.params.id, req.get('idempotency-key') ?? '')));
  app.post('/api/campaigns/:id/cancel', async (req, res) => res.json(await service.cancel(req.params.id)));
  app.patch('/api/campaigns/:id/pieces/:pieceId', async (req, res) => res.json(await service.edit(req.params.id, req.params.pieceId, req.body)));
  app.post('/api/campaigns/:id/pieces/:pieceId/approve', async (req, res) => {
    const { version } = z.object({ version: z.number().int().positive() }).parse(req.body);
    res.json(await service.approvePiece(req.params.id, req.params.pieceId, version));
  });
  app.post('/api/campaigns/:id/pieces/:pieceId/image', async (req, res) => res.json(await service.regenerate(req.params.id, req.params.pieceId)));
  app.post('/api/campaigns/:id/pieces/:pieceId/revise', async (req, res) => {
    const { instruction } = z.object({ instruction: z.string().trim().min(1).max(500) }).parse(req.body);
    res.json(await service.regenerate(req.params.id, req.params.pieceId, instruction));
  });
  app.patch('/api/campaigns/:id/calendar', async (req, res) => {
    const { calendar, packageHash } = z.object({ calendar: z.unknown(), packageHash: z.string().length(64) }).parse(req.body);
    res.json(await service.calendar(req.params.id, calendar, packageHash));
  });
  app.post('/api/campaigns/:id/approve', async (req, res) => {
    const { packageHash, reviewerLabel } = z.object({ packageHash: z.string().length(64), reviewerLabel: z.string().trim().min(1).max(80) }).parse(req.body);
    res.json(await service.approve(req.params.id, packageHash, reviewerLabel));
  });
  app.get('/api/campaigns/:id/export', async (req, res) => {
    const c = service.get(req.params.id); if (c.state === 'RUNNING') throw new AppError('Espera o cancela antes de descargar.', 409);
    const result = await exportCampaign(structuredClone(c), service.store);
    res.type('application/zip').attachment(result.filename).send(Buffer.from(result.bytes));
  });
  app.get('/api/campaigns/:id/images/:filename', async (req, res) => {
    const c = service.get(req.params.id); const asset = c.pieces.map(p => p.image).find(a => a && basename(a.relativePath) === req.params.filename);
    if (!asset) throw new AppError('Imagen no encontrada.', 404);
    res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox");
    res.type(asset.mimeType).send(await service.store.readAsset(c.id, asset.relativePath));
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
  const onError: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof z.ZodError) res.status(400).json({ error: 'Revisa los campos del formulario.', fields: error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) });
    else if (error instanceof AppError) res.status(error.status).json({ error: error.message });
    else if (error instanceof SyntaxError || error?.type === 'entity.too.large') res.status(400).json({ error: 'La solicitud no es válida o es demasiado grande.' });
    else res.status(500).json({ error: 'No se pudo completar la operación. Los resultados guardados se conservaron.' });
  };
  app.use(onError); return app;
}
