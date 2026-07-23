// Orquesta la lista de pendientes: carga paginada, alta/edición/borrado optimistas (Unidad 1),
// tiempo real y selección múltiple/marcar en lote (Unidad 2, US-1.2 completa, US-2.1, US-2.2).
import { supabase } from '../common/supabase-client.js';
import { createPaginator } from '../common/pagination.js';
import { applyOptimistic } from '../common/optimistic.js';
import { renderProductForm } from './product-form.js';
import { renderProductItem } from './product-item.js';
import { getLocalName } from '../onboarding/name-prompt.js';
import { createSelectionState } from '../bulk-actions/selection-state.js';
import { renderSelectionBar } from '../bulk-actions/selection-bar.js';
import { createRealtimeSubscription } from '../bulk-actions/realtime-subscription.js';

const PAGE_SIZE = 20;

export async function renderProductList(container, { householdId }) {
  container.innerHTML = `
    <div id="product-form-container"></div>
    <div id="selection-bar-container" hidden></div>
    <div class="card">
      <div id="product-list-items" data-testid="product-list-items"></div>
      <div id="product-list-empty" class="empty-state" data-testid="product-list-empty" hidden>
        No hay productos pendientes.
      </div>
      <button type="button" class="secondary" data-testid="product-list-load-more-button" hidden>
        Cargar más
      </button>
    </div>
  `;

  const formContainer = container.querySelector('#product-form-container');
  const selectionBarContainer = container.querySelector('#selection-bar-container');
  const itemsContainer = container.querySelector('#product-list-items');
  const emptyState = container.querySelector('#product-list-empty');
  const loadMoreButton = container.querySelector('[data-testid="product-list-load-more-button"]');

  const paginator = createPaginator({ pageSize: PAGE_SIZE });
  const selection = createSelectionState();
  const realtime = createRealtimeSubscription({ householdId });

  async function fetchPage({ before, limit }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('household_id', householdId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (before) {
      query = query.lt('created_at', before);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  function renderList() {
    const items = paginator.getItems();
    itemsContainer.innerHTML = '';
    emptyState.hidden = items.length > 0;

    items.forEach((product) => {
      itemsContainer.appendChild(
        renderProductItem(product, {
          onEdit: handleEdit,
          onDelete: handleDelete,
          onToggleSelect: handleToggleSelect,
          selected: selection.isSelected(product.id),
        })
      );
    });

    renderSelectionBar(selectionBarContainer, {
      selectedCount: selection.getSelection().size,
      onMarkAsBought: handleMarkAsBought,
    });
  }

  async function loadFirstPage() {
    await paginator.loadNextPage(fetchPage);
    renderList();
    loadMoreButton.hidden = false;
  }

  loadMoreButton.addEventListener('click', async () => {
    await paginator.loadNextPage(fetchPage);
    renderList();
  });

  function handleToggleSelect(id) {
    selection.toggleSelection(id);
    renderList();
  }

  async function handleAdd({ name, quantity, category }) {
    const optimisticProduct = {
      id: `optimistic-${crypto.randomUUID()}`,
      household_id: householdId,
      name,
      quantity,
      category,
      status: 'pending',
      added_by: getLocalName(),
      created_at: new Date().toISOString(),
      bought_by: null,
      bought_at: null,
    };

    await applyOptimistic({
      apply: () => {
        paginator.prependItem(optimisticProduct);
        renderList();
      },
      revert: () => {
        paginator.removeItem(optimisticProduct.id);
        renderList();
      },
      remoteOperation: async () => {
        const { data, error } = await supabase
          .from('products')
          .insert({
            household_id: householdId,
            name,
            quantity,
            category,
            status: 'pending',
            added_by: getLocalName(),
          })
          .select()
          .single();
        if (error) throw error;
        paginator.removeItem(optimisticProduct.id);
        paginator.prependItem(data);
      },
      onError: () => {
        showGlobalError('No se pudo añadir el producto. Inténtalo de nuevo.');
      },
    }).catch(() => {});
  }

  async function handleEdit(id, changes) {
    const previous = paginator.getItems().find((item) => item.id === id);

    await applyOptimistic({
      apply: () => {
        paginator.updateItem(id, changes);
        renderList();
      },
      revert: () => {
        paginator.updateItem(id, previous);
        renderList();
      },
      remoteOperation: async () => {
        const { error } = await supabase.from('products').update(changes).eq('id', id);
        if (error) throw error;
      },
      onError: () => {
        showGlobalError('No se pudo guardar el cambio. Inténtalo de nuevo.');
      },
    }).catch(() => {});
  }

  async function handleDelete(id) {
    const previous = paginator.getItems();
    selection.removeFromSelection(id);

    await applyOptimistic({
      apply: () => {
        paginator.removeItem(id);
        renderList();
      },
      revert: () => {
        previous.forEach((item) => {
          if (!paginator.getItems().some((i) => i.id === item.id)) {
            paginator.prependItem(item);
          }
        });
        renderList();
      },
      remoteOperation: async () => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      },
      onError: () => {
        showGlobalError('No se pudo eliminar el producto. Inténtalo de nuevo.');
      },
    }).catch(() => {});
  }

  // BR-11: marcar en lote como una única transacción lógica (revert total ante cualquier fallo).
  async function handleMarkAsBought() {
    const ids = [...selection.getSelection()];
    if (ids.length === 0) return;

    const removedItems = paginator.getItems().filter((item) => ids.includes(item.id));

    await applyOptimistic({
      apply: () => {
        ids.forEach((id) => paginator.removeItem(id));
        selection.clearSelection();
        renderList();
      },
      revert: () => {
        removedItems.forEach((item) => paginator.prependItem(item));
        selection.selectAll(ids);
        renderList();
      },
      remoteOperation: async () => {
        const { error } = await supabase
          .from('products')
          .update({ status: 'bought', bought_by: getLocalName(), bought_at: new Date().toISOString() })
          .in('id', ids);
        if (error) throw error;
      },
      onError: () => {
        showGlobalError('No se pudieron marcar los productos como comprados. Inténtalo de nuevo.');
      },
    }).catch(() => {});
  }

  function showGlobalError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.dataset.testid = 'product-list-global-error';
    errorEl.textContent = message;
    container.prepend(errorEl);
    setTimeout(() => errorEl.remove(), 4000);
  }

  // BR-8: Realtime — insertar/quitar de la vista según el evento, e idempotente frente a ecos propios
  // (removeItem/filter sobre un id ya ausente es una no-operación, ver common/pagination.js).
  realtime.subscribe({
    onInsert: (product) => {
      if (product.status !== 'pending') return;
      if (paginator.getItems().some((item) => item.id === product.id)) return;
      paginator.prependItem(product);
      renderList();
    },
    onUpdate: (product) => {
      if (product.status === 'bought') {
        paginator.removeItem(product.id);
        selection.removeFromSelection(product.id);
      } else {
        paginator.updateItem(product.id, product);
      }
      renderList();
    },
    onDelete: (product) => {
      paginator.removeItem(product.id);
      selection.removeFromSelection(product.id);
      renderList();
    },
  });

  function cleanup() {
    realtime.unsubscribe();
  }
  window.addEventListener('pagehide', cleanup, { once: true });

  renderProductForm(formContainer, { onSubmit: handleAdd });
  await loadFirstPage();

  return cleanup;
}
