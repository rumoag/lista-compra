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

const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function fillMonthRange(firstKey, lastKey) {
  const [fy, fm] = firstKey.split('-').map(Number);
  const [ly, lm] = lastKey.split('-').map(Number);
  const keys = [];
  let y = fy;
  let m = fm;
  while (y < ly || (y === ly && m <= lm)) {
    keys.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return keys;
}

// Semana ISO 8601 (lunes a domingo). key = "YYYY-Www".
function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // lunes=0 ... domingo=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // jueves de esa semana (referencia ISO)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstThursdayDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNum + 3);
  const weekNum = 1 + Math.round((d - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function mondayOfIsoWeek(key) {
  const [yearStr, weekStr] = key.split('-W');
  const year = Number(yearStr);
  const week = Number(weekStr);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4DayNum = (jan4.getUTCDay() + 6) % 7;
  const monday = new Date(Date.UTC(year, 0, 4 - jan4DayNum + (week - 1) * 7));
  return monday;
}

function weekLabel(key) {
  const monday = mondayOfIsoWeek(key);
  const dd = String(monday.getUTCDate()).padStart(2, '0');
  const mm = String(monday.getUTCMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

function fillWeekRange(firstKey, lastKey) {
  const keys = [];
  let current = mondayOfIsoWeek(firstKey);
  const last = mondayOfIsoWeek(lastKey);
  while (current.getTime() <= last.getTime()) {
    keys.push(isoWeekKey(current));
    current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  return keys;
}

/**
 * Agrega compras por periodo (mes o semana ISO), rellenando con count 0 los periodos
 * sin compras dentro del rango observado (BR-68). Devuelve un array de
 * { periodKey, label, count } ordenado ascendentemente (BR-67, FR-36).
 */
export function computeTimeSeries(products, granularity) {
  if (products.length === 0) return [];

  const toKey = granularity === 'week' ? isoWeekKey : monthKey;
  const toLabel = granularity === 'week' ? weekLabel : monthLabel;
  const fillRange = granularity === 'week' ? fillWeekRange : fillMonthRange;

  const counts = new Map();
  for (const product of products) {
    const key = toKey(new Date(product.bought_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const sortedKeys = [...counts.keys()].sort();
  const fullKeys = fillRange(sortedKeys[0], sortedKeys[sortedKeys.length - 1]);

  return fullKeys.map((key) => ({
    periodKey: key,
    label: toLabel(key),
    count: counts.get(key) ?? 0,
  }));
}
