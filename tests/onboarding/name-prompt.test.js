import { describe, it, expect, beforeEach } from 'vitest';
import {
  ensureLocalName,
  getLocalName,
  setLocalName,
  renderChangeNameButton,
} from '../../src/onboarding/name-prompt.js';

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

describe('renderChangeNameButton (BR-20)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra un botón "Cambiar nombre"', () => {
    const container = document.createElement('div');
    renderChangeNameButton(container);

    expect(container.querySelector('[data-testid="change-name-button"]')).not.toBeNull();
  });

  it('al pulsarlo, muestra el formulario pre-rellenado con el nombre actual', () => {
    setLocalName('Yo');
    const container = document.createElement('div');
    renderChangeNameButton(container);

    container.querySelector('[data-testid="change-name-button"]').click();

    expect(container.querySelector('[data-testid="name-prompt-input"]').value).toBe('Yo');
  });

  it('guardar un nuevo nombre actualiza localStorage y vuelve a mostrar el botón', () => {
    setLocalName('Yo');
    const container = document.createElement('div');
    renderChangeNameButton(container);

    container.querySelector('[data-testid="change-name-button"]').click();
    container.querySelector('[data-testid="name-prompt-input"]').value = 'Mi pareja';
    container.querySelector('[data-testid="name-prompt-save-button"]').click();

    expect(getLocalName()).toBe('Mi pareja');
    expect(container.querySelector('[data-testid="change-name-button"]')).not.toBeNull();
  });
});
