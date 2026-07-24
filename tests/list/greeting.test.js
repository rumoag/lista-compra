import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderGreeting } from '../../src/list/greeting.js';
import { setLocalName } from '../../src/onboarding/name-prompt.js';

beforeEach(() => {
  localStorage.clear();
});

describe('renderGreeting (BR-45, FR-8)', () => {
  it('muestra "Hola, {nombre}"', () => {
    setLocalName('Ana');
    const container = document.createElement('div');
    renderGreeting(container, { onChangeName: vi.fn() });

    expect(container.querySelector('[data-testid="greeting"]').textContent).toBe('Hola, Ana');
  });

  it('llama a onChangeName al pulsarlo', () => {
    setLocalName('Ana');
    const onChangeName = vi.fn();
    const container = document.createElement('div');
    renderGreeting(container, { onChangeName });

    container.querySelector('[data-testid="greeting"]').click();

    expect(onChangeName).toHaveBeenCalled();
  });
});
