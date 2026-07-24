// Capa de acceso a datos de la pantalla de inicio (Unidad 5).
// BR-34: la consulta de listas NO debe filtrar por dispositivo/identidad — se trae
// deliberadamente todo `households` sin ningún where, decisión de producto aceptada
// (ver aidlc-docs/inception/requirements/requirements.md NFR-2 y business-rules.md BR-34).
// No añadir un filtro "de más" aquí sin que el usuario lo pida explícitamente.
import { supabase } from '../common/supabase-client.js';
import { buildParticipantsMap } from './participants.js';

// BR-29: orden por created_at descendente (más recientes primero).
export async function fetchAllHouseholdsWithParticipants() {
  const [householdsResult, productsResult] = await Promise.all([
    supabase.from('households').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('household_id, added_by, bought_by'),
  ]);

  if (householdsResult.error) throw householdsResult.error;
  if (productsResult.error) throw productsResult.error;

  const participantsMap = buildParticipantsMap(productsResult.data);

  return householdsResult.data.map((household) => ({
    ...household,
    participants: participantsMap.get(household.id) ?? [],
  }));
}

export async function createHousehold({ title, image_icon }) {
  const { data, error } = await supabase
    .from('households')
    .insert({ title, image_icon })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateHousehold(id, { title, image_icon }) {
  const { error } = await supabase.from('households').update({ title, image_icon }).eq('id', id);
  if (error) throw error;
}

export async function deleteHousehold(id) {
  const { error } = await supabase.from('households').delete().eq('id', id);
  if (error) throw error;
}
