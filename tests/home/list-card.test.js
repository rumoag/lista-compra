import { describe, it, expect, vi } from 'vitest';
import { renderListCard } from '../../src/home/list-card.js';

function mount(el) {
  document.body.appendChild(el);
  return el;
}

function makeHousehold(overrides = {}) {
  return {
    id: 'h1',
    title: 'Casa',
    image_icon: '🛒',
    participants: ['Ana', 'Luis'],
    ...overrides,
  };
}

describe('renderListCard', () => {
  it('muestra icono, título y participantes', () => {
    const el = mount(renderListCard(makeHousehold(), { onEdit: vi.fn(), onDelete: vi.fn(), onViewQr: vi.fn(), onOpen: vi.fn() }));

    expect(el.querySelector('[data-testid="list-card-icon"]').textContent).toBe('🛒');
    expect(el.querySelector('[data-testid="list-card-title"]').textContent).toBe('Casa');
    expect(el.querySelector('[data-testid="list-card-participants"]').textContent).toBe('Ana, Luis');
  });

  it('llama a onOpen con el id al hacer click en el área principal', () => {
    const onOpen = vi.fn();
    const el = mount(renderListCard(makeHousehold(), { onEdit: vi.fn(), onDelete: vi.fn(), onViewQr: vi.fn(), onOpen }));

    el.querySelector('[data-testid="list-card-open-area"]').click();

    expect(onOpen).toHaveBeenCalledWith('h1');
  });

  it('llama a onEdit con el household completo desde el menú de 3 puntos', () => {
    const onEdit = vi.fn();
    const household = makeHousehold();
    const el = mount(renderListCard(household, { onEdit, onDelete: vi.fn(), onViewQr: vi.fn(), onOpen: vi.fn() }));

    el.querySelector('[data-testid="list-actions-menu-toggle"]').click();
    el.querySelector('[data-testid="list-actions-menu-edit"]').click();

    expect(onEdit).toHaveBeenCalledWith(household);
  });

  it('trunca participantes con más de 3 (BR-28)', () => {
    const el = mount(
      renderListCard(makeHousehold({ participants: ['Ana', 'Luis', 'Mar', 'Eva'] }), {
        onEdit: vi.fn(),
        onDelete: vi.fn(),
        onViewQr: vi.fn(),
        onOpen: vi.fn(),
      })
    );

    expect(el.querySelector('[data-testid="list-card-participants"]').textContent).toBe('Ana, Luis, Mar y 1 más');
  });
});
