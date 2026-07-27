// Vista de historial (Unidad 7 — historial en tickets): paginado de tickets por defecto;
// al aplicar filtros, carga hasta 2000 productos comprados y deriva los tickets a mostrar
// (BR-56), sin paginación mientras el filtro esté activo. Historial en vivo (BR-59) solo
// mientras el filtro está inactivo.
import { supabase } from '../common/supabase-client.js';
import { createPaginator } from '../common/pagination.js';
import { createRealtimeSubscription } from '../common/realtime-subscription.js';
import { renderHistoryFilters } from './history-filters.js';
import { filterByDateRange, filterByName } from './filters.js';
import { renderTicketRow } from './ticket-row.js';
import { openTicketModal } from './ticket-modal.js';

const PAGE_SIZE = 20;
const FILTERED_FETCH_LIMIT = 2000;

export async function renderHistoryList(container, { householdId }) {
  container.innerHTML = `
    <div id="history-filters-container"></div>
    <div class="card">
      <div id="history-items" data-testid="history-items"></div>
      <div id="history-empty" class="empty-state" data-testid="history-empty" hidden></div>
      <button type="button" class="secondary" data-testid="history-load-more-button" hidden>Cargar más</button>
    </div>
  `;

  const filtersContainer = container.querySelector('#history-filters-container');
  const itemsContainer = container.querySelector('#history-items');
  const emptyState = container.querySelector('#history-empty');
  const loadMoreButton = container.querySelector('[data-testid="history-load-more-button"]');

  const paginator = createPaginator({ pageSize: PAGE_SIZE });
  const realtime = createRealtimeSubscription({ householdId, table: 'purchases' });
  let activeFilters = { nameQuery: '', dateFrom: null, dateTo: null };
  let filteredResults = null; // null = modo paginado sin filtro activo
  let openTicket = null; // { id, close } — ticket actualmente abierto en el modal, si lo hay

  function hasActiveFilters() {
    return Boolean(activeFilters.nameQuery || activeFilters.dateFrom || activeFilters.dateTo);
  }

  // BR-57: alias local para reutilizar common/pagination.js (cursor hardcodeado a
  // created_at) sin modificarlo — los tickets se ordenan por bought_at.
  function toPaginatorItem(purchase) {
    return { ...purchase, products: purchase.products ?? [], created_at: purchase.bought_at };
  }

  async function fetchPage({ before, limit }) {
    let query = supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('household_id', householdId)
      .order('bought_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('bought_at', before);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(toPaginatorItem);
  }

  async function fetchProductsForFiltering() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('household_id', householdId)
      .eq('status', 'bought')
      .order('bought_at', { ascending: false })
      .limit(FILTERED_FETCH_LIMIT);
    if (error) throw error;
    return data ?? [];
  }

  function renderList() {
    const items = hasActiveFilters() ? filteredResults ?? [] : paginator.getItems();
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
      emptyState.hidden = false;
      emptyState.textContent = hasActiveFilters()
        ? 'No hay resultados para el filtro aplicado.'
        : 'Aún no hay compras registradas.';
    } else {
      emptyState.hidden = true;
      items.forEach((purchase) => itemsContainer.appendChild(renderTicketRow(purchase, { onOpen: handleOpenTicket })));
    }

    loadMoreButton.hidden = hasActiveFilters();
  }

  // BR-56: filtra sobre productos (reutilizando filters.js sin cambios) y deriva los
  // purchase_id a mostrar; cada ticket se muestra completo, con todos sus productos.
  async function applyFilters() {
    if (!hasActiveFilters()) {
      filteredResults = null;
      renderList();
      return;
    }

    const products = await fetchProductsForFiltering();
    let matched = filterByName(products, activeFilters.nameQuery);
    matched = filterByDateRange(matched, activeFilters.dateFrom, activeFilters.dateTo);

    const purchaseIds = [...new Set(matched.map((product) => product.purchase_id).filter(Boolean))];
    if (purchaseIds.length === 0) {
      filteredResults = [];
      renderList();
      return;
    }

    const { data, error } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .in('id', purchaseIds)
      .order('bought_at', { ascending: false });
    if (error) throw error;
    filteredResults = (data ?? []).map(toPaginatorItem);
    renderList();
  }

  renderHistoryFilters(filtersContainer, {
    onChange: (filters) => {
      activeFilters = filters;
      applyFilters();
    },
  });

  loadMoreButton.addEventListener('click', async () => {
    await paginator.loadNextPage(fetchPage);
    renderList();
  });

  function handleOpenTicket(purchase) {
    const modal = openTicketModal(purchase, {
      onTicketChanged: () => renderList(),
      onTicketRemoved: (removed) => {
        paginator.removeItem(removed.id);
        if (filteredResults) filteredResults = filteredResults.filter((item) => item.id !== removed.id);
        openTicket = null;
        renderList();
      },
      onTicketRestored: (restored) => {
        paginator.prependItem(toPaginatorItem(restored));
        if (filteredResults) filteredResults = [toPaginatorItem(restored), ...filteredResults];
        openTicket = null;
        renderList();
        showGlobalError('No se pudo completar la acción. Inténtalo de nuevo.');
      },
    });
    openTicket = { id: purchase.id, close: modal.close };
  }

  function showGlobalError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    container.prepend(errorEl);
    setTimeout(() => errorEl.remove(), 4000);
  }

  // BR-59: historial en vivo — solo mientras el modo paginado (sin filtro) está activo.
  realtime.subscribe({
    onInsert: async (purchase) => {
      if (hasActiveFilters()) return;
      if (paginator.getItems().some((item) => item.id === purchase.id)) return;
      const { data: products, error } = await supabase.from('products').select('*').eq('purchase_id', purchase.id);
      if (error) return;
      paginator.prependItem(toPaginatorItem({ ...purchase, products: products ?? [] }));
      renderList();
    },
    onDelete: (purchase) => {
      if (hasActiveFilters()) return;
      paginator.removeItem(purchase.id);
      if (openTicket && openTicket.id === purchase.id) {
        openTicket.close();
        openTicket = null;
        showGlobalError('Esta compra fue modificada desde otro dispositivo.');
      }
      renderList();
    },
  });

  function cleanup() {
    realtime.unsubscribe();
    window.removeEventListener('pagehide', cleanup);
  }
  window.addEventListener('pagehide', cleanup, { once: true });

  await paginator.loadNextPage(fetchPage);
  renderList();

  return cleanup;
}
