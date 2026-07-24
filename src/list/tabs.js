// Tabs de navegación (BR-47) — sustituye la barra de botones de navegación de las Unidades 1-4.
// El QR ya no es un tab (se movió al menú de la cabecera, BR-46).
export function renderTabs(navContainer, viewContainer, { views, householdId, initialView }) {
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

  function activate(viewKey) {
    renderNav(viewKey);
    views[viewKey].render(viewContainer, { householdId });
  }

  activate(initialView);
}
