// Tabs de navegación (BR-47) — sustituye la barra de botones de navegación de las Unidades 1-4.
// El QR ya no es un tab (se movió al menú de la cabecera, BR-46).
export function renderTabs(navContainer, viewContainer, { views, householdId, initialView }) {
  let currentCleanup = null;

  function renderNav(activeView) {
    navContainer.innerHTML = Object.entries(views)
      .map(
        ([key, view]) =>
          `<button type="button" class="tab" data-testid="tabs-${key}-button" ${
            key === activeView ? 'aria-current="true"' : ''
          }>${view.label}</button>`
      )
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
  async function activate(viewKey) {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
    renderNav(viewKey);
    const cleanup = await views[viewKey].render(viewContainer, { householdId });
    if (typeof cleanup === 'function') currentCleanup = cleanup;
  }

  activate(initialView);
}
