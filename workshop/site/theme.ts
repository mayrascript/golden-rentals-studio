// Se ejecuta antes de dibujar la página para evitar un destello del tema claro.
(() => {
  const key = 'golden-rentals-guide-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference: 'light' | 'dark' | null = null;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* Sin almacenamiento, el selector funciona durante esta visita. */ }

  function applyTheme() {
    const dark = preference ? preference === 'dark' : system.matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111827' : '#ffffff');
    const button = document.querySelector<HTMLButtonElement>('#theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }
  }

  applyTheme();
  system.addEventListener('change', () => { if (preference === null) applyTheme(); });
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    document.querySelector('#theme-toggle')?.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      try { localStorage.setItem(key, preference); } catch { /* Preferencia de sesión. */ }
      const status = document.querySelector('#announcer');
      if (status) status.textContent = preference === 'dark' ? 'Modo oscuro activado.' : 'Modo claro activado.';
    });
  });
})();
