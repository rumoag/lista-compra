// Pantalla de inicio (FR-1, FR-2, BR-30) — listado de listas activas + "Crear nueva lista".
import { fetchAllHouseholdsWithParticipants } from './households-api.js';
import { renderListCard } from './list-card.js';
import { openListFormModal } from './list-form-modal.js';
import { openQrModal } from './qr-modal.js';
import { openDeleteConfirmModal } from './delete-confirm-modal.js';

export async function renderHomeScreen(container) {
  container.innerHTML = `
    <div class="home-screen-header">
      <button type="button" data-testid="home-create-list-button">Crear nueva lista</button>
    </div>
    <div class="error-message" data-testid="home-load-error" hidden></div>
    <div data-testid="home-list-container"></div>
    <div class="empty-state" data-testid="home-empty-state" hidden>Aún no hay listas, crea la primera</div>
  `;

  const listContainer = container.querySelector('[data-testid="home-list-container"]');
  const emptyState = container.querySelector('[data-testid="home-empty-state"]');
  const loadError = container.querySelector('[data-testid="home-load-error"]');
  const createButton = container.querySelector('[data-testid="home-create-list-button"]');

  async function refresh() {
    loadError.hidden = true;
    let households;
    try {
      households = await fetchAllHouseholdsWithParticipants();
    } catch (err) {
      loadError.textContent = 'No se pudieron cargar las listas. Inténtalo de nuevo.';
      loadError.hidden = false;
      return;
    }

    listContainer.innerHTML = '';

    if (households.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    households.forEach((household) => {
      listContainer.appendChild(
        renderListCard(household, {
          onOpen: (householdId) => {
            window.location.href = `/${householdId}`;
          },
          onEdit: (h) => openListFormModal({ mode: 'edit', household: h, onSaved: refresh }),
          onViewQr: (h) => openQrModal({ householdId: h.id }),
          onDelete: (h) => openDeleteConfirmModal({ household: h, onConfirmed: refresh }),
        })
      );
    });
  }

  createButton.addEventListener('click', () => {
    openListFormModal({ mode: 'create', onSaved: refresh });
  });

  await refresh();
}
