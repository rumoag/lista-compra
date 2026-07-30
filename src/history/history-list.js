// Vista de historial (Unidad 7 — historial en tickets): paginado de tickets por defecto;
// al aplicar filtros, carga hasta 2000 productos comprados y deriva los tickets a mostrar
// (BR-56), sin paginación mientras el filtro esté activo. Historial en vivo (BR-59) solo
// mientras el filtro está inactivo. Scroll infinito (BR-60, mismo patrón que BR-48 en
// list/product-list.js) en vez de un botón "Cargar más".
import { supabase } from '../common/supabase-client.js';
import { createPaginator } from '../common/pagination.js';
import { createRealtimeSubscription } from '../common/realtime-subscription.js';
import { renderHistoryFilters } from './history-filters.js';
import { filterByDateRange, filterByName } from './filters.js';
import { renderTicketRow } from './ticket-row.js';
import { openTicketModal } from './ticket-modal.js';
import { renderSkeleton } from '../common/skeleton.js';

const PAGE_SIZE = 20;
const FILTERED_FETCH_LIMIT = 2000;

export async function renderHistoryList(container, { householdId }) {
  container.innerHTML = `
    <div id="history-filters-container"></div>
    <div class="card card--flush">
      <div id="history-items" data-testid="history-items"></div>
      <div id="history-empty" class="empty-state" data-testid="history-empty" hidden></div>
      <div id="history-sentinel" data-testid="history-sentinel"></div>
    </div>
  `;

  const filtersContainer = container.querySelector('#history-filters-container');
  const itemsContainer = container.querySelector('#history-items');
  const emptyState = container.querySelector('#history-empty');
  const sentinel = container.querySelector('#history-sentinel');

  renderSkeleton(itemsContainer, { variant: 'list-row', count: 5 });

  const paginator = createPaginator({ pageSize: PAGE_SIZE });
  const realtime = createRealtimeSubscription({ householdId, table: 'purchases' });
  let activeFilters = { nameQuery: '', dateFrom: null, dateTo: null };
  let sortAscending = false; // chip de orden — false = más reciente primero (por defecto)
  let filteredResults = null; // null = modo paginado sin filtro activo
  let openTicket = null; // { id, close } — ticket actualmente abierto en el modal, si lo hay
  let hasMore = true;
  let isLoadingMore = false;

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
      .order('bought_at', { ascending: sortAscending })
      .limit(limit);

    if (before) {
      query = sortAscending ? query.gt('bought_at', before) : query.lt('bought_at', before);
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
      .order('bought_at', { ascending: sortAscending })
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
      items.forEach((purchase, index) => {
        const row = renderTicketRow(purchase, { onOpen: handleOpenTicket });
        row.classList.add('motion-row-enter');
        row.style.setProperty('--stagger-index', index);
        itemsContainer.appendChild(row);
      });
    }
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
      .order('bought_at', { ascending: sortAscending });
    if (error) throw error;
    filteredResults = (data ?? []).map(toPaginatorItem);
    renderList();
  }

  // BR-57 (seguimiento): el chip de orden afecta tanto al modo paginado como al filtrado —
  // si cambia mientras no hay filtro activo, se recarga la primera página desde cero en la
  // nueva dirección (el cursor de paginación no es reutilizable entre direcciones).
  renderHistoryFilters(filtersContainer, {
    onChange: async (filters) => {
      const sortChanged = filters.sortAscending !== sortAscending;
      activeFilters = { nameQuery: filters.nameQuery, dateFrom: filters.dateFrom, dateTo: filters.dateTo };
      sortAscending = filters.sortAscending;

      if (!hasActiveFilters() && sortChanged) {
        paginator.reset();
        hasMore = true;
        await paginator.loadNextPage(fetchPage);
        if (paginator.getItems().length < PAGE_SIZE) hasMore = false;
      }

      await applyFilters();
    },
  });

  // BR-60: scroll infinito — un IntersectionObserver dispara la siguiente página cuando
  // el centinela final entra en el viewport, en vez de un botón "Cargar más" (mismo patrón
  // que BR-48 en list/product-list.js). No se dispara mientras hay un filtro activo (el
  // modo filtrado no pagina, BR-56).
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      return loadNextPageIfAny();
    }
  });

  async function loadNextPageIfAny() {
    if (hasActiveFilters() || !hasMore || isLoadingMore) return;
    isLoadingMore = true;
    const before = paginator.getItems().length;
    await paginator.loadNextPage(fetchPage);
    const loaded = paginator.getItems().length - before;
    if (loaded < PAGE_SIZE) hasMore = false;
    isLoadingMore = false;
    renderList();
  }

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
    // (Seguimiento) editar el título de un ticket desde otro dispositivo actualiza la fila
    // sin refetch — muta el item existente para no perder la referencia del ticket abierto.
    onUpdate: (purchase) => {
      if (hasActiveFilters()) return;
      const existing = paginator.getItems().find((item) => item.id === purchase.id);
      if (!existing) return;
      existing.title = purchase.title;
      renderList();
    },
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
    observer.disconnect();
    window.removeEventListener('pagehide', cleanup);
  }
  window.addEventListener('pagehide', cleanup, { once: true });

  try {
    await paginator.loadNextPage(fetchPage);
  } catch (err) {
    // Sin esto, el skeleton de carga (Ciclo 4) se queda animando para siempre si la
    // primera página falla — antes de los skeletons esto pasaba desapercibido porque
    // no había ningún indicador de carga.
    itemsContainer.innerHTML = '<p class="error-message" data-testid="history-list-load-error">No se pudo cargar el historial. Inténtalo de nuevo.</p>';
    return cleanup;
  }
  if (paginator.getItems().length < PAGE_SIZE) hasMore = false;
  renderList();
  observer.observe(sentinel);

  return cleanup;
}
