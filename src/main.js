// Punto de entrada — enrutado mínimo por household_id en la URL (US-5.2, US-5.3).
// Sin householdId: pantalla de inicio con el listado de listas activas (Unidad 5).
// Con householdId: cabecera (icono+título+menú) + saludo + tabs Lista/Historial/Estadísticas
// (Unidad 6 — sustituye la barra de navegación de botones y el botón "Cambiar nombre" sueltos
// de las Unidades 1-4; el QR se movió al menú de la cabecera).
import { renderHomeScreen } from './home/home-screen.js';
import { fetchHousehold } from './home/households-api.js';
import { ensureLocalName } from './onboarding/name-prompt.js';
import { renderListHeader } from './list/list-header.js';
import { renderGreeting } from './list/greeting.js';
import { openChangeNameModal } from './list/change-name-modal.js';
import { renderTabs } from './list/tabs.js';
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
};

async function start() {
  const householdId = getHouseholdIdFromPath();

  if (!householdId) {
    await renderHomeScreen(appMain);
    return;
  }

  await ensureLocalName(appMain);
  const household = await fetchHousehold(householdId);

  appMain.innerHTML = `
    <div id="list-header-container"></div>
    <div id="greeting-container"></div>
    <nav id="app-tabs" data-testid="app-tabs" style="display:flex; gap:0.5rem; flex-wrap:wrap;"></nav>
    <div id="app-view"></div>
  `;

  const headerContainer = appMain.querySelector('#list-header-container');
  const greetingContainer = appMain.querySelector('#greeting-container');
  const tabsNav = appMain.querySelector('#app-tabs');
  const viewContainer = appMain.querySelector('#app-view');

  function handleChangeName() {
    openChangeNameModal({ onSaved: () => renderGreeting(greetingContainer, { onChangeName: handleChangeName }) });
  }

  renderListHeader(headerContainer, { household, onChangeName: handleChangeName });
  renderGreeting(greetingContainer, { onChangeName: handleChangeName });
  renderTabs(tabsNav, viewContainer, { views: VIEWS, householdId, initialView: 'list' });
}

start();
