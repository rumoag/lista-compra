// Suscripción Realtime — BR-8, BR-9. Aísla la API de Supabase Realtime para que
// product-list.js pueda testearse/razonarse sin depender directamente de ella.
import { supabase } from '../common/supabase-client.js';

export function createRealtimeSubscription({ householdId }) {
  let channel = null;

  function subscribe({ onInsert, onUpdate, onDelete }) {
    channel = supabase
      .channel(`products-${householdId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'products', filter: `household_id=eq.${householdId}` },
        (payload) => onInsert?.(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products', filter: `household_id=eq.${householdId}` },
        (payload) => onUpdate?.(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'products', filter: `household_id=eq.${householdId}` },
        (payload) => onDelete?.(payload.old)
      )
      .subscribe();

    return channel;
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  }

  return { subscribe, unsubscribe };
}
