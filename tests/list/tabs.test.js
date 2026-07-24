import { describe, it, expect, vi } from 'vitest';
import { renderTabs } from '../../src/list/tabs.js';

function makeViews() {
  return {
    list: { label: 'Lista', render: vi.fn() },
    history: { label: 'Historial', render: vi.fn() },
    stats: { label: 'Estadísticas', render: vi.fn() },
  };
}

describe('renderTabs (BR-47)', () => {
  it('renderiza un botón por tab y activa la vista inicial', () => {
    const nav = document.createElement('div');
    const view = document.createElement('div');
    const views = makeViews();

    renderTabs(nav, view, { views, householdId: 'h1', initialView: 'list' });

    expect(nav.querySelector('[data-testid="tabs-list-button"]').getAttribute('aria-current')).toBe('true');
    expect(views.list.render).toHaveBeenCalledWith(view, { householdId: 'h1' });
    expect(views.history.render).not.toHaveBeenCalled();
  });

  it('no incluye un tab de QR (se movió a la cabecera, BR-46)', () => {
    const nav = document.createElement('div');
    const view = document.createElement('div');
    renderTabs(nav, view, { views: makeViews(), householdId: 'h1', initialView: 'list' });

    expect(nav.querySelector('[data-testid="tabs-qr-button"]')).toBeNull();
  });

  it('cambia de tab al pulsar otro botón', () => {
    const nav = document.createElement('div');
    const view = document.createElement('div');
    const views = makeViews();
    renderTabs(nav, view, { views, householdId: 'h1', initialView: 'list' });

    nav.querySelector('[data-testid="tabs-history-button"]').click();

    expect(views.history.render).toHaveBeenCalledWith(view, { householdId: 'h1' });
    expect(nav.querySelector('[data-testid="tabs-history-button"]').getAttribute('aria-current')).toBe('true');
    expect(nav.querySelector('[data-testid="tabs-list-button"]').getAttribute('aria-current')).toBeNull();
  });

  it('llama a la función de limpieza devuelta por la vista anterior al cambiar de tab (regresión: Realtime/IntersectionObserver quedaban huérfanos, bloqueando la recarga posterior de "Lista")', async () => {
    const cleanupList = vi.fn();
    const views = {
      list: { label: 'Lista', render: vi.fn().mockResolvedValue(cleanupList) },
      history: { label: 'Historial', render: vi.fn() },
    };
    const nav = document.createElement('div');
    const view = document.createElement('div');
    renderTabs(nav, view, { views, householdId: 'h1', initialView: 'list' });
    await new Promise((r) => setTimeout(r, 0));

    nav.querySelector('[data-testid="tabs-history-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(cleanupList).toHaveBeenCalledOnce();
  });

  it('no falla si la vista activa no devuelve función de limpieza', async () => {
    const views = makeViews();
    const nav = document.createElement('div');
    const view = document.createElement('div');
    renderTabs(nav, view, { views, householdId: 'h1', initialView: 'list' });
    await new Promise((r) => setTimeout(r, 0));

    expect(() => nav.querySelector('[data-testid="tabs-history-button"]').click()).not.toThrow();
  });
});
