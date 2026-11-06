import { z } from 'zod';

const text = (max = 2000) => z.string().trim().min(1).max(max);
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T12:00:00Z`);
  return !isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}, 'Fecha inválida');
export const timeZoneSchema = text(80).refine(value => {
  try { new Intl.DateTimeFormat('es', { timeZone: value }); return true; } catch { return false; }
}, 'Zona horaria inválida');
export const factSchema = z.object({
  factId: text(80), key: text(80), statement: text(500),
  status: z.enum(['SYNTHETIC_CONFIRMED', 'USER_PROVIDED', 'UNVERIFIED', 'CONFLICTING']),
  sourceId: text(200), locator: text(200),
});
export const brandSchema = z.object({
  name: text(80), description: text(1000), tone: text(150), audience: text(500), objective: text(500),
  restrictions: z.string().max(2000), palette: z.array(z.string().regex(/^#[0-9a-f]{6}$/i)).length(3),
  facts: z.array(factSchema).min(1).max(20),
});
export const briefSchema = z.object({ brand: brandSchema, startDate: dateSchema, timeZone: timeZoneSchema });
export const strategySchema = z.object({
  summary: text(), angles: z.array(z.object({ angleId: text(60), title: text(120), purpose: text(500) })).length(3),
});
export const copySchema = z.object({
  pieceId: z.enum(['piece-1', 'piece-2', 'piece-3']), angleId: text(60),
  hook: text(160), body: text(1500), cta: text(200), hashtags: z.array(text(80)).max(8), factIds: z.array(text(80)).min(1),
});
export const copiesSchema = z.object({ pieces: z.array(copySchema).length(3) });
export const designsSchema = z.object({ concepts: z.array(z.object({
  pieceId: z.enum(['piece-1', 'piece-2', 'piece-3']), prompt: text(2000), altText: text(500),
})).length(3) });
export const findingSchema = z.object({
  pieceId: z.string(), severity: z.enum(['blocking', 'note']), category: z.enum(['factual', 'brand', 'copy', 'visual', 'calendar', 'technical']), description: text(1000),
});
export const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'NEEDS_REVISION']), findings: z.array(findingSchema).max(30),
  visualInspection: z.literal('HUMAN_REQUIRED'),
});
export const calendarEntrySchema = z.object({ pieceId: text(80), date: dateSchema, localTime: z.string().regex(/^$|^(?:[01]\d|2[0-3]):[0-5]\d$/), topic: text(160) });
export const calendarSchema = z.array(calendarEntrySchema).length(3);
export const editorSchema = z.object({ review: reviewSchema, calendar: calendarSchema });
export const editSchema = copySchema.pick({ hook: true, body: true, cta: true, hashtags: true }).extend({ altText: text(500), version: z.number().int().positive() });
export type Brand = z.infer<typeof brandSchema>;
export type Brief = z.infer<typeof briefSchema>;
export type Strategy = z.infer<typeof strategySchema>;
export type Copy = z.infer<typeof copySchema>;
export type Designs = z.infer<typeof designsSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type CalendarEntry = z.infer<typeof calendarEntrySchema>;
export type ImageAsset = { imageId: string; pieceId: string; version: number; relativePath: string; mimeType: string; width: number; height: number; checksum: string; altText?: string; generationMode: Mode; modelId?: string; promptVersion: string; disclosure: string };
export type Piece = Copy & { version: number; altText: string; visualBrief: string; image?: ImageAsset; humanApproval?: { version: number; approvedAt: string }; history: { version: number; hook: string; body: string; cta: string; hashtags: string[]; altText: string; image?: ImageAsset }[] };
export type Mode = 'simulated' | 'real';
export type RunState = 'DRAFT' | 'RUNNING' | 'NEEDS_INPUT' | 'NEEDS_REVIEW' | 'APPROVED' | 'FAILED' | 'INTERRUPTED' | 'CANCELLED';
export const AGENTS = [
  { id: 'strategist', label: 'Estratega', description: 'Encuentra los ángulos de tu campaña.' },
  { id: 'copywriter', label: 'Redactor', description: 'Da voz a las ideas con una skill de escritura.' },
  { id: 'designer', label: 'Diseñador', description: 'Prepara una imagen para cada historia.' },
  { id: 'editor', label: 'Editor y planificador', description: 'Revisa las piezas y propone el calendario.' },
] as const;
export type AgentId = typeof AGENTS[number]['id'];
export type Campaign = {
  id: string; brief: Brief; mode: Mode; state: RunState; createdAt: string; updatedAt: string;
  startedAt?: string; activeAgent?: AgentId; completedSteps: AgentId[]; strategy?: Strategy;
  pieces: Piece[]; calendar: CalendarEntry[]; review?: Review; packageHash: string;
  approval?: { packageHash: string; approvedAt: string; reviewerLabel: string };
  usage: { modelCalls: number; images: number; regenerations: number; revisions: number; tokens: number };
  events: { at: string; message: string }[]; error?: string; createKey: string; requestHash: string; runKeys?: string[];
};
export type AppConfig = { mode: Mode; realReady: boolean; agents: typeof AGENTS; limits: { images: number; regenerations: number; revisions: number; modelCalls: number }; demo: Brand };
