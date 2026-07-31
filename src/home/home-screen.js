// Pantalla de inicio (FR-1, FR-2, BR-30) — listado de listas activas + "Crear nueva lista".
import { fetchAllHouseholdsWithParticipants, deleteHousehold } from './households-api.js';
import { renderListCard, renderCreateListCard } from './list-card.js';
import { openListFormModal } from './list-form-modal.js';
import { openQrModal } from '../common/qr-modal.js';
import { openConfirmModal } from '../common/confirm-modal.js';
import { renderSkeleton } from '../common/skeleton.js';

export async function renderHomeScreen(container) {
  container.innerHTML = `
    <div class="error-message" role="alert" data-testid="home-load-error" hidden></div>
    <div data-testid="home-list-container"></div>
    <div class="empty-state" data-testid="home-empty-state" hidden>Aún no hay listas, crea la primera</div>
  `;

  const listContainer = container.querySelector('[data-testid="home-list-container"]');
  const emptyState = container.querySelector('[data-testid="home-empty-state"]');
  const loadError = container.querySelector('[data-testid="home-load-error"]');

  renderSkeleton(listContainer, { variant: 'list-card', count: 3 });

  // refresh() reconstruye todas las tarjetas en cada cambio (crear/editar/eliminar
  // cualquier lista), no solo cuando aparece una lista nueva — sin este registro, editar
  // el título de una lista reproduciría la animación de entrada en TODAS las tarjetas.
  const enteredIds = new Set();

  async function refresh() {
    loadError.hidden = true;
    let households;
    try {
      households = await fetchAllHouseholdsWithParticipants();
    } catch (err) {
      listContainer.innerHTML = '';
      loadError.textContent = 'No se pudieron cargar las listas. Inténtalo de nuevo.';
      loadError.hidden = false;
      return;
    }

    listContainer.innerHTML = '';
    listContainer.appendChild(
      renderCreateListCard(() => openListFormModal({ mode: 'create', onSaved: refresh }))
    );

    emptyState.hidden = households.length !== 0;

    let newIndex = 0;
    households.forEach((household) => {
      const card = renderListCard(household, {
        onOpen: (householdId) => {
          window.location.href = `/${householdId}`;
        },
        onEdit: (h) => openListFormModal({ mode: 'edit', household: h, onSaved: refresh }),
        onViewQr: (h) => openQrModal({ householdId: h.id }),
        onDelete: (h) =>
          openConfirmModal({
            title: 'Eliminar lista',
            message: '¿Eliminar esta lista? Se borrarán todos sus productos e historial.',
            confirmLabel: 'Eliminar',
            onConfirm: async () => {
              await deleteHousehold(h.id);
              await refresh();
            },
          }),
      });
      if (!enteredIds.has(household.id)) {
        enteredIds.add(household.id);
        card.classList.add('motion-row-enter');
        card.style.setProperty('--stagger-index', newIndex);
        newIndex += 1;
      }
      listContainer.appendChild(card);
    });
  }

  await refresh();
}
