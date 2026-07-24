import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn(),
};

vi.mock('../../src/common/supabase-client.js', () => ({
  supabase: { from: vi.fn(() => mockQuery) },
}));

const { rankSuggestedProducts, fetchSuggestedProducts } = await import('../../src/list/suggested-products.js');
const { supabase } = await import('../../src/common/supabase-client.js');

describe('rankSuggestedProducts (BR-39)', () => {
  it('ordena por frecuencia descendente', () => {
    const products = [
      { name: 'Leche', status: 'bought', created_at: '2026-01-01' },
      { name: 'Leche', status: 'bought', created_at: '2026-01-08' },
      { name: 'Leche', status: 'bought', created_at: '2026-01-15' },
      { name: 'Pan', status: 'bought', created_at: '2026-01-01' },
      { name: 'Pan', status: 'bought', created_at: '2026-01-08' },
      { name: 'Huevos', status: 'bought', created_at: '2026-01-01' },
    ];

    expect(rankSuggestedProducts(products)).toEqual(['Leche', 'Pan', 'Huevos']);
  });

  it('excluye nombres que están actualmente pending (CQ3 = B)', () => {
    const products = [
      { name: 'Leche', status: 'bought', created_at: '2026-01-01' },
      { name: 'Leche', status: 'pending', created_at: '2026-01-08' },
      { name: 'Pan', status: 'bought', created_at: '2026-01-01' },
    ];

    expect(rankSuggestedProducts(products)).toEqual(['Pan']);
  });

  it('limita a 5 resultados', () => {
    const products = ['A', 'B', 'C', 'D', 'E', 'F'].map((name) => ({
      name,
      status: 'bought',
      created_at: '2026-01-01',
    }));

    expect(rankSuggestedProducts(products)).toHaveLength(5);
  });

  it('desempata por uso más reciente', () => {
    const products = [
      { name: 'Leche', status: 'bought', created_at: '2026-01-01' },
      { name: 'Pan', status: 'bought', created_at: '2026-01-10' },
    ];

    expect(rankSuggestedProducts(products)).toEqual(['Pan', 'Leche']);
  });

  it('devuelve vacío si no hay histórico', () => {
    expect(rankSuggestedProducts([])).toEqual([]);
  });
});

describe('fetchSuggestedProducts', () => {
  beforeEach(() => {
    supabase.from.mockClear();
    mockQuery.limit.mockReset();
  });

  it('consulta products del household con el límite defensivo de 2000', async () => {
    mockQuery.limit.mockResolvedValue({
      data: [{ name: 'Leche', status: 'bought', created_at: '2026-01-01' }],
      error: null,
    });

    const result = await fetchSuggestedProducts('h1');

    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(mockQuery.eq).toHaveBeenCalledWith('household_id', 'h1');
    expect(mockQuery.limit).toHaveBeenCalledWith(2000);
    expect(result).toEqual(['Leche']);
  });

  it('propaga el error si falla la consulta', async () => {
    mockQuery.limit.mockResolvedValue({ data: null, error: new Error('boom') });

    await expect(fetchSuggestedProducts('h1')).rejects.toThrow('boom');
  });
});
