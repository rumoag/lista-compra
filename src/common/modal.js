// Modal genérico reutilizable (BR-33, Unidad 5) — overlay + panel + botón "X" en esquina
// superior derecha. El llamante monta su propio contenido en el nodo devuelto por openModal().
import { icon } from './icon.js';

export function openModal({ title, onClose, fullScreen = false } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.dataset.testid = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal-panel ${fullScreen ? 'modal-panel--fullscreen' : ''}" data-testid="modal-panel" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h2 data-testid="modal-title">${escapeHtml(title ?? '')}</h2>
        <button type="button" class="icon-button modal-close-button" data-testid="modal-close-button" aria-label="Cerrar">${icon('x')}</button>
      </div>
      <div class="modal-body" data-testid="modal-body"></div>
      <div class="modal-footer" data-testid="modal-footer"></div>
    </div>
  `;

  // Salida animada (Ciclo 4, motion M3): en vez de quitar el overlay al instante, se marca
  // como "cerrando" (dispara la animación de salida en CSS) y se espera a que las animaciones
  // reales en curso terminen antes de eliminarlo del DOM. getAnimations() no existe en jsdom
  // (entorno de tests), así que ahí la lista queda vacía y el remove() sigue siendo síncrono —
  // sin esto los tests que comprueban la ausencia del modal justo tras hacer click fallarían.
  // El timeout de seguridad cubre cualquier caso en que la animación no llegue a completarse
  // (pestaña en segundo plano, reduced-motion con timings extremos, animación cancelada): sin
  // él, un solo caso así dejaría el overlay bloqueando la pantalla para siempre.
  function close() {
    document.removeEventListener('keydown', onKeydown);
    if (visualViewport) {
      visualViewport.removeEventListener('resize', syncKeyboardViewport);
      visualViewport.removeEventListener('scroll', syncKeyboardViewport);
    }
    if (onClose) onClose();
    overlay.classList.add('modal-overlay--closing');
    void overlay.offsetWidth; // fuerza el layout para que la animación ya esté en curso al leerla
    const animations = typeof overlay.getAnimations === 'function' ? overlay.getAnimations() : [];
    if (animations.length === 0) {
      overlay.remove();
      return;
    }
    let removed = false;
    const remove = () => {
      if (removed) return;
      removed = true;
      overlay.remove();
    };
    Promise.allSettled(animations.map((anim) => anim.finished)).finally(remove);
    setTimeout(remove, 500);
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  overlay.querySelector('[data-testid="modal-close-button"]').addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener('keydown', onKeydown);

  // Teclado virtual en móvil: al enfocar un input, el layout viewport no cambia pero el visual
  // viewport se encoge. Sin esto, el overlay (position: fixed sobre el layout viewport) queda
  // centrado detrás del teclado y el footer con los botones se tapa. Se sincroniza el overlay
  // con window.visualViewport (si existe) para que ocupe solo el área realmente visible y el
  // panel se ancle arriba, dejando el footer siempre por encima del teclado.
  const visualViewport = window.visualViewport;
  function syncKeyboardViewport() {
    if (!visualViewport) return;
    const keyboardOpen = visualViewport.height < window.innerHeight - 120;
    if (keyboardOpen) {
      overlay.style.top = `${visualViewport.offsetTop}px`;
      overlay.style.height = `${visualViewport.height}px`;
      overlay.classList.add('modal-overlay--keyboard-open');
    } else {
      overlay.style.top = '';
      overlay.style.height = '';
      overlay.classList.remove('modal-overlay--keyboard-open');
    }
  }
  function onFocusIn(event) {
    if (event.target.matches?.('input, textarea, select')) {
      // Se espera a que el teclado termine de abrirse antes de recalcular y hacer scroll.
      setTimeout(() => {
        syncKeyboardViewport();
        event.target.scrollIntoView?.({ block: 'nearest' });
      }, 50);
    }
  }
  if (visualViewport) {
    visualViewport.addEventListener('resize', syncKeyboardViewport);
    visualViewport.addEventListener('scroll', syncKeyboardViewport);
  }
  overlay.addEventListener('focusin', onFocusIn);

  document.body.appendChild(overlay);

  return {
    body: overlay.querySelector('[data-testid="modal-body"]'),
    footer: overlay.querySelector('[data-testid="modal-footer"]'),
    // Nodo <h2> del título — expuesto para que llamantes como ticket-modal.js puedan
    // hacerlo interactivo (p.ej. click para editar) sin que openModal conozca ese caso de uso.
    titleEl: overlay.querySelector('[data-testid="modal-title"]'),
    close,
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
