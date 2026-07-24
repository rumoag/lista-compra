import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockHouseholdsQuery = {
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
};

const mockProductsQuery = {
  select: vi.fn().mockReturnThis(),
};

vi.mock('../../src/common/supabase-client.js', () => ({
  supabase: {
    from: vi.fn((table) => (table === 'households' ? mockHouseholdsQuery : mockProductsQuery)),
  },
}));

const { supabase } = await import('../../src/common/supabase-client.js');
const {
  fetchAllHouseholdsWithParticipants,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} = await import('../../src/home/households-api.js');

function resetChain(query, resolvedValue) {
  Object.keys(query).forEach((key) => {
    if (typeof query[key] === 'function') query[key].mockClear();
  });
  Object.assign(query, {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    ...resolvedValue,
  });
}

describe('fetchAllHouseholdsWithParticipants (BR-29, sin filtro por BR-34)', () => {
  beforeEach(() => {
    supabase.from.mockClear();
  });

  it('trae todos los households ordenados por created_at desc y les añade sus participantes', async () => {
    resetChain(mockHouseholdsQuery, {
      order: vi.fn().mockResolvedValue({
        data: [
          { id: 'h1', title: 'Casa', image_icon: '🛒', created_at: '2026-01-02' },
          { id: 'h2', title: 'Piso', image_icon: '🏠', created_at: '2026-01-01' },
        ],
        error: null,
      }),
    });
    resetChain(mockProductsQuery, {});
    mockProductsQuery.select = vi.fn().mockResolvedValue({
      data: [{ household_id: 'h1', added_by: 'Ana', bought_by: null }],
      error: null,
    });

    const result = await fetchAllHouseholdsWithParticipants();

    expect(supabase.from).toHaveBeenCalledWith('households');
    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(result).toEqual([
      { id: 'h1', title: 'Casa', image_icon: '🛒', created_at: '2026-01-02', participants: ['Ana'] },
      { id: 'h2', title: 'Piso', image_icon: '🏠', created_at: '2026-01-01', participants: [] },
    ]);
  });

  it('propaga el error si falla la consulta de households', async () => {
    resetChain(mockHouseholdsQuery, {
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('boom') }),
    });
    resetChain(mockProductsQuery, {});
    mockProductsQuery.select = vi.fn().mockResolvedValue({ data: [], error: null });

    await expect(fetchAllHouseholdsWithParticipants()).rejects.toThrow('boom');
  });
});

describe('createHousehold / updateHousehold / deleteHousehold', () => {
  beforeEach(() => {
    supabase.from.mockClear();
  });

  it('createHousehold inserta title/image_icon y devuelve el id', async () => {
    resetChain(mockHouseholdsQuery, {
      single: vi.fn().mockResolvedValue({ data: { id: 'new-id' }, error: null }),
    });

    const id = await createHousehold({ title: 'Nueva lista', image_icon: '🛒' });

    expect(mockHouseholdsQuery.insert).toHaveBeenCalledWith({ title: 'Nueva lista', image_icon: '🛒' });
    expect(id).toBe('new-id');
  });

  it('updateHousehold actualiza title/image_icon por id', async () => {
    resetChain(mockHouseholdsQuery, {
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await updateHousehold('h1', { title: 'Editada', image_icon: '🥦' });

    expect(mockHouseholdsQuery.update).toHaveBeenCalledWith({ title: 'Editada', image_icon: '🥦' });
    expect(mockHouseholdsQuery.eq).toHaveBeenCalledWith('id', 'h1');
  });

  it('deleteHousehold borra por id', async () => {
    resetChain(mockHouseholdsQuery, {
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await deleteHousehold('h1');

    expect(mockHouseholdsQuery.delete).toHaveBeenCalled();
    expect(mockHouseholdsQuery.eq).toHaveBeenCalledWith('id', 'h1');
  });

  it('propaga el error si falla el borrado', async () => {
    resetChain(mockHouseholdsQuery, {
      eq: vi.fn().mockResolvedValue({ error: new Error('boom') }),
    });

    await expect(deleteHousehold('h1')).rejects.toThrow('boom');
  });
});
