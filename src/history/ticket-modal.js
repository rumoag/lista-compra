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
import { updatePurchaseTitle } from './purchases-api.js';
import { validatePurchaseTitle } from '../common/validation.js';

export function openTicketModal(purchase, { onTicketChanged, onTicketRemoved, onTicketRestored }) {
  // (Seguimiento) la cabecera del modal muestra el título del ticket (dónde se compró) en
  // vez de la fecha/hora — la fecha/hora se sigue mostrando dentro del "papel" del recibo.
  const { body, footer, close, setTitle } = openModal({ title: purchase.title || 'Sin título' });

  // BR-62 (seguimiento post-aprobación): el cuerpo del modal imita visualmente un ticket
  // de compra físico (papel, tipografía monoespaciada, líneas discontinuas, borde
  // dentado, código de barras decorativo). Las acciones sobre el ticket completo quedan
  // fuera del "papel", como controles de la aplicación, no como parte del documento.
  body.innerHTML = `
    <div class="receipt" data-testid="ticket-modal-receipt">
      <div class="receipt-zigzag receipt-zigzag--top" aria-hidden="true"></div>
      <div class="receipt-content">
        <div class="receipt-header" data-testid="ticket-modal-header"></div>
        <div class="receipt-divider"></div>
        <div class="error-message" data-testid="ticket-modal-error" hidden></div>
        <div class="receipt-items" data-testid="ticket-modal-products"></div>
        <div class="receipt-divider"></div>
        <div class="receipt-total">
          <span>TOTAL</span>
          <span data-testid="ticket-modal-total"></span>
        </div>
        <div class="receipt-footer">¡GRACIAS POR TU COMPRA!</div>
        <div class="receipt-barcode" aria-hidden="true"></div>
      </div>
      <div class="receipt-zigzag receipt-zigzag--bottom" aria-hidden="true"></div>
    </div>
  `;

  footer.innerHTML = `
    <button type="button" class="secondary" data-testid="ticket-modal-undo-button">Deshacer ticket</button>
    <button type="button" class="danger" data-testid="ticket-modal-delete-button">Eliminar ticket</button>
  `;

  const headerEl = body.querySelector('[data-testid="ticket-modal-header"]');
  const productsContainer = body.querySelector('[data-testid="ticket-modal-products"]');
  const totalEl = body.querySelector('[data-testid="ticket-modal-total"]');
  const errorEl = body.querySelector('[data-testid="ticket-modal-error"]');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  // (Seguimiento) título editable dentro del recibo — modo lectura por defecto, con lápiz
  // que abre un pequeño formulario inline (mismo patrón de validación que list-form-modal.js).
  function renderHeader() {
    headerEl.innerHTML = `
      <div class="receipt-title">🧾 TICKET DE COMPRA</div>
      <div class="receipt-store-row">
        <span class="receipt-store-title" data-testid="ticket-modal-purchase-title">${escapeHtml(
          purchase.title || 'Sin título'
        )}</span>
        <button type="button" class="icon-button" data-testid="ticket-modal-edit-title-button" aria-label="Editar título">✏️</button>
      </div>
      <div class="receipt-meta">${new Date(purchase.bought_at).toLocaleString('es-ES')}</div>
      <div class="receipt-meta">${escapeHtml(purchase.bought_by ?? '')}</div>
    `;
    headerEl
      .querySelector('[data-testid="ticket-modal-edit-title-button"]')
      .addEventListener('click', renderTitleForm);
  }

  function renderTitleForm() {
    headerEl.innerHTML = `
      <div class="receipt-title">🧾 TICKET DE COMPRA</div>
      <form data-testid="ticket-modal-title-form">
        <input
          type="text"
          class="text-input"
          data-testid="ticket-modal-title-input"
          maxlength="50"
          placeholder="¿Dónde compraste? (opcional)"
          value="${escapeHtml(purchase.title ?? '')}"
        />
        <div class="error-message" data-testid="ticket-modal-title-error" hidden></div>
        <div class="receipt-title-form-actions">
          <button type="submit" data-testid="ticket-modal-title-save-button">Guardar</button>
          <button type="button" class="secondary" data-testid="ticket-modal-title-cancel-button">Cancelar</button>
        </div>
      </form>
      <div class="receipt-meta">${new Date(purchase.bought_at).toLocaleString('es-ES')}</div>
      <div class="receipt-meta">${escapeHtml(purchase.bought_by ?? '')}</div>
    `;

    const form = headerEl.querySelector('[data-testid="ticket-modal-title-form"]');
    const input = headerEl.querySelector('[data-testid="ticket-modal-title-input"]');
    const titleErrorEl = headerEl.querySelector('[data-testid="ticket-modal-title-error"]');

    headerEl
      .querySelector('[data-testid="ticket-modal-title-cancel-button"]')
      .addEventListener('click', renderHeader);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      titleErrorEl.hidden = true;

      const result = validatePurchaseTitle(input.value);
      if (!result.valid) {
        titleErrorEl.textContent = result.error;
        titleErrorEl.hidden = false;
        return;
      }

      const saveButton = form.querySelector('[data-testid="ticket-modal-title-save-button"]');
      saveButton.disabled = true;
      try {
        await updatePurchaseTitle(purchase.id, result.value);
        purchase.title = result.value;
        setTitle(purchase.title || 'Sin título');
        renderHeader();
        onTicketChanged(purchase);
      } catch (err) {
        titleErrorEl.textContent = 'No se pudo guardar el título. Inténtalo de nuevo.';
        titleErrorEl.hidden = false;
        saveButton.disabled = false;
      }
    });
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
    const count = purchase.products.length;
    totalEl.textContent = `${count} producto${count === 1 ? '' : 's'}`;
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
    const product = purchase.products.find((p) => p.id === id);
    openConfirmModal({
      title: 'Desmarcar producto',
      message: `¿Desmarcar "${product.name}"? Volverá a la lista de pendientes.`,
      confirmLabel: 'Desmarcar',
      onConfirm: () =>
        removeProductAndCheckOrphan(id, async () => {
          const { error } = await supabase
            .from('products')
            .update({ status: 'pending', bought_by: null, bought_at: null, purchase_id: null })
            .eq('id', id);
          if (error) throw error;
        }),
    });
  }

  function handleDeleteProduct(id) {
    const product = purchase.products.find((p) => p.id === id);
    openConfirmModal({
      title: 'Eliminar producto',
      message: `¿Eliminar "${product.name}" de este ticket?`,
      confirmLabel: 'Eliminar',
      onConfirm: () =>
        removeProductAndCheckOrphan(id, async () => {
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) throw error;
        }),
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

  footer.querySelector('[data-testid="ticket-modal-undo-button"]').addEventListener('click', handleUndoTicket);
  footer.querySelector('[data-testid="ticket-modal-delete-button"]').addEventListener('click', handleDeleteTicket);

  renderHeader();
  renderProducts();

  return { close };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
