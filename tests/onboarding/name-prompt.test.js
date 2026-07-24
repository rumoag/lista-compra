import { describe, it, expect, beforeEach } from 'vitest';
import { ensureLocalName, getLocalName, setLocalName, renderNameForm } from '../../src/onboarding/name-prompt.js';

describe('name-prompt (stopgap identidad local)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('resuelve inmediatamente si ya existe un nombre local', async () => {
    setLocalName('Yo');
    const container = document.createElement('div');

    const result = await ensureLocalName(container);

    expect(result).toBe('Yo');
    expect(container.innerHTML).toBe('');
  });

  it('muestra un prompt y guarda el nombre al confirmarlo', async () => {
    const container = document.createElement('div');

    const promise = ensureLocalName(container);
    container.querySelector('[data-testid="name-prompt-input"]').value = 'Mi pareja';
    container.querySelector('[data-testid="name-prompt-save-button"]').click();

    const result = await promise;

    expect(result).toBe('Mi pareja');
    expect(getLocalName()).toBe('Mi pareja');
  });

  it('muestra error si se intenta guardar un nombre vacío', async () => {
    const container = document.createElement('div');
    ensureLocalName(container);

    container.querySelector('[data-testid="name-prompt-save-button"]').click();

    const errorEl = container.querySelector('[data-testid="name-prompt-error"]');
    expect(errorEl.hidden).toBe(false);
    expect(getLocalName()).toBeNull();
  });
});

describe('renderNameForm (BR-45, reutilizado en list/change-name-modal.js)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('precarga el nombre actual cuando se pasa currentName', () => {
    const container = document.createElement('div');
    renderNameForm(container, { currentName: 'Yo', onSave: () => {} });

    expect(container.querySelector('[data-testid="name-prompt-input"]').value).toBe('Yo');
  });

  it('guardar actualiza localStorage y llama a onSave con el nombre', () => {
    const container = document.createElement('div');
    let saved;
    renderNameForm(container, { onSave: (name) => (saved = name) });

    container.querySelector('[data-testid="name-prompt-input"]').value = 'Mi pareja';
    container.querySelector('[data-testid="name-prompt-save-button"]').click();

    expect(getLocalName()).toBe('Mi pareja');
    expect(saved).toBe('Mi pareja');
  });
});
