// Vista de historial (US-3.1, US-3.2, US-3.3): paginado por defecto; al aplicar filtros,
// carga hasta 2000 compras y aplica los filtros puros (BR-16), sin paginación mientras el filtro esté activo.
import { supabase } from '../common/supabase-client.js';
import { createPaginator } from '../common/pagination.js';
import { applyOptimistic } from '../common/optimistic.js';
import { renderHistoryFilters } from './history-filters.js';
import { filterByDateRange, filterByName } from './filters.js';

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
  let activeFilters = { nameQuery: '', dateFrom: null, dateTo: null };
  let filteredResults = null; // null = modo paginado sin filtro activo

  function hasActiveFilters() {
    return Boolean(activeFilters.nameQuery || activeFilters.dateFrom || activeFilters.dateTo);
  }

  async function fetchPage({ before, limit }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('household_id', householdId)
      .eq('status', 'bought')
      .order('bought_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('bought_at', before);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async function fetchForFiltering() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('household_id', householdId)
      .eq('status', 'bought')
      .order('bought_at', { ascending: false })
      .limit(FILTERED_FETCH_LIMIT);
    if (error) throw error;
    return data;
  }

  function renderEntry(product) {
    const el = document.createElement('div');
    el.className = 'product-item';
    el.dataset.testid = `history-item-${product.id}`;
    el.innerHTML = `
      <div>
        <div data-testid="history-item-name">${escapeHtml(product.name)}</div>
        <div class="meta">${new Date(product.bought_at).toLocaleString('es-ES')} · ${escapeHtml(product.bought_by ?? '')}</div>
      </div>
      <div>
        <button type="button" class="secondary" data-testid="history-item-unmark-button">Desmarcar</button>
        <button type="button" class="secondary" data-testid="history-item-delete-button">Eliminar</button>
      </div>
    `;
    el.querySelector('[data-testid="history-item-unmark-button"]').addEventListener('click', () =>
      handleUnmark(product.id)
    );
    el.querySelector('[data-testid="history-item-delete-button"]').addEventListener('click', () =>
      handleDeleteFromHistory(product.id)
    );
    return el;
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
      items.forEach((product) => itemsContainer.appendChild(renderEntry(product)));
    }

    loadMoreButton.hidden = hasActiveFilters();
  }

  async function applyFilters() {
    if (!hasActiveFilters()) {
      filteredResults = null;
      renderList();
      return;
    }

    const all = await fetchForFiltering();
    let result = filterByName(all, activeFilters.nameQuery);
    result = filterByDateRange(result, activeFilters.dateFrom, activeFilters.dateTo);
    filteredResults = result;
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

  async function handleUnmark(id) {
    const previous = paginator.getItems().find((item) => item.id === id) ?? filteredResults?.find((i) => i.id === id);

    await applyOptimistic({
      apply: () => {
        paginator.removeItem(id);
        if (filteredResults) filteredResults = filteredResults.filter((i) => i.id !== id);
        renderList();
      },
      revert: () => {
        if (previous) paginator.prependItem(previous);
        renderList();
      },
      remoteOperation: async () => {
        const { error } = await supabase
          .from('products')
          .update({ status: 'pending', bought_by: null, bought_at: null })
          .eq('id', id);
        if (error) throw error;
      },
      onError: () => showGlobalError('No se pudo desmarcar el producto. Inténtalo de nuevo.'),
    }).catch(() => {});
  }

  async function handleDeleteFromHistory(id) {
    const previous = paginator.getItems().find((item) => item.id === id) ?? filteredResults?.find((i) => i.id === id);

    await applyOptimistic({
      apply: () => {
        paginator.removeItem(id);
        if (filteredResults) filteredResults = filteredResults.filter((i) => i.id !== id);
        renderList();
      },
      revert: () => {
        if (previous) paginator.prependItem(previous);
        renderList();
      },
      remoteOperation: async () => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      },
      onError: () => showGlobalError('No se pudo eliminar la entrada del historial. Inténtalo de nuevo.'),
    }).catch(() => {});
  }

  function showGlobalError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    container.prepend(errorEl);
    setTimeout(() => errorEl.remove(), 4000);
  }

  await paginator.loadNextPage(fetchPage);
  renderList();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
