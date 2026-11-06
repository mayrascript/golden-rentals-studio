import { zipSync, strToU8 } from 'fflate';
import type { Campaign } from '../../../../packages/contracts/index.js';
import { checksum, type CampaignStore } from '../../../../packages/storage/index.js';
import { csvCell, packageHash } from '../workflow/rules.js';

export async function exportCampaign(c: Campaign, store: CampaignStore) {
  const status = c.state === 'APPROVED' && c.approval?.packageHash === packageHash(c) ? 'APPROVED' : 'DRAFT';
  const files: Record<string, Uint8Array> = {};
  const { createKey: _key, requestHash: _requestHash, ...campaign } = c;
  files['campaign.json'] = strToU8(JSON.stringify({ ...campaign, exportStatus: status, disclosure: 'Ejemplo educativo. No se publicó ni programó contenido.' }, null, 2));
  files['copies.md'] = strToU8(`# ${c.brief.brand.name} · Ejemplo educativo\n\nEstado: ${status}. Modo: ${c.mode}.\n\n` + c.pieces.map(p => `## ${p.hook}\n\n${p.body}\n\n${p.cta}\n\n${p.hashtags.join(' ')}\n\nTexto alternativo: ${p.altText}\n\nHechos: ${p.factIds.join(', ')}\n\nImagen: ${p.image?.relativePath ?? 'Pendiente'}\n\n${p.image?.disclosure ?? ''}`).join('\n\n'));
  const rows = [['fecha', 'hora', 'zona_horaria', 'tema', 'pieza', 'estado'], ...c.calendar.map(e => [e.date, e.localTime, c.brief.timeZone, e.topic, e.pieceId, status])];
  files['calendar.csv'] = strToU8('\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'));
  for (const piece of c.pieces) if (piece.image) {
    const data = await store.readAsset(c.id, piece.image.relativePath);
    if (checksum(data) !== piece.image.checksum) throw new Error('La imagen guardada no coincide con sus metadatos.');
    files[piece.image.relativePath] = data;
  }
  files['manifest.json'] = strToU8(JSON.stringify({ campaignId: c.id, packageHash: packageHash(c), status, generatedAt: new Date().toISOString(), educationalExample: true, mode: c.mode, approval: status === 'APPROVED' ? c.approval : null, files: Object.entries(files).map(([path, bytes]) => ({ path, sha256: checksum(bytes), bytes: bytes.length })) }, null, 2));
  return { bytes: zipSync(files), filename: `campaign-${c.id}-${status}.zip` };
}
