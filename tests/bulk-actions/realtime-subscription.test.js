import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockChannel = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
};

vi.mock('../../src/common/supabase-client.js', () => ({
  supabase: {
    channel: vi.fn(() => mockChannel),
    removeChannel: vi.fn(),
  },
}));

const { supabase } = await import('../../src/common/supabase-client.js');
const { createRealtimeSubscription } = await import('../../src/bulk-actions/realtime-subscription.js');

describe('createRealtimeSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChannel.on.mockReturnThis();
    mockChannel.subscribe.mockReturnThis();
  });

  it('crea un canal con el nombre derivado del householdId', () => {
    const sub = createRealtimeSubscription({ householdId: 'abc-123' });
    sub.subscribe({ onInsert: vi.fn(), onUpdate: vi.fn(), onDelete: vi.fn() });

    expect(supabase.channel).toHaveBeenCalledWith('products-abc-123');
  });

  it('se suscribe a los eventos INSERT, UPDATE y DELETE (BR-9)', () => {
    const sub = createRealtimeSubscription({ householdId: 'abc-123' });
    sub.subscribe({ onInsert: vi.fn(), onUpdate: vi.fn(), onDelete: vi.fn() });

    const events = mockChannel.on.mock.calls.map((call) => call[1].event);
    expect(events).toEqual(['INSERT', 'UPDATE', 'DELETE']);
  });

  it('invoca onInsert con el nuevo registro al recibir un evento INSERT', () => {
    const onInsert = vi.fn();
    const sub = createRealtimeSubscription({ householdId: 'abc-123' });
    sub.subscribe({ onInsert, onUpdate: vi.fn(), onDelete: vi.fn() });

    const insertHandler = mockChannel.on.mock.calls.find((call) => call[1].event === 'INSERT')[2];
    insertHandler({ new: { id: 'p1' } });

    expect(onInsert).toHaveBeenCalledWith({ id: 'p1' });
  });

  it('unsubscribe llama a supabase.removeChannel con el canal creado', () => {
    const sub = createRealtimeSubscription({ householdId: 'abc-123' });
    sub.subscribe({ onInsert: vi.fn(), onUpdate: vi.fn(), onDelete: vi.fn() });

    sub.unsubscribe();

    expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel);
  });

  it('unsubscribe sin haberse suscrito antes no falla', () => {
    const sub = createRealtimeSubscription({ householdId: 'abc-123' });
    expect(() => sub.unsubscribe()).not.toThrow();
    expect(supabase.removeChannel).not.toHaveBeenCalled();
  });
});
