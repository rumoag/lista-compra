// Punto de entrada — enrutado mínimo por household_id en la URL (US-5.2, US-5.3)
// + navegación entre Lista / Historial / Estadísticas / QR (Unidad 3-4) + botón "Cambiar nombre" (Unidad 4).
import { renderCreateHousehold } from './onboarding/create-household.js';
import { ensureLocalName, renderChangeNameButton } from './onboarding/name-prompt.js';
import { renderQrView } from './onboarding/qr-view.js';
import { renderProductList } from './list/product-list.js';
import { renderHistoryList } from './history/history-list.js';
import { renderStatsPage } from './stats/stats-page.js';

const appMain = document.getElementById('app-main');

function getHouseholdIdFromPath() {
  const segment = window.location.pathname.replace(/^\/+/, '').split('/')[0];
  return segment || null;
}

const VIEWS = {
  list: { label: 'Lista', render: renderProductList },
  history: { label: 'Historial', render: renderHistoryList },
  stats: { label: 'Estadísticas', render: renderStatsPage },
  qr: { label: 'QR', render: renderQrView },
};

function renderNav(navContainer, householdId, activeView, viewContainer) {
  navContainer.innerHTML = Object.entries(VIEWS)
    .map(
      ([key, view]) =>
        `<button type="button" class="secondary" data-testid="nav-${key}-button" ${
          key === activeView ? 'aria-current="true"' : ''
        }>${view.label}</button>`
    )
    .join('');

  Object.keys(VIEWS).forEach((key) => {
    navContainer.querySelector(`[data-testid="nav-${key}-button"]`).addEventListener('click', () => {
      renderActiveView(navContainer, householdId, key, viewContainer);
    });
  });
}

function renderActiveView(navContainer, householdId, viewKey, viewContainer) {
  renderNav(navContainer, householdId, viewKey, viewContainer);
  VIEWS[viewKey].render(viewContainer, { householdId });
}

async function start() {
  const householdId = getHouseholdIdFromPath();

  if (!householdId) {
    renderCreateHousehold(appMain);
    return;
  }

  await ensureLocalName(appMain);

  appMain.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
      <nav id="app-nav" data-testid="app-nav" style="display:flex; gap:0.5rem; flex-wrap:wrap;"></nav>
      <div id="change-name-container"></div>
    </div>
    <div id="app-view"></div>
  `;

  const navContainer = appMain.querySelector('#app-nav');
  const viewContainer = appMain.querySelector('#app-view');
  const changeNameContainer = appMain.querySelector('#change-name-container');

  renderChangeNameButton(changeNameContainer);
  renderActiveView(navContainer, householdId, 'list', viewContainer);
}

start();
