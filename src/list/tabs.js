// Tabs de navegación (BR-47) — sustituye la barra de botones de navegación de las Unidades 1-4.
// El QR ya no es un tab (se movió al menú de la cabecera, BR-46).
// Floating toolbar estilo M3: flota junto al FAB; el icono solo se muestra en el tab activo.
export function renderTabs(navContainer, viewContainer, { views, householdId, initialView }) {
  let currentCleanup = null;

  function renderNav(activeView) {
    navContainer.innerHTML = Object.entries(views)
      .map(([key, view]) => {
        const active = key === activeView;
        return `<button type="button" class="tab" data-testid="tabs-${key}-button" ${
          active ? 'aria-current="true"' : ''
        }>${active ? `<span class="tab-icon" aria-hidden="true">${view.icon}</span>` : ''}<span class="tab-label">${view.label}</span></button>`;
      })
      .join('');

    Object.keys(views).forEach((key) => {
      navContainer.querySelector(`[data-testid="tabs-${key}-button"]`).addEventListener('click', () => {
        activate(key);
      });
    });
  }

  // Sin esto, cada visita a un tab con suscripción propia (ej. "Lista": Realtime +
  // IntersectionObserver) queda huérfana al cambiar de tab — el canal de Realtime del
  // household sigue abierto y una nueva visita crea otro canal con el mismo topic, lo
  // que puede impedir que la nueva suscripción (o incluso la carga inicial) funcione.
  //
  // Motion (Ciclo 4, aproximación a "shared axis" de M3): la vista entrante arranca
  // desplazada/desvanecida y se asienta en su sitio justo después de renderizarse. El
  // render() en sí se lanza en el mismo tick que el click (sin retraso artificial) para
  // no introducir una espera antes de la carga real de datos de la vista.
  async function activate(viewKey) {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
    renderNav(viewKey);

    viewContainer.classList.add('view-transition-in');
    const cleanup = await views[viewKey].render(viewContainer, { householdId });
    if (typeof cleanup === 'function') currentCleanup = cleanup;

    // Fuerza el layout con el estado "in" (desplazado) ya aplicado, para que quitar
    // la clase en el siguiente frame dispare la transición hacia su posición final.
    void viewContainer.offsetWidth;
    requestAnimationFrame(() => viewContainer.classList.remove('view-transition-in'));
  }

  activate(initialView);
}
