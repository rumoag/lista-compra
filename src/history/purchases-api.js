// Capa de acceso a datos de purchases (Unidad 7, seguimiento) — edición del título de un
// ticket tras su creación (mismo patrón que home/households-api.js).
import { supabase } from '../common/supabase-client.js';

export async function updatePurchaseTitle(id, title) {
  const { error } = await supabase.from('purchases').update({ title }).eq('id', id);
  if (error) throw error;
}
