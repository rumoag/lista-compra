// Modal de detalle de un ticket (Unidad 7) — lista de productos con acciones individuales
// (BR-53) y acciones sobre el ticket completo: Deshacer (BR-51) y Eliminar (BR-52), con
// limpieza de ticket huérfano cuando la última acción individual vacía el ticket (BR-54).
//
// onTicketChanged(purchase): el ticket sigue existiendo pero cambió su número de productos
// (refrescar la fila en la lista de historial).
// onTicketRemoved(purchase): el ticket dejó de existir (deshecho, eliminado o vaciado) —
// retirarlo de la lista de historial.
// onTicketRestored(purchase): una acción a nivel de ticket completo falló tras la
// actualización optimista — reinsertar el ticket en la lista y mostrar el error genérico
// (mismo patrón de revert que el resto de acciones en lote del proyecto).
import { supabase } from '../common/supabase-client.js';
import { openModal } from '../common/modal.js';
import { openConfirmModal } from '../common/confirm-modal.js';
import { applyOptimistic } from '../common/optimistic.js';
import { renderTicketProductRow } from './ticket-product-row.js';

export function openTicketModal(purchase, { onTicketChanged, onTicketRemoved, onTicketRestored }) {
  const { body, close } = openModal({ title: new Date(purchase.bought_at).toLocaleString('es-ES') });

  body.innerHTML = `
    <div class="error-message" data-testid="ticket-modal-error" hidden></div>
    <div data-testid="ticket-modal-products"></div>
    <div class="confirm-modal-actions">
      <button type="button" class="secondary" data-testid="ticket-modal-undo-button">Deshacer ticket</button>
      <button type="button" data-testid="ticket-modal-delete-button">Eliminar ticket</button>
    </div>
  `;

  const productsContainer = body.querySelector('[data-testid="ticket-modal-products"]');
  const errorEl = body.querySelector('[data-testid="ticket-modal-error"]');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function renderProducts() {
    productsContainer.innerHTML = '';
    purchase.products.forEach((product) => {
      productsContainer.appendChild(
        renderTicketProductRow(product, {
          onUnmark: handleUnmarkProduct,
          onDelete: handleDeleteProduct,
        })
      );
    });
  }

  // BR-53/BR-54: quita el producto de la vista, ejecuta su operación remota y, si el
  // ticket se queda sin productos, borra también el registro de purchases huérfano y
  // cierra el modal.
  async function removeProductAndCheckOrphan(id, remoteOperation) {
    const index = purchase.products.findIndex((product) => product.id === id);
    if (index === -1) return;
    const [removed] = purchase.products.splice(index, 1);

    await applyOptimistic({
      apply: () => {
        renderProducts();
        onTicketChanged(purchase);
      },
      revert: () => {
        purchase.products.splice(index, 0, removed);
        renderProducts();
        onTicketChanged(purchase);
      },
      remoteOperation: async () => {
        await remoteOperation();
        if (purchase.products.length === 0) {
          const { error } = await supabase.from('purchases').delete().eq('id', purchase.id);
          if (error) throw error;
          onTicketRemoved(purchase);
          close();
        }
      },
      onError: () => showError('No se pudo completar la acción. Inténtalo de nuevo.'),
    }).catch(() => {});
  }

  function handleUnmarkProduct(id) {
    return removeProductAndCheckOrphan(id, async () => {
      const { error } = await supabase
        .from('products')
        .update({ status: 'pending', bought_by: null, bought_at: null, purchase_id: null })
        .eq('id', id);
      if (error) throw error;
    });
  }

  function handleDeleteProduct(id) {
    return removeProductAndCheckOrphan(id, async () => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    });
  }

  // BR-51/BR-52: acción sobre el ticket completo. El error de una operación fallida se
  // muestra en la lista de historial (onTicketRestored), no aquí — el modal ya se cierra
  // de forma optimista al confirmar, igual que el resto de acciones en lote del proyecto.
  function handleTicketAction({ title, message, confirmLabel, remoteOperation }) {
    openConfirmModal({
      title,
      message,
      confirmLabel,
      onConfirm: async () => {
        await applyOptimistic({
          apply: () => {
            onTicketRemoved(purchase);
            close();
          },
          revert: () => {
            onTicketRestored(purchase);
          },
          remoteOperation,
          onError: () => {},
        }).catch(() => {});
      },
    });
  }

  function handleUndoTicket() {
    handleTicketAction({
      title: 'Deshacer compra',
      message: `¿Deshacer esta compra? Los ${purchase.products.length} productos volverán a la lista de pendientes.`,
      confirmLabel: 'Deshacer',
      remoteOperation: async () => {
        const ids = purchase.products.map((product) => product.id);
        const { error: updateError } = await supabase
          .from('products')
          .update({ status: 'pending', bought_by: null, bought_at: null, purchase_id: null })
          .in('id', ids);
        if (updateError) throw updateError;
        const { error: deleteError } = await supabase.from('purchases').delete().eq('id', purchase.id);
        if (deleteError) throw deleteError;
      },
    });
  }

  function handleDeleteTicket() {
    handleTicketAction({
      title: 'Eliminar compra',
      message: `¿Eliminar esta compra? Se eliminarán permanentemente los ${purchase.products.length} productos.`,
      confirmLabel: 'Eliminar',
      remoteOperation: async () => {
        const { error } = await supabase.from('purchases').delete().eq('id', purchase.id);
        if (error) throw error;
      },
    });
  }

  body.querySelector('[data-testid="ticket-modal-undo-button"]').addEventListener('click', handleUndoTicket);
  body.querySelector('[data-testid="ticket-modal-delete-button"]').addEventListener('click', handleDeleteTicket);

  renderProducts();

  return { close };
}
