// Identidad local (US-5.1). ensureLocalName es el flujo de primer uso (Unidad 1);
// renderChangeNameButton (Unidad 4, BR-20/BR-21) reutiliza la misma clave de localStorage
// para permitir cambiar el nombre en cualquier momento, sin duplicar lógica.
const LOCAL_NAME_KEY = 'localName';

export function getLocalName() {
  return localStorage.getItem(LOCAL_NAME_KEY);
}

export function setLocalName(name) {
  localStorage.setItem(LOCAL_NAME_KEY, name);
}

function renderNameForm(container, { currentName = '', onSave }) {
  container.innerHTML = `
    <div class="card" data-testid="name-prompt">
      <p>¿Cómo te llamas? (ej. "Yo", "Mi pareja")</p>
      <input type="text" data-testid="name-prompt-input" maxlength="30" value="${escapeAttr(currentName)}" />
      <div class="error-message" data-testid="name-prompt-error" hidden></div>
      <button type="button" data-testid="name-prompt-save-button">Guardar</button>
    </div>
  `;

  const input = container.querySelector('[data-testid="name-prompt-input"]');
  const errorEl = container.querySelector('[data-testid="name-prompt-error"]');
  const saveButton = container.querySelector('[data-testid="name-prompt-save-button"]');

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

/**
 * Renderiza un botón "Cambiar nombre" (BR-20) que, al pulsarlo, muestra el mismo
 * formulario de captura pre-relleno con el nombre actual.
 */
export function renderChangeNameButton(container) {
  function showButton() {
    container.innerHTML = `<button type="button" class="secondary" data-testid="change-name-button">Cambiar nombre</button>`;
    container.querySelector('[data-testid="change-name-button"]').addEventListener('click', () => {
      renderNameForm(container, {
        currentName: getLocalName() ?? '',
        onSave: () => showButton(),
      });
    });
  }

  showButton();
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
