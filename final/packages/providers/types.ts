import type { AgentId, Campaign, Copy, Designs, ImageAsset, Review, CalendarEntry, Strategy } from '../contracts/index.js';
export type Context = { campaign: Campaign; check: () => void; countCall: () => void; addTokens: (count: number) => void };
export interface GenerationProvider {
  strategy(ctx: Context): Promise<Strategy>;
  copies(ctx: Context, feedback?: string): Promise<{ pieces: Copy[] }>;
  designs(ctx: Context): Promise<Designs>;
  image(ctx: Context, pieceId: string, prompt: string, version: number): Promise<ImageAsset>;
  review(ctx: Context): Promise<{ review: Review; calendar: CalendarEntry[] }>;
  revise(ctx: Context, pieceId: string, instruction: string): Promise<Copy>;
}
export type Progress = (agent: AgentId, message: string) => Promise<void>;
