import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { AppConfig, Brief, Campaign, Piece, CalendarEntry } from '../../../packages/contracts/index.js';
import { BusyLabel, LoadedImage, Spinner, StudioLoading } from './feedback.js';
import './style.css';

async function api<T>(path: string, method = 'GET', body?: unknown, key?: string): Promise<T> {
  const response = await fetch(`/api${path}`, { method, headers: { 'Content-Type': 'application/json', ...(key ? { 'Idempotency-Key': key } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'No se pudo completar la operación.'); return data;
}
const stateLabels: Record<string, string> = { DRAFT: 'Borrador', RUNNING: 'En preparación', NEEDS_INPUT: 'Necesita atención', NEEDS_REVIEW: 'Por revisar', APPROVED: 'Aprobada', FAILED: 'Interrumpida por un error', INTERRUPTED: 'Interrumpida', CANCELLED: 'Cancelada' };
const localDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
function Sun({ small = false }: { small?: boolean }) { return <svg width={small ? 24 : 38} height={small ? 24 : 38} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M8 28a12 12 0 0 1 24 0M4 31h32M20 3v7M5 12l5 5M35 12l-5 5" stroke="currentColor" strokeWidth="2"/></svg>; }
type Pending = { key: string; label: string };
type HistoryItem = { id: string; name: string; state: string; createdAt: string; mode: string };

function App() {
  const [config, setConfig] = useState<AppConfig>(); const [brief, setBrief] = useState<Brief>();
  const [campaign, setCampaign] = useState<Campaign>(); const [history, setHistory] = useState<HistoryItem[]>([]);
  const [tab, setTab] = useState<'brief' | 'campaign' | 'calendar'>('brief');
  const [pending, setPending] = useState<Pending>(); const busyRef = useRef(false); const busy = !!pending;
  const [initialLoading, setInitialLoading] = useState(true); const [loadAttempt, setLoadAttempt] = useState(0);
  const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const createKey = useRef(crypto.randomUUID());
  useEffect(() => { let live = true; setInitialLoading(true); setError(''); void Promise.all([api<AppConfig>('/config'), api<HistoryItem[]>('/campaigns')]).then(([configuration, items]) => {
    if (!live) return; setConfig(configuration); setHistory(items);
    let saved: Brief | undefined; try { const raw = localStorage.getItem('golden-brief'); if (raw) saved = JSON.parse(raw); } catch { /* Use the demo if browser storage is unavailable. */ }
    setBrief(saved?.brand && saved?.startDate && saved?.timeZone ? saved : { brand: configuration.demo, startDate: localDate(), timeZone: 'America/Bogota' });
  }).catch(e => { if (live) setError(e.message); }).finally(() => { if (live) setInitialLoading(false); }); return () => { live = false; }; }, [loadAttempt]);
  useEffect(() => { if (brief) { try { localStorage.setItem('golden-brief', JSON.stringify(brief)); } catch { /* Draft remains available in this tab. */ } } }, [brief]);
  useEffect(() => { if (campaign) setHistory(items => items.map(item => item.id === campaign.id ? { ...item, state: campaign.state } : item)); }, [campaign?.id, campaign?.state]);
  useEffect(() => {
    if (campaign?.state !== 'RUNNING') return; let live = true;
    const timer = setInterval(() => { void api<Campaign>(`/campaigns/${campaign.id}`).then(c => { if (live) setCampaign(c); }).catch(e => { if (live) setError(e.message); }); }, 700);
    return () => { live = false; clearInterval(timer); };
  }, [campaign?.id, campaign?.state]);
  async function refreshHistory() { setHistory(await api<HistoryItem[]>('/campaigns')); }
  async function perform(key: string, label: string, operation: () => Promise<void>, refresh = false): Promise<boolean> {
    if (busyRef.current) return false;
    busyRef.current = true; setPending({ key, label }); setError(''); setNotice('');
    try {
      await operation();
      if (refresh) await refreshHistory().catch(() => setError('El cambio se guardó, pero no pudimos actualizar la lista de campañas.'));
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo completar la operación.'); return false; }
    finally { busyRef.current = false; setPending(undefined); }
  }
  async function openCampaign(id: string) {
    await perform(`open-${id}`, 'Cargando campaña…', async () => { setCampaign(await api(`/campaigns/${id}`)); setTab('campaign'); });
  }
  async function download() {
    if (!campaign) return;
    await perform('/export', 'Preparando descarga…', async () => {
      const response = await fetch(`/api/campaigns/${campaign.id}/export`);
      if (!response.ok) { const data = await response.json(); throw new Error(data.error ?? 'No se pudo preparar la descarga.'); }
      const blob = await response.blob(); const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url;
      link.download = `campaign-${campaign.id}-${campaign.state === 'APPROVED' ? 'APPROVED' : 'DRAFT'}.zip`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setNotice('Archivo preparado. Tu navegador iniciará la descarga.');
    });
  }
  function updateBrief(next: Brief) { createKey.current = crypto.randomUUID(); setBrief(next); }
  async function generate() {
    if (!brief) return;
    await perform('generate', 'Preparando tu campaña…', async () => { const c = await api<Campaign>('/campaigns', 'POST', brief, createKey.current); setCampaign(c); setTab('campaign'); setCampaign(await api<Campaign>(`/campaigns/${c.id}/run`, 'POST', {}, `run-${c.id}`)); }, true);
  }
  async function action(path: string, method: string, body: unknown, message = '') {
    if (!campaign) return false;
    const label = path.endsWith('/image') ? 'Generando una nueva imagen…' : path.endsWith('/revise') ? (campaign.mode === 'real' ? 'La IA está ajustando el texto…' : 'Preparando el ajuste de texto…') : path === '/run' ? 'Retomando tu campaña…' : path === '/cancel' ? 'Cancelando la generación…' : path === '/calendar' ? 'Guardando calendario…' : path.endsWith('/approve') ? 'Guardando aprobación…' : 'Guardando cambios…';
    return perform(path, label, async () => { setCampaign(await api<Campaign>(`/campaigns/${campaign.id}${path}`, method, body, path === '/run' ? crypto.randomUUID() : undefined)); setNotice(message); }, true);
  }
  const running = campaign?.state === 'RUNNING'; const disabled = busy || running;
  return <div className="shell">
    <aside className="sidebar">
      <a className="wordmark" href="#" onClick={e => { e.preventDefault(); setTab('brief'); }}><Sun/><span>golden<span className="wordmark-sub">CONTENT STUDIO</span></span></a>
      <div className="sidebar-label">TU ESPACIO CREATIVO</div>
      <nav aria-label="Secciones">
        <button className={tab === 'brief' ? 'nav active' : 'nav'} onClick={() => setTab('brief')}><span>01</span> El brief <span className="nav-arrow">↗</span></button>
        <button className={tab === 'campaign' ? 'nav active' : 'nav'} disabled={!campaign} onClick={() => setTab('campaign')}><span>02</span> La campaña <span className="nav-arrow">↗</span></button>
        <button className={tab === 'calendar' ? 'nav active' : 'nav'} disabled={!campaign?.calendar.length} onClick={() => setTab('calendar')}><span>03</span> El calendario <span className="nav-arrow">↗</span></button>
      </nav>
      <details className="mobile-history"><summary>Campañas guardadas ({history.length})</summary>{history.map(item => <button key={item.id} className="history-item" disabled={busy} onClick={() => void openCampaign(item.id)}><BusyLabel active={pending?.key === `open-${item.id}`} pending="Cargando campaña…">{item.name} · {stateLabels[item.state]}</BusyLabel></button>)}</details>
      <div className="history"><div className="sidebar-label">CAMPAÑAS GUARDADAS</div>{history.slice(0, 6).map(item => <button key={item.id} className={`history-item ${campaign?.id === item.id ? 'selected' : ''}`} disabled={busy} onClick={() => void openCampaign(item.id)}><span><BusyLabel active={pending?.key === `open-${item.id}`} pending="Cargando campaña…">{item.name}</BusyLabel></span><small>{stateLabels[item.state]} · {new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', dateStyle: 'short' }).format(new Date(item.createdAt))}</small></button>)}{!history.length && <p className="sidebar-hint">Las ideas que crees aparecerán aquí.</p>}</div>
      <div className="sidebar-footer"><span className="tiny-sun">✳</span><p>De una idea<br/>a una historia que conecta.</p><small>WORKSHOP · EDICIÓN EDUCATIVA</small></div>
    </aside>
    <main>
      <header className="topbar"><span>EL ESTUDIO <span className="slash">/</span> {tab === 'brief' ? 'EMPEZAR UNA CAMPAÑA' : tab === 'campaign' ? 'TU CAMPAÑA' : 'PLANIFICACIÓN'}</span><span className="mode"><i/>{!config ? 'Conectando…' : config.mode === 'real' ? 'Generación con IA' : 'Demo simulada'}</span></header>
      {error && <div className="alert error" role="alert">{error}<button aria-label="Cerrar error" onClick={() => setError('')}>×</button></div>}
      {notice && <div className="alert" role="status">{notice}</div>}
      {(pending || running) && <div className="activity-toast" role="status" aria-live="polite"><Spinner/><div><strong>{pending?.label ?? `Preparando campaña · ${config?.agents.find(a => a.id === campaign?.activeAgent)?.label ?? 'equipo creativo'}`}</strong><small>{pending?.key === '/export' ? 'Reuniendo textos, imágenes y calendario.' : running || pending?.key.endsWith('/image') || pending?.key.endsWith('/revise') ? (campaign?.mode === 'real' ? 'La IA puede tardar un momento. Tus resultados aparecerán aquí.' : 'Estamos preparando tu contenido de prueba…') : 'Un momento, estamos procesando tu solicitud.'}</small></div></div>}
      {initialLoading ? <StudioLoading/> : !config || !brief ? <div className="empty-state"><h2>No pudimos abrir el estudio.</h2><button className="primary" onClick={() => setLoadAttempt(n => n + 1)}>Reintentar</button></div> : <>
        {tab === 'brief' && <>
          <section className="hero"><div><div className="eyebrow">IDEAS QUE ENCUENTRAN SU FORMA</div><h1>Una marca.<br/><em>Tres historias.</em></h1><p>Dale a tu equipo creativo un punto de partida.<br/>Construye, revisa y da forma a tu próxima campaña.</p><div className="hero-tags"><span>4 agentes</span><span>3 publicaciones</span><span>Tu criterio al final</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-sun"/><div className="art-arch"><div/></div><div className="art-caption">UN ESPACIO PARA CREAR <span>↗</span></div></div></section>
          <section className="brief-section"><div className="section-heading"><div><div className="eyebrow">01 / EL PUNTO DE PARTIDA</div><h2>Cuéntanos sobre tu marca</h2></div><button className="text-button" disabled={disabled} onClick={() => updateBrief({ brand: structuredClone(config.demo), startDate: localDate(), timeZone: 'America/Bogota' })}>Usar Golden Rentals ↗</button></div>
          <div className="educational"><Sun small/><span><strong>Un ejercicio para aprender haciendo.</strong> Golden Rentals es una marca ficticia. Toda campaña se revisa aquí y se descarga; no se publica en Instagram.</span></div>
          <form onSubmit={e => { e.preventDefault(); void generate(); }}>
            <fieldset disabled={disabled}>
              <div className="form-grid">
                <label>Nombre de marca<input required maxLength={80} value={brief.brand.name} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, name: e.target.value } })}/></label>
                <label>Tono de voz<input required maxLength={150} value={brief.brand.tone} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, tone: e.target.value } })}/></label>
                <label className="wide">Qué hace tu marca<textarea required maxLength={1000} rows={2} value={brief.brand.description} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, description: e.target.value } })}/></label>
                <label>A quién quieres hablarle<textarea required maxLength={500} rows={2} value={brief.brand.audience} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, audience: e.target.value } })}/></label>
                <label>Qué quieres lograr<textarea required maxLength={500} rows={2} value={brief.brand.objective} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, objective: e.target.value } })}/></label>
                <label className="wide">Características que podemos mencionar<span className="hint">Un hecho por línea. Usa datos de prueba para el workshop; omite lo que no conoces.</span><textarea required rows={4} maxLength={5000} value={brief.brand.facts.map(f => f.statement).join('\n')} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, facts: e.target.value.split('\n').map((statement, i) => ({ factId: `fact-${i + 1}`, key: `fact-${i + 1}`, statement, status: 'USER_PROVIDED', sourceId: 'brief', locator: `facts[${i}]` })) } })}/></label>
                <label className="wide">Qué debemos evitar<textarea maxLength={2000} rows={2} value={brief.brand.restrictions} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, restrictions: e.target.value } })}/></label>
                <label>Inicio del calendario<input required type="date" value={brief.startDate} onChange={e => updateBrief({ ...brief, startDate: e.target.value })}/></label>
                <label>Zona horaria<input required value={brief.timeZone} onChange={e => updateBrief({ ...brief, timeZone: e.target.value })} list="timezones"/><datalist id="timezones"><option>America/Bogota</option><option>America/Mexico_City</option><option>America/Argentina/Buenos_Aires</option><option>Europe/Madrid</option></datalist></label>
                <div className="wide palette"><span>Paleta de la marca</span>{brief.brand.palette.map((color, i) => <label key={i}><input type="color" aria-label={`Color ${i + 1}`} value={color} onChange={e => updateBrief({ ...brief, brand: { ...brief.brand, palette: brief.brand.palette.map((c, j) => j === i ? e.target.value : c) } })}/><small>{color}</small></label>)}</div>
              </div>
              <div className="form-footer"><p>{config.mode === 'simulated' ? 'Modo de práctica: textos e ilustraciones de prueba, sin llamadas a IA ni costo de generación.' : 'Modo real: se enviará este brief al proveedor de IA. Se aplican los límites de la campaña; costo no disponible.'}</p><button className="primary" type="submit" disabled={config.mode === 'real' && !config.realReady}><BusyLabel active={pending?.key === 'generate'} pending="Preparando…">Crear mi campaña <span>↗</span></BusyLabel></button></div>
              {config.mode === 'real' && !config.realReady && <p role="status">Falta configurar el proveedor en el servidor para usar el modo real.</p>}
            </fieldset>
          </form></section>
        </>}
        {tab === 'campaign' && campaign && <>
          <section className="page-title"><div><div className="eyebrow">02 / DE LA IDEA A LA HISTORIA</div><h1>{campaign.brief.brand.name}<em> · la campaña</em></h1><p>Ejemplo educativo · {campaign.mode === 'simulated' ? 'Contenido simulado' : 'Contenido generado con IA'} · {stateLabels[campaign.state]}</p></div><button className="secondary" disabled={disabled} onClick={() => { createKey.current = crypto.randomUUID(); setCampaign(undefined); setTab('brief'); }}>Nueva campaña +</button></section>
          <div className="agent-track" aria-label="Progreso del equipo">{config.agents.map((agent, i) => <div key={agent.id} className={`agent-step ${campaign.activeAgent === agent.id ? 'current' : ''} ${campaign.completedSteps.includes(agent.id) ? 'done' : ''}`}><span className="agent-number">{campaign.activeAgent === agent.id && running ? <Spinner/> : campaign.completedSteps.includes(agent.id) ? '✓' : `0${i + 1}`}</span><strong>{agent.label}</strong><small>{agent.description}</small></div>)}</div>
          <div className="run-status" role="status"><span className="loading-message">{running && <Spinner/>}{campaign.activeAgent ? `Trabajando: ${config.agents.find(a => a.id === campaign.activeAgent)?.label}${campaign.activeAgent === 'designer' ? ` · ${campaign.pieces.filter(p => p.image).length} de 3 imágenes listas` : ''}` : campaign.events.at(-1)?.message ?? 'Todo listo para empezar.'}</span>{running && <button className="text-button" disabled={busy} onClick={() => void action('/cancel', 'POST', {})}><BusyLabel active={pending?.key === '/cancel'} pending="Cancelando…">Cancelar</BusyLabel></button>}{['DRAFT', 'FAILED', 'INTERRUPTED', 'NEEDS_INPUT', 'CANCELLED'].includes(campaign.state) && <button className="text-button" disabled={busy} onClick={() => void action('/run', 'POST', {})}><BusyLabel active={pending?.key === '/run'} pending="Retomando…">Continuar desde lo guardado ↗</BusyLabel></button>}</div>
          {campaign.error && <div className="alert error" role="alert">{campaign.error}</div>}
          {campaign.strategy && <div className="strategy"><span className="eyebrow">LA DIRECCIÓN CREATIVA</span><p>{campaign.strategy.summary}</p><div>{campaign.strategy.angles.map(a => <span key={a.angleId}>{a.title}</span>)}</div></div>}
          <div className="section-heading"><div><div className="eyebrow">TRES PIEZAS, UNA MISMA VOZ</div><h2>Tu contenido, con tu mirada</h2></div><small>{campaign.mode === 'simulated' ? 'Imágenes de ejemplo prediseñadas. La generación con IA aún no está activa.' : 'Revisa cada texto y cada imagen.'}</small></div>
          <div className="pieces">{campaign.pieces.map((piece, i) => <PieceCard key={`${piece.pieceId}-${piece.version}`} piece={piece} index={i} campaign={campaign} disabled={!!disabled} limits={config.limits} pending={pending?.key} action={action}/>)}</div>
          {!campaign.pieces.length && <div className="empty-state" aria-busy={running}>{running ? <Spinner/> : <Sun/>}<h2>Las buenas historias empiezan aquí.</h2><p>{running ? 'Tu equipo está preparando la dirección creativa de la campaña.' : 'Continúa desde lo guardado para preparar tus publicaciones.'}</p></div>}
          {campaign.review?.findings.length ? <div className="review-notes"><h3>Observaciones del editor</h3>{campaign.review.findings.map((finding, i) => <p key={i}><strong>{finding.severity === 'blocking' ? 'Por resolver' : 'Sugerencia'} · {finding.pieceId}</strong> {finding.description}</p>)}</div> : null}
          {!!campaign.pieces.length && <div className="campaign-footer"><p>La revisión automática es una ayuda. Tú revisas las imágenes y apruebas el resultado.<br/><small>{campaign.usage.images} imágenes solicitadas · {campaign.usage.modelCalls} llamadas a modelos · {campaign.mode === 'simulated' ? 'Sin consumo de IA' : 'Costo no disponible'}</small></p><button className="primary" disabled={!campaign.calendar.length || !!disabled} onClick={() => setTab('calendar')}>Revisar calendario ↗</button></div>}
        </>}
        {tab === 'calendar' && campaign && <CalendarView key={campaign.packageHash} campaign={campaign} disabled={!!disabled} pending={pending?.key} action={action} download={download}/>}
      </>}
      <footer className="main-footer"><span>GOLDEN CONTENT STUDIO</span><span>Creado para explorar. Revisado por ti.</span></footer>
    </main>
  </div>;
}

