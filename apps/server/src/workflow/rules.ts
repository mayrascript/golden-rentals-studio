import type { Brief, Campaign, CalendarEntry, Finding, Piece, Review } from '../../../../packages/contracts/index.js';
import { checksum } from '../../../../packages/storage/index.js';

export class AppError extends Error {
  constructor(message: string, readonly status = 400) { super(message); }
}
export function validateFacts(brief: Brief) {
  const ids = new Set<string>(); const keys = new Map<string, string>();
  for (const fact of brief.brand.facts) {
    if (ids.has(fact.factId)) throw new AppError('Cada hecho necesita un identificador distinto.');
    ids.add(fact.factId);
    if (fact.status === 'CONFLICTING' || fact.status === 'UNVERIFIED') throw new AppError('Aclara los hechos contradictorios o no verificados antes de generar.');
    if (keys.has(fact.key) && keys.get(fact.key) !== fact.statement) throw new AppError(`Hay información contradictoria para ${fact.key}.`);
    keys.set(fact.key, fact.statement);
  }
}
export function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10);
}
export function suggestedCalendar(campaign: Campaign): CalendarEntry[] {
  return campaign.pieces.map((piece, i) => ({ pieceId: piece.pieceId, date: shiftDate(campaign.brief.startDate, i * 3), localTime: '', topic: piece.hook }));
}
export function validateCalendar(campaign: Campaign, calendar: CalendarEntry[]) {
  const ids = calendar.map(entry => entry.pieceId);
  if (new Set(ids).size !== 3 || campaign.pieces.some(piece => !ids.includes(piece.pieceId))) throw new AppError('El calendario debe contener exactamente las tres piezas de la campaña.');
  for (const entry of calendar) if (entry.date < campaign.brief.startDate || entry.date > shiftDate(campaign.brief.startDate, 6)) throw new AppError('Las fechas deben estar dentro de los siete días de la campaña.');
}
export function factualFindings(campaign: Campaign, piece: Piece): Finding[] {
  const facts = campaign.brief.brand.facts;
  const findings: Finding[] = [];
  const block = (description: string) => findings.push({ pieceId: piece.pieceId, severity: 'blocking', category: 'factual', description });
  if (!piece.factIds.length || piece.factIds.some(id => !facts.some(f => f.factId === id))) block('La pieza referencia hechos que no están en el brief.');
  const content = `${piece.hook} ${piece.body} ${piece.cta} ${piece.altText}`.toLowerCase();
  const evidence = facts.filter(f => piece.factIds.includes(f.factId)).map(f => f.statement.toLowerCase()).join(' ');
  const risks: [RegExp, string][] = [
    [/piscina|jacuzzi|sauna|gimnasio|parqueadero|estacionamiento/g, 'amenidad'],
    [/vista al mar|frente al mar|a pasos de la playa|wifi|wi-fi|mbps|accesib(?:le|ilidad)/g, 'característica'],
    [/\$\s*[\d.,]+|\b\d+[.,]?\d*\s*(?:usd|cop|euros|dólares|%|estrellas|minutos|metros)\b/g, 'dato numérico'],
    [/disponible hoy|disponibilidad garantizada|cancelaci[oó]n gratuita|licencia tur[ií]stica|reseñas verificadas/g, 'condición comercial'],
  ];
  for (const [pattern, kind] of risks) for (const match of content.matchAll(pattern)) {
    if (!evidence.includes(match[0])) block(`Revisar ${kind} sin respaldo: «${match[0]}».`);
  }
  return findings;
}
export function audit(campaign: Campaign, modelReview?: Review): Review {
  const findings = [...(modelReview?.findings ?? []), ...campaign.pieces.flatMap(piece => factualFindings(campaign, piece))];
  if (campaign.pieces.length !== 3 || new Set(campaign.pieces.map(p => p.pieceId)).size !== 3) findings.push({ pieceId: '', severity: 'blocking', category: 'technical', description: 'Se necesitan tres piezas únicas.' });
  for (const piece of campaign.pieces) if (!piece.image) findings.push({ pieceId: piece.pieceId, severity: 'blocking', category: 'visual', description: 'Falta la imagen de esta pieza.' });
  if (modelReview?.status === 'NEEDS_REVISION' && !findings.some(f => f.severity === 'blocking')) findings.push({ pieceId: '', severity: 'blocking', category: 'copy', description: 'El editor solicita otra revisión.' });
  return { status: findings.some(f => f.severity === 'blocking') ? 'NEEDS_REVISION' : 'APPROVED', findings, visualInspection: 'HUMAN_REQUIRED' };
}
export function packageHash(campaign: Campaign) {
  return checksum(JSON.stringify({ brief: campaign.brief, mode: campaign.mode, strategy: campaign.strategy,
    pieces: campaign.pieces.map(({ history: _history, humanApproval: _approval, ...content }) => content), calendar: campaign.calendar, review: campaign.review }));
}
export function csvCell(value: string) {
  // Control characters can precede a spreadsheet formula in untrusted text.
  // eslint-disable-next-line no-control-regex
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
