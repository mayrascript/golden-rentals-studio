const steps = JSON.parse(document.querySelector('#guide-data').textContent);
const workshopName = document.querySelector('meta[name="application-name"]').content;
const lessons = steps.filter(step => step.number && step.number > 0);
const storageKey = 'golden-rentals-guide-v1';
const completed = new Set();
let current = steps[0];
const heading = document.querySelector('#page-title');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const complete = document.querySelector('#complete');
const menu = document.querySelector('#menu-toggle');
const sidebar = document.querySelector('#sidebar');
const announcer = document.querySelector('#announcer');
try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (Array.isArray(saved)) {
        for (const id of saved)
            if (lessons.some(step => step.id === id))
                completed.add(id);
    }
}
catch { /* La guía sigue funcionando cuando el navegador no permite guardar. */ }
function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menu.setAttribute('aria-expanded', String(open));
    sidebar.inert = window.matchMedia('(max-width: 900px)').matches && !open;
}
function progress() {
    document.querySelector('#progress-label').textContent = `${completed.size} de ${lessons.length} pasos completados`;
    const bar = document.querySelector('#progress');
    bar.max = lessons.length;
    bar.value = completed.size;
    document.querySelectorAll('[data-nav]').forEach(link => {
        const done = completed.has(link.dataset.nav);
        link.classList.toggle('is-complete', done);
        const marker = link.querySelector('.step-number');
        marker.textContent = done ? '✓' : marker.dataset.number;
        const label = link.querySelector('.step-label').textContent;
        link.setAttribute('aria-label', `${label}${done ? ', completado' : ''}`);
    });
    const done = completed.has(current.id);
    complete.textContent = done ? '✓ Paso completado' : 'Marcar como completado';
    complete.setAttribute('aria-pressed', String(done));
    complete.classList.toggle('is-done', done);
}
function render(moveFocus = false) {
    const id = location.hash.replace(/^#\/?/, '');
    current = steps.find(step => step.id === id) ?? steps[0];
    if (id && id !== current.id)
        history.replaceState(null, '', '#/inicio');
    document.querySelectorAll('[data-step]').forEach(section => {
        section.hidden = section.dataset.step !== current.id;
    });
    document.querySelectorAll('[data-nav]').forEach(link => {
        if (link.dataset.nav === current.id)
            link.setAttribute('aria-current', 'step');
        else
            link.removeAttribute('aria-current');
    });
    heading.textContent = current.title;
    document.title = current.id === 'inicio' ? workshopName : `${current.title} · ${workshopName}`;
    document.querySelector('#step-position').textContent = current.number === 0 ? 'ANTES DE EMPEZAR' : current.number === null ? 'RECURSOS DEL TALLER' : `PASO ${current.number} DE ${lessons.length}`;
    document.querySelector('#footer-position').textContent = current.number ? `${current.number} / ${lessons.length}` : 'Workshop · Google ADK';
    const index = steps.indexOf(current);
    const isLesson = current.number !== null;
    previous.hidden = index === 0;
    previous.href = isLesson ? `#/${steps[Math.max(0, index - 1)].id}` : '#/inicio';
    previous.textContent = isLesson ? '← Anterior' : '← Volver al taller';
    next.hidden = !isLesson;
    next.href = current.number === 8 ? '#/inicio' : `#/${steps[index + 1]?.id ?? 'inicio'}`;
    next.textContent = index === 0 ? 'Comenzar el taller →' : current.number === 8 ? 'Volver al inicio →' : 'Siguiente →';
    complete.hidden = !current.number;
    progress();
    setMenu(false);
    if (moveFocus) {
        heading.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
}
complete.addEventListener('click', () => {
    if (!current.number)
        return;
    if (completed.has(current.id))
        completed.delete(current.id);
    else
        completed.add(current.id);
    let saved = true;
    try {
        localStorage.setItem(storageKey, JSON.stringify([...completed]));
    }
    catch {
        saved = false;
    }
    progress();
    announcer.textContent = saved ? 'Progreso actualizado en este navegador.' : 'Progreso actualizado para esta sesión. El navegador no permite guardarlo.';
});
document.addEventListener('click', async (event) => {
    const button = event.target.closest('.copy-code');
    if (!button)
        return;
    const code = button.closest('.code-block').querySelector('code');
    try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        button.textContent = '✓ Copiado';
        announcer.textContent = 'Código copiado al portapapeles.';
    }
    catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        button.textContent = 'Código seleccionado';
        announcer.textContent = 'No se pudo copiar automáticamente. El código está seleccionado: usa Ctrl+C o ⌘C.';
    }
    window.setTimeout(() => { button.textContent = 'Copiar'; }, 2500);
});
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    setMenu(false);
    heading.focus();
});
document.querySelector('#menu-shade').addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menu.focus();
    }
});
// Cuando cambia el ancho, el menú conserva un estado coherente con su botón.
window.matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
sidebar.addEventListener('click', event => {
    const link = event.target.closest('[data-nav]');
    if (link && link.dataset.nav === current.id) {
        setMenu(false);
        heading.focus();
    }
});
window.addEventListener('hashchange', () => render(true));
render();
export {};
