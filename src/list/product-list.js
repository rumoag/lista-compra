// Orquesta la lista de pendientes (Unidad 6): scroll infinito (BR-48), wizard de 3 pasos
// para crear/editar (BR-44, accesible por long-press en el item o desde el header fijo
// con exactamente 1 seleccionado), confirmación de borrado en lote (BR-42, cubre también
// 1 solo producto — ya no hay borrado individual por item) y selección ampliada con
// seleccionar/deseleccionar todos (BR-43).
import { supabase } from '../common/supabase-client.js';
import { createPaginator } from '../common/pagination.js';
import { applyOptimistic } from '../common/optimistic.js';
import { renderProductItem } from './product-item.js';
import { openProductWizardModal } from './product-wizard-modal.js';
import { fetchSuggestedProducts } from './suggested-products.js';
import { getLocalName } from '../onboarding/name-prompt.js';
import { createSelectionState } from '../bulk-actions/selection-state.js';
import { renderSelectionBar } from '../bulk-actions/selection-bar.js';
import { createRealtimeSubscription } from '../bulk-actions/realtime-subscription.js';
import { openConfirmModal } from '../common/confirm-modal.js';

const PAGE_SIZE = 20;

export async function renderProductList(container, { householdId }) {
  container.innerHTML = `
    <div id="selection-bar-container" hidden></div>
    <div class="card">
      <div id="product-list-items" data-testid="product-list-items"></div>
      <div id="product-list-empty" class="empty-state" data-testid="product-list-empty" hidden>
        No hay nada en tu cesta de la compra todavía. ¿Te gustaría añadir el primero?
      </div>
      <div id="product-list-sentinel" data-testid="product-list-sentinel"></div>
    </div>
    <button type="button" class="fab" data-testid="product-list-fab-button" aria-label="Añadir producto">+</button>
  `;

  const selectionBarContainer = container.querySelector('#selection-bar-container');
  const itemsContainer = container.querySelector('#product-list-items');
  const emptyState = container.querySelector('#product-list-empty');
  const sentinel = container.querySelector('#product-list-sentinel');
  const fabButton = container.querySelector('[data-testid="product-list-fab-button"]');

  const paginator = createPaginator({ pageSize: PAGE_SIZE });
  const selection = createSelectionState();
  const realtime = createRealtimeSubscription({ householdId });

  let hasMore = true;
  let isLoadingMore = false;

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
          onEdit: handleEditRequest,
          onToggleSelect: handleToggleSelect,
          selected: selection.isSelected(product.id),
        })
      );
    });

    const selectedCount = selection.getSelection().size;

    renderSelectionBar(selectionBarContainer, {
      selectedCount,
      onMarkAsBought: handleMarkAsBought,
      onDeselectAll: handleDeselectAll,
      onSelectAll: handleSelectAll,
      onDeleteSelected: handleDeleteSelected,
      // Editar solo tiene sentido con exactamente 1 producto seleccionado.
      onEditSelected: selectedCount === 1 ? handleEditSelected : null,
    });
  }

  // BR-48: scroll infinito — un IntersectionObserver dispara la siguiente página
  // cuando el centinela final entra en el viewport, en vez de un botón "Cargar más".
  // No se empieza a observar hasta que la primera página ya está cargada (ver el
  // final de esta función): si se observara antes, el centinela está visible desde
  // el primer instante (la lista aún está vacía) y el observer dispara una carga en
  // paralelo con loadFirstPage(), duplicando la primera página de productos.
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      return loadNextPageIfAny();
    }
  });

  async function loadNextPageIfAny() {
    if (!hasMore || isLoadingMore) return;
    isLoadingMore = true;
    const before = paginator.getItems().length;
    await paginator.loadNextPage(fetchPage);
    const loaded = paginator.getItems().length - before;
    if (loaded < PAGE_SIZE) hasMore = false;
    isLoadingMore = false;
    renderList();
  }

  async function loadFirstPage() {
    isLoadingMore = true;
    await paginator.loadNextPage(fetchPage);
    if (paginator.getItems().length < PAGE_SIZE) hasMore = false;
    isLoadingMore = false;
    renderList();
    observer.observe(sentinel);
  }

  function handleToggleSelect(id) {
    selection.toggleSelection(id);
    renderList();
  }

  // BR-43: "Seleccionar todos" fuerza la carga de todas las páginas restantes antes
  // de seleccionar, para que "todos" sea realmente todos los pendientes.
  async function handleSelectAll() {
    while (hasMore) {
      await loadNextPageIfAny();
    }
    selection.selectAll(paginator.getItems().map((item) => item.id));
    renderList();
  }

  function handleDeselectAll() {
    selection.clearSelection();
    renderList();
  }

  async function openWizard(mode, product) {
    let suggestedProducts = [];
    try {
      suggestedProducts = await fetchSuggestedProducts(householdId);
    } catch (err) {
      // Sin sugerencias si falla la consulta — el wizard sigue funcionando con "Otros".
    }

    openProductWizardModal({
      mode,
      product,
      suggestedProducts,
      onSave: mode === 'edit' ? (values) => handleEditProduct(product.id, values) : handleAdd,
    });
  }

  fabButton.addEventListener('click', () => openWizard('create'));
  function handleEditRequest(product) {
    openWizard('edit', product);
  }

  async function handleAdd({ name, quantity_number, quantity_unit, category }) {
    const optimisticProduct = {
      id: `optimistic-${crypto.randomUUID()}`,
      household_id: householdId,
      name,
      quantity_number,
      quantity_unit,
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
            quantity_number,
            quantity_unit,
            category,
            status: 'pending',
            added_by: getLocalName(),
          })
          .select()
          .single();
        if (error) throw error;
        paginator.removeItem(optimisticProduct.id);
        paginator.prependItem(data);
        renderList();
      },
      onError: () => {
        showGlobalError('No se pudo añadir el producto. Inténtalo de nuevo.');
      },
    }).catch(() => {});
  }

  async function handleEditProduct(id, changes) {
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

  // Editar ya no se ofrece por item (menú de 3 puntos retirado, BR-40 obsoleta): se
  // accede manteniendo pulsado un item (product-item.js) o, con exactamente 1
  // seleccionado, desde el menú de 3 puntos del header fijo de selección.
  function handleEditSelected() {
    const ids = [...selection.getSelection()];
    if (ids.length !== 1) return;
    const product = paginator.getItems().find((item) => item.id === ids[0]);
    if (product) handleEditRequest(product);
  }

  // BR-42: confirmación también en el borrado en lote, con el conteo en el mensaje.
  // Cubre también el borrado de un único producto (ya no hay ruta de borrado individual).
  function handleDeleteSelected() {
    const ids = [...selection.getSelection()];
    if (ids.length === 0) return;

    openConfirmModal({
      title: 'Eliminar productos',
      message: ids.length === 1 ? '¿Eliminar este producto?' : `¿Eliminar ${ids.length} productos?`,
      confirmLabel: 'Eliminar',
      onConfirm: async () => {
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
            const { error } = await supabase.from('products').delete().in('id', ids);
            if (error) throw error;
          },
          onError: () => {
            showGlobalError('No se pudieron eliminar los productos. Inténtalo de nuevo.');
          },
        }).catch(() => {});
      },
    });
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
    observer.disconnect();
    window.removeEventListener('pagehide', cleanup);
    document.body.classList.remove('has-selection');
  }
  window.addEventListener('pagehide', cleanup, { once: true });

  await loadFirstPage();

  return cleanup;
}
