// Cálculo de estadísticas — BR-13, BR-14. Funciones puras.
import { normalizeWhitespace } from '../common/validation.js';

export function normalizeProductKey(name) {
  return normalizeWhitespace(name).toLowerCase();
}

/**
 * Agrupa productos comprados por nombre normalizado (BR-14).
 * Devuelve un array de { normalizedName, displayName, purchases, purchaseCount, lastBoughtAt, averageCadenceDays }.
 */
export function groupByNormalizedName(products) {
  const groups = new Map();

  for (const product of products) {
    const key = normalizeProductKey(product.name);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(product);
  }

  return [...groups.entries()].map(([normalizedName, purchases]) => {
    const sorted = [...purchases].sort((a, b) => new Date(a.bought_at) - new Date(b.bought_at));
    const mostRecent = sorted[sorted.length - 1];
    return {
      normalizedName,
      displayName: mostRecent.name,
      purchases: sorted,
      purchaseCount: sorted.length,
      lastBoughtAt: mostRecent.bought_at,
      averageCadenceDays: computeAverageCadenceDays(sorted.map((p) => p.bought_at)),
    };
  });
}

/**
 * Media aritmética de los intervalos (en días) entre compras consecutivas (BR-13).
 * Devuelve null si hay menos de 2 fechas. El orden de entrada no importa: se ordena internamente.
 */
export function computeAverageCadenceDays(dates) {
  if (dates.length < 2) return null;

  const sortedMs = [...dates].map((d) => new Date(d).getTime()).sort((a, b) => a - b);
  const intervalsDays = [];
  for (let i = 1; i < sortedMs.length; i++) {
    intervalsDays.push((sortedMs[i] - sortedMs[i - 1]) / (1000 * 60 * 60 * 24));
  }

  const sum = intervalsDays.reduce((acc, v) => acc + v, 0);
  return sum / intervalsDays.length;
}

export function computeRanking(groups) {
  return [...groups].sort((a, b) => b.purchaseCount - a.purchaseCount);
}

const WEEKDAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function computeDistributionByWeekday(products) {
  const counts = new Array(7).fill(0);
  for (const product of products) {
    const day = new Date(product.bought_at).getDay();
    counts[day] += 1;
  }
  return WEEKDAY_NAMES.map((name, index) => ({ weekday: name, count: counts[index] }));
}

export function computeDistributionByPerson(products) {
  const counts = new Map();
  for (const product of products) {
    const person = product.bought_by ?? 'Desconocido';
    counts.set(person, (counts.get(person) ?? 0) + 1);
  }
  return [...counts.entries()].map(([person, count]) => ({ person, count }));
}
