// Orquesta la pantalla de estadísticas: un único fetch (≤2000 compras, sin caché, Question 2 = A
// de NFR Design) y pasa los datos ya calculados a cada componente.
import { supabase } from '../common/supabase-client.js';
import { groupByNormalizedName } from './calculations.js';
import { renderStatsRanking } from './stats-ranking.js';
import { renderStatsCadence } from './stats-cadence.js';
import { renderStatsDistribution } from './stats-distribution.js';

const STATS_FETCH_LIMIT = 2000;

export async function renderStatsPage(container, { householdId }) {
  container.innerHTML = `
    <div id="stats-ranking-container"></div>
    <div id="stats-cadence-container"></div>
    <div id="stats-distribution-container"></div>
  `;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('household_id', householdId)
    .eq('status', 'bought')
    .order('bought_at', { ascending: false })
    .limit(STATS_FETCH_LIMIT);

  if (error) {
    container.innerHTML = '<p class="error-message">No se pudieron cargar las estadísticas.</p>';
    return;
  }

  const groups = groupByNormalizedName(data);

  renderStatsRanking(container.querySelector('#stats-ranking-container'), { groups });
  renderStatsCadence(container.querySelector('#stats-cadence-container'), { groups });
  renderStatsDistribution(container.querySelector('#stats-distribution-container'), { products: data });
}
