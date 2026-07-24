// Productos sugeridos (BR-39) — 5 nombres más repetidos en el histórico de la lista,
// excluyendo los que ya están pendientes actualmente.
import { supabase } from '../common/supabase-client.js';

const SUGGESTIONS_COUNT = 5;
const HISTORY_FETCH_LIMIT = 2000; // mismo límite defensivo que Unidad 3 (estadísticas)

export function rankSuggestedProducts(products) {
  const pendingNames = new Set(products.filter((p) => p.status === 'pending').map((p) => p.name));

  const stats = new Map();
  for (const product of products) {
    if (pendingNames.has(product.name)) continue;
    const entry = stats.get(product.name) ?? { count: 0, lastUsed: product.created_at };
    entry.count += 1;
    if (product.created_at > entry.lastUsed) entry.lastUsed = product.created_at;
    stats.set(product.name, entry);
  }

  return [...stats.entries()]
    .sort((a, b) => b[1].count - a[1].count || (b[1].lastUsed > a[1].lastUsed ? 1 : -1))
    .slice(0, SUGGESTIONS_COUNT)
    .map(([name]) => name);
}

export async function fetchSuggestedProducts(householdId) {
  const { data, error } = await supabase
    .from('products')
    .select('name, status, created_at')
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })
    .limit(HISTORY_FETCH_LIMIT);
  if (error) throw error;
  return rankSuggestedProducts(data);
}
