// Orquesta la pantalla de estadísticas: un único fetch (≤2000 compras, sin caché, Question 2 = A
// de NFR Design) y pasa los datos ya calculados a cada componente.
import { supabase } from '../common/supabase-client.js';
import { groupByNormalizedName } from './calculations.js';
import { renderStatsRanking } from './stats-ranking.js';
import { renderStatsCadence } from './stats-cadence.js';
import { renderStatsDistribution } from './stats-distribution.js';
import { renderStatsTimeseries } from './stats-timeseries.js';
import { renderSkeleton } from '../common/skeleton.js';

const STATS_FETCH_LIMIT = 2000;

export async function renderStatsPage(container, { householdId }) {
  container.innerHTML = `
    <div id="stats-ranking-container"></div>
    <div id="stats-timeseries-container"></div>
    <div id="stats-cadence-container"></div>
    <div id="stats-distribution-container"></div>
  `;

  renderSkeleton(container.querySelector('#stats-ranking-container'), { variant: 'stat-block', count: 1 });
  renderSkeleton(container.querySelector('#stats-timeseries-container'), { variant: 'stat-block', count: 1 });
  renderSkeleton(container.querySelector('#stats-cadence-container'), { variant: 'stat-block', count: 1 });
  renderSkeleton(container.querySelector('#stats-distribution-container'), { variant: 'stat-block', count: 1 });

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('household_id', householdId)
    .eq('status', 'bought')
    .order('bought_at', { ascending: false })
    .limit(STATS_FETCH_LIMIT);

  if (error) {
    container.innerHTML = '<p class="error-message" role="alert">No se pudieron cargar las estadísticas.</p>';
    return;
  }

  const groups = groupByNormalizedName(data);

  await renderStatsRanking(container.querySelector('#stats-ranking-container'), { groups });
  await renderStatsTimeseries(container.querySelector('#stats-timeseries-container'), { products: data });
  renderStatsCadence(container.querySelector('#stats-cadence-container'), { groups });
  await renderStatsDistribution(container.querySelector('#stats-distribution-container'), { products: data });
}