type Action = (path: string, method: string, body: unknown, message?: string) => Promise<boolean>;
function PieceCard({ piece, index, campaign, disabled, limits, pending, action }: { piece: Piece; index: number; campaign: Campaign; disabled: boolean; limits: AppConfig['limits']; pending?: string; action: Action }) {
  const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(piece); const [revision, setRevision] = useState(''); const [showRevision, setShowRevision] = useState(false); const [confirmImage, setConfirmImage] = useState(false); const [copied, setCopied] = useState(false);
  const approved = piece.humanApproval?.version === piece.version;
  const path = `/pieces/${piece.pieceId}`; const generatingImage = pending === `${path}/image`; const revising = pending === `${path}/revise`;
  const working = pending === path || pending?.startsWith(`${path}/`);
  return <article className="piece-card" aria-label={`Publicación ${index + 1}`} aria-busy={!!working}>
    <div className="piece-image">{piece.image ? <LoadedImage src={`/api/campaigns/${campaign.id}/${piece.image.relativePath}`} alt={piece.altText}/> : <div className="image-placeholder">{campaign.state === 'RUNNING' ? <Spinner/> : <Sun/>}<span>{campaign.state === 'RUNNING' ? 'Preparando la imagen…' : 'Imagen pendiente'}</span></div>}{generatingImage && <div className="image-regenerating" role="status"><Spinner/><strong>Creando tu nueva imagen…</strong><span>La anterior se conserva hasta que esté lista.</span></div>}<span className="piece-index">0{index + 1}</span><span className="image-label">{(piece.image?.generationMode ?? campaign.mode) === 'real' ? 'IMAGEN GENERADA CON IA' : 'ILUSTRACIÓN SIMULADA'}</span></div>
    <div className="piece-body"><div className="piece-meta"><span>{approved ? '✓ Revisada por ti' : 'Pendiente de tu revisión'}</span><small>v{piece.version}</small></div>
      {editing ? <form onSubmit={e => { e.preventDefault(); void action(`/pieces/${piece.pieceId}`, 'PATCH', { hook: draft.hook, body: draft.body, cta: draft.cta, hashtags: draft.hashtags, altText: draft.altText, version: piece.version }, 'Cambios guardados. Revisa nuevamente esta pieza.').then(saved => { if (saved) setEditing(false); }); }}><fieldset disabled={disabled}><label>Gancho<input required maxLength={160} value={draft.hook} onChange={e => setDraft({ ...draft, hook: e.target.value })}/></label><label>Texto<textarea required maxLength={1500} rows={5} value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })}/></label><label>Llamado a la acción<input required maxLength={200} value={draft.cta} onChange={e => setDraft({ ...draft, cta: e.target.value })}/></label><label>Hashtags<input value={draft.hashtags.join(' ')} onChange={e => setDraft({ ...draft, hashtags: e.target.value.split(/\s+/).filter(Boolean) })}/></label><label>Texto alternativo<textarea required maxLength={500} value={draft.altText} onChange={e => setDraft({ ...draft, altText: e.target.value })}/></label><div className="button-row"><button className="primary small" type="submit"><BusyLabel active={pending === path} pending="Guardando…">Guardar cambios</BusyLabel></button><button className="text-button" type="button" onClick={() => setEditing(false)}>Volver</button></div></fieldset></form> : <><h3>{piece.hook}</h3><p>{piece.body}</p><p className="cta-text">{piece.cta}</p><p className="hashtags">{piece.hashtags.join(' ')}</p></>}
      <details><summary>Ver hechos y descripción de la imagen</summary><p>{piece.altText}</p>{piece.factIds.map(id => <p key={id}>• {campaign.brief.brand.facts.find(f => f.factId === id)?.statement ?? 'Hecho desconocido'}</p>)}<small>{piece.image?.disclosure}</small></details>
      <div className="piece-actions"><button disabled={disabled} onClick={() => { if (!editing) setDraft(piece); setEditing(!editing); }}>Editar texto</button><button onClick={() => { void navigator.clipboard.writeText(`${piece.hook}\n\n${piece.body}\n\n${piece.cta}\n\n${piece.hashtags.join(' ')}`).then(() => setCopied(true)).catch(() => setCopied(false)); }}>{copied ? 'Copiado ✓' : 'Copiar'}</button><button disabled={disabled || campaign.usage.regenerations >= limits.regenerations} onClick={() => setConfirmImage(!confirmImage)}><BusyLabel active={generatingImage} pending="Generando imagen…">Otra imagen</BusyLabel></button><button disabled={disabled || campaign.usage.revisions >= limits.revisions} onClick={() => setShowRevision(!showRevision)}><BusyLabel active={revising} pending="Ajustando texto…">Pedir ajuste</BusyLabel></button></div>
      {confirmImage && <div className="inline-form"><p>{campaign.mode === 'real' ? 'Generar otra imagen puede tener costo. La pieza necesitará una nueva aprobación.' : 'Mostraremos otra composición prediseñada con tu paleta, sin usar IA. La pieza necesitará una nueva aprobación.'}</p><div className="button-row"><button className="secondary small" disabled={disabled} onClick={() => { setConfirmImage(false); void action(`/pieces/${piece.pieceId}/image`, 'POST', {}); }}>Generar imagen</button><button className="text-button" disabled={disabled} onClick={() => setConfirmImage(false)}>Volver</button></div></div>}
      {showRevision && <form className="inline-form" onSubmit={e => { e.preventDefault(); void action(`/pieces/${piece.pieceId}/revise`, 'POST', { instruction: revision }).then(saved => { if (saved) setShowRevision(false); }); }}><fieldset disabled={disabled}><label>Qué te gustaría ajustar<input required maxLength={500} placeholder="Por ejemplo: hazlo más breve" value={revision} onChange={e => setRevision(e.target.value)}/></label>{campaign.mode === 'simulated' && <small>La demo permite practicar una versión breve o una variante fija.</small>}<button className="secondary small" disabled={disabled}><BusyLabel active={revising} pending="Ajustando…">Aplicar ajuste</BusyLabel></button></fieldset></form>}
      <button className={`approve-piece ${approved ? 'approved' : ''}`} disabled={disabled || approved || !piece.image || editing} onClick={() => void action(`/pieces/${piece.pieceId}/approve`, 'POST', { version: piece.version })}><BusyLabel active={pending === `${path}/approve`} pending="Guardando revisión…">{approved ? '✓ Texto e imagen revisados' : 'He revisado el texto y la imagen'}</BusyLabel></button>
    </div>
  </article>;
}
function CalendarView({ campaign, disabled, pending, action, download }: { campaign: Campaign; disabled: boolean; pending?: string; action: Action; download: () => Promise<void> }) {
  const [entries, setEntries] = useState<CalendarEntry[]>(campaign.calendar); const [reviewer, setReviewer] = useState('Participante local');
  const dirty = JSON.stringify(entries) !== JSON.stringify(campaign.calendar);
  const allApproved = campaign.pieces.length === 3 && campaign.pieces.every(p => p.humanApproval?.version === p.version);
  return <>
    <section className="page-title"><div><div className="eyebrow">03 / UN RITMO PARA TUS HISTORIAS</div><h1>Tu semana,<em> con intención.</em></h1><p>Sugerencia editorial de siete días · {campaign.brief.timeZone}</p></div><span className="status-pill">{stateLabels[campaign.state]}</span></section>
    <div className="educational"><Sun small/><span>Estas fechas son una propuesta. Ninguna publicación está programada en Instagram.</span></div>
    <div className="calendar-list">{entries.map((entry, i) => {
      const piece = campaign.pieces.find(p => p.pieceId === entry.pieceId)!;
      return <article className="calendar-row" key={entry.pieceId}><span className="calendar-number">0{i + 1}</span>{piece.image && <div className="calendar-thumbnail"><LoadedImage src={`/api/campaigns/${campaign.id}/${piece.image.relativePath}`} alt=""/></div>}<div className="calendar-topic"><small>PUBLICACIÓN {i + 1}</small><h3>{entry.topic}</h3><span>{piece.humanApproval?.version === piece.version ? '✓ Revisada por ti' : 'Pendiente de revisión'}</span></div><label>Fecha<input aria-label={`Fecha publicación ${i + 1}`} type="date" value={entry.date} disabled={disabled} onChange={e => setEntries(entries.map((x, j) => i === j ? { ...x, date: e.target.value } : x))}/></label><label>Hora opcional<input aria-label={`Hora publicación ${i + 1}`} type="time" value={entry.localTime} disabled={disabled} onChange={e => setEntries(entries.map((x, j) => i === j ? { ...x, localTime: e.target.value } : x))}/></label></article>;
    })}</div>
    {dirty && <div className="button-row"><button className="secondary" disabled={disabled} onClick={() => void action('/calendar', 'PATCH', { calendar: entries, packageHash: campaign.packageHash }, 'Calendario actualizado.')}><BusyLabel active={pending === '/calendar'} pending="Guardando…">Guardar calendario</BusyLabel></button><p>El cambio de fechas requiere aprobar de nuevo la campaña.</p></div>}
    <section className="export-panel"><div><div className="eyebrow">EL ÚLTIMO PASO LO DAS TÚ</div><h2>{campaign.state === 'APPROVED' ? 'Tu campaña está aprobada.' : 'Revisa. Aprueba. Llévatela.'}</h2><p>Descarga los textos, las imágenes y el calendario en un solo paquete.<br/>Puedes guardar un borrador mientras terminas de revisar.</p><small>{allApproved ? 'Las tres piezas están revisadas.' : 'Vuelve a la campaña para revisar y aprobar cada texto e imagen.'}</small></div><div className="export-actions"><label>Nombre para la revisión<input maxLength={80} value={reviewer} onChange={e => setReviewer(e.target.value)} disabled={disabled}/></label><button className="primary" disabled={disabled || dirty || !allApproved || !reviewer.trim() || campaign.state === 'APPROVED'} onClick={() => void action('/approve', 'POST', { packageHash: campaign.packageHash, reviewerLabel: reviewer }, 'Aprobación guardada para esta versión de la campaña.')}><BusyLabel active={pending === '/approve'} pending="Guardando aprobación…">{campaign.state === 'APPROVED' ? '✓ Campaña aprobada' : 'Aprobar esta campaña'}</BusyLabel></button>{dirty ? <span className="download-disabled">Guarda los cambios para descargar</span> : <a className="secondary download" href={`/api/campaigns/${campaign.id}/export`} download aria-disabled={disabled} onClick={e => { e.preventDefault(); if (!disabled) void download(); }}><BusyLabel active={pending === '/export'} pending="Preparando descarga…">{campaign.state === 'APPROVED' ? 'Descargar campaña' : 'Descargar borrador'} ↓</BusyLabel></a>}</div></section>
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
