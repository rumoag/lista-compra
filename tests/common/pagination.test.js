import { describe, it, expect, vi } from 'vitest';
import { createPaginator } from '../../src/common/pagination.js';

function makeItem(id, createdAt) {
  return { id, created_at: createdAt, name: `item-${id}` };
}

describe('createPaginator', () => {
  it('carga la primera página sin cursor', async () => {
    const paginator = createPaginator({ pageSize: 2 });
    const fetchPage = vi.fn().mockResolvedValue([makeItem(1, '2026-01-02'), makeItem(2, '2026-01-01')]);

    const items = await paginator.loadNextPage(fetchPage);

    expect(fetchPage).toHaveBeenCalledWith({ before: null, limit: 2 });
    expect(items).toHaveLength(2);
  });

  it('usa el created_at del último elemento como cursor de la siguiente página', async () => {
    const paginator = createPaginator({ pageSize: 2 });
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce([makeItem(1, '2026-01-02'), makeItem(2, '2026-01-01')])
      .mockResolvedValueOnce([makeItem(3, '2025-12-31')]);

    await paginator.loadNextPage(fetchPage);
    const items = await paginator.loadNextPage(fetchPage);

    expect(fetchPage).toHaveBeenLastCalledWith({ before: '2026-01-01', limit: 2 });
    expect(items).toHaveLength(3);
  });

  it('prependItem añade un elemento al principio sin invalidar las páginas ya cargadas', async () => {
    const paginator = createPaginator({ pageSize: 2 });
    const fetchPage = vi.fn().mockResolvedValue([makeItem(1, '2026-01-01')]);
    await paginator.loadNextPage(fetchPage);

    const items = paginator.prependItem(makeItem(2, '2026-01-02'));

    expect(items.map((i) => i.id)).toEqual([2, 1]);
  });

  it('removeItem elimina el elemento indicado', async () => {
    const paginator = createPaginator();
    const fetchPage = vi.fn().mockResolvedValue([makeItem(1, '2026-01-01'), makeItem(2, '2026-01-02')]);
    await paginator.loadNextPage(fetchPage);

    const items = paginator.removeItem(1);

    expect(items.map((i) => i.id)).toEqual([2]);
  });

  it('reset limpia el cursor y los elementos', async () => {
    const paginator = createPaginator();
    const fetchPage = vi.fn().mockResolvedValue([makeItem(1, '2026-01-01')]);
    await paginator.loadNextPage(fetchPage);

    paginator.reset();

    expect(paginator.getItems()).toEqual([]);
  });
});
