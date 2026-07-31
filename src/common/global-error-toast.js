// Toast de error genérico (Ciclo 2+) — usado por las vistas con acciones optimistas
// (product-list.js, history-list.js) para avisar de un fallo remoto tras el revert.
// role="alert" (implica aria-live="assertive") para que lectores de pantalla lo anuncien
// aunque el usuario no tenga el foco cerca del contenedor donde se inserta.
const AUTO_DISMISS_MS = 4000;

export function showGlobalErrorToast(container, message, { testid } = {}) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.setAttribute('role', 'alert');
  if (testid) errorEl.dataset.testid = testid;
  errorEl.textContent = message;
  container.prepend(errorEl);
  setTimeout(() => errorEl.remove(), AUTO_DISMISS_MS);
}
