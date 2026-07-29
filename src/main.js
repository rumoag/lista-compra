// Punto de entrada — enrutado mínimo por household_id en la URL (US-5.2, US-5.3).
// Sin householdId: pantalla de inicio con el listado de listas activas (Unidad 5).
// Con householdId: topbar (icono+título+avatar con menú) + tabs Lista/Historial/Estadísticas
// (Unidad 6 — sustituye la barra de navegación de botones y el botón "Cambiar nombre" sueltos
// de las Unidades 1-4; el saludo "Hola, X" vive ahora dentro del menú del avatar).
import { renderHomeScreen } from './home/home-screen.js';
import { fetchHousehold } from './home/households-api.js';
import { ensureLocalName } from './onboarding/name-prompt.js';
import { renderGreeting } from './list/greeting.js';
import { openChangeNameModal } from './list/change-name-modal.js';
import { renderTabs } from './list/tabs.js';
import { renderProductList } from './list/product-list.js';
import { renderHistoryList } from './history/history-list.js';
import { renderStatsPage } from './stats/stats-page.js';
import { openAddProductWizard } from './list/add-product.js';
import { icon } from './common/icon.js';

const appMain = document.getElementById('app-main');
const appHeader = document.querySelector('[data-testid="app-header"]');

function getHouseholdIdFromPath() {
  const segment = window.location.pathname.replace(/^\/+/, '').split('/')[0];
  return segment || null;
}

const VIEWS = {
  list: { label: 'Lista', icon: icon('list-bullets'), render: renderProductList },
  history: { label: 'Tickets', icon: icon('clock-counter-clockwise'), render: renderHistoryList },
  stats: { label: 'Estadísticas', icon: icon('chart-bar'), render: renderStatsPage },
};

async function start() {
  const householdId = getHouseholdIdFromPath();

  if (!householdId) {
    await renderHomeScreen(appMain);
    return;
  }

  // La cabecera estática solo tiene sentido en la pantalla de inicio (listado de
  // listas); dentro de una lista concreta, greeting.js ya muestra icono+título+menú.
  if (appHeader) appHeader.hidden = true;

  await ensureLocalName(appMain);
  const household = await fetchHousehold(householdId);

  appMain.innerHTML = `
    <div id="greeting-container"></div>
    <div id="app-view"></div>
    <div class="floating-bar" data-testid="floating-bar">
      <nav id="app-tabs" class="tabs-nav" data-testid="app-tabs"></nav>
      <button type="button" class="fab" data-testid="add-product-fab-button" aria-label="Añadir producto">+</button>
    </div>
  `;

  const greetingContainer = appMain.querySelector('#greeting-container');
  const tabsNav = appMain.querySelector('#app-tabs');
  const viewContainer = appMain.querySelector('#app-view');
  const fabButton = appMain.querySelector('[data-testid="add-product-fab-button"]');

  function handleChangeName() {
    openChangeNameModal({
      onSaved: () => renderGreeting(greetingContainer, { household, onChangeName: handleChangeName }),
    });
  }

  renderGreeting(greetingContainer, { household, onChangeName: handleChangeName });
  renderTabs(tabsNav, viewContainer, { views: VIEWS, householdId, initialView: 'list' });
  // FAB persistente entre Lista/Historial/Estadísticas: ya no depende de la vista montada.
  fabButton.addEventListener('click', () => openAddProductWizard({ householdId }));
}

start();
