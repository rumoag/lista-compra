// Identidad local (US-5.1). ensureLocalName es el flujo de primer uso (Unidad 1).
// renderNameForm se exporta (Unidad 6, BR-45) para que list/change-name-modal.js lo reutilice
// dentro de un modal en vez del botón "Cambiar nombre" inline de la Unidad 4 (ya retirado).
const LOCAL_NAME_KEY = 'localName';

export function getLocalName() {
  return localStorage.getItem(LOCAL_NAME_KEY);
}

export function setLocalName(name) {
  localStorage.setItem(LOCAL_NAME_KEY, name);
}

export function renderNameForm(container, { currentName = '', onSave, footer }) {
  // Sin footer externo (flujo de primer uso, sin modal envolvente): la tarjeta
  // reproduce la misma jerarquía header/body/footer que openModal() para que ambos
  // flujos (onboarding y "Cambiar nombre") luzcan iguales.
  const bodyHtml = `
    <p>Ej. "Yo", "Mi pareja"</p>
    <input type="text" data-testid="name-prompt-input" maxlength="30" value="${escapeAttr(currentName)}" />
    <div class="error-message" data-testid="name-prompt-error" hidden></div>
  `;
  const saveButtonHtml = `<button type="button" data-testid="name-prompt-save-button">Guardar</button>`;

  if (footer) {
    container.innerHTML = bodyHtml;
    footer.innerHTML = saveButtonHtml;
  } else {
    container.innerHTML = `
      <div class="card" data-testid="name-prompt">
        <div class="modal-header">
          <h2>¿Cómo te llamas?</h2>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">${saveButtonHtml}</div>
      </div>
    `;
  }

  const input = container.querySelector('[data-testid="name-prompt-input"]');
  const errorEl = container.querySelector('[data-testid="name-prompt-error"]');
  const saveButton = (footer ?? container).querySelector('[data-testid="name-prompt-save-button"]');

  saveButton.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) {
      errorEl.textContent = 'El nombre no puede estar vacío.';
      errorEl.hidden = false;
      return;
    }
    setLocalName(name);
    onSave(name);
  });
}

/**
 * Si no existe un nombre local, renderiza un prompt simple en `container` y resuelve
 * la promesa cuando el usuario lo guarda. Si ya existe, resuelve inmediatamente.
 */
export function ensureLocalName(container) {
  const existing = getLocalName();
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    renderNameForm(container, { onSave: resolve });
  });
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
