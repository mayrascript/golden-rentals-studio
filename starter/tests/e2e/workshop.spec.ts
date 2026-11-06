import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { unzipSync, strFromU8 } from 'fflate';

test('personalizar, editar, aprobar, descargar y volver a invalidar', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const external: string[] = []; page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4318') && !request.url().startsWith('data:')) external.push(request.url()); });
  await page.goto('/'); await expect(page.getByRole('heading', { name: /Una marca/ })).toBeVisible();
  await page.screenshot({ path: 'test-results/brief-desktop.png', fullPage: true });
  await page.getByLabel('Nombre de marca', { exact: true }).fill('Estudio Brisa');
  await page.getByRole('button', { name: 'Crear mi campaña' }).click();
  await expect(page.getByRole('button', { name: 'Revisar calendario' })).toBeEnabled();
  const first = page.getByRole('article', { name: 'Publicación 1', exact: true });
  await expect(first.getByRole('img')).toBeVisible();
  await first.getByRole('button', { name: 'Editar texto', exact: true }).click();
  await expect(first.getByRole('textbox', { name: 'Texto alternativo', exact: true })).not.toHaveValue('Ilustración conceptual pendiente.');
  await first.getByRole('textbox', { name: 'Texto', exact: true }).fill('Una propuesta para explorar tu próxima estancia con calma.');
  await first.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(first.getByText('v2', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/campaign-desktop.png', fullPage: true });
  await page.reload(); await page.getByRole('button', { name: /Estudio Brisa/ }).first().click();
  await expect(page.getByText('Una propuesta para explorar tu próxima estancia con calma.', { exact: true })).toBeVisible();
  for (let i = 1; i <= 3; i++) await page.getByRole('article', { name: `Publicación ${i}`, exact: true }).getByRole('button', { name: 'He revisado el texto y la imagen', exact: true }).click();
  await page.getByRole('button', { name: 'Revisar calendario' }).click();
  await page.getByRole('button', { name: 'Aprobar esta campaña' }).click();
  await expect(page.getByRole('heading', { name: 'Tu campaña está aprobada.' })).toBeVisible();
  const downloading = page.waitForEvent('download'); await page.getByRole('link', { name: 'Descargar campaña' }).click(); const download = await downloading;
  const files = unzipSync(await readFile((await download.path())!)); expect(JSON.parse(strFromU8(files['manifest.json'])).status).toBe('APPROVED'); expect(Object.keys(files)).toHaveLength(7);
  await page.getByRole('button', { name: /02 La campaña/ }).click();
  await first.getByRole('button', { name: 'Otra imagen' }).click(); await first.getByRole('button', { name: 'Generar imagen', exact: true }).click();
  await expect(first.getByText('v3', { exact: true })).toBeVisible(); await expect(first.getByRole('button', { name: 'He revisado el texto y la imagen', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Revisar calendario' }).click(); await expect(page.getByRole('link', { name: 'Descargar borrador' })).toBeVisible();
  expect(errors).toEqual([]); expect(external).toEqual([]);
});

test('pantalla pequeña, teclado y validación de formulario', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await expect(page.getByRole('button', { name: 'Crear mi campaña' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByLabel('Nombre de marca', { exact: true }).fill(''); await page.getByRole('button', { name: 'Crear mi campaña' }).click();
  await expect(page.getByLabel('Nombre de marca', { exact: true })).toBeFocused();
  await page.keyboard.type('Marca de prueba'); await page.keyboard.press('Tab'); await expect(page.getByLabel('Tono de voz')).toBeFocused();
  await page.screenshot({ path: 'test-results/brief-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Crear mi campaña' }).click(); await expect(page.getByRole('button', { name: 'Revisar calendario' })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/campaign-mobile.png', fullPage: true });
});

test('API rechaza orígenes ajenos y conserva la idempotencia', async ({ request }) => {
  const config = await (await request.get('/api/config')).json(); const brief = { brand: config.demo, startDate: '2026-11-05', timeZone: 'America/Bogota' };
  const blocked = await request.post('/api/campaigns', { headers: { Origin: 'https://example.org', 'Idempotency-Key': 'blocked-test-1' }, data: brief }); expect(blocked.status()).toBe(403);
  const options = { headers: { 'Idempotency-Key': 'api-idempotency-test' }, data: brief };
  const first = await (await request.post('/api/campaigns', options)).json(); const second = await (await request.post('/api/campaigns', options)).json(); expect(first.id).toBe(second.id);
  const invalid = await request.post(`/api/campaigns/${first.id}/approve`, { data: { packageHash: first.packageHash, reviewerLabel: 'Test' } }); expect(invalid.status()).toBe(400);
});
