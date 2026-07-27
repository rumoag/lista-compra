// Suscripción Realtime — BR-8, BR-9 (Unidad 2), generalizada en la Unidad 7 (BR-59) para
// aceptar la tabla como parámetro y servir tanto a products como a purchases. Aísla la API
// de Supabase Realtime para que los llamantes puedan testearse/razonarse sin depender
// directamente de ella.
import { supabase } from './supabase-client.js';

export function createRealtimeSubscription({ householdId, table }) {
  let channel = null;

  function subscribe({ onInsert, onUpdate, onDelete }) {
    channel = supabase
      .channel(`${table}-${householdId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table, filter: `household_id=eq.${householdId}` },
        (payload) => onInsert?.(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter: `household_id=eq.${householdId}` },
        (payload) => onUpdate?.(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table, filter: `household_id=eq.${householdId}` },
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
