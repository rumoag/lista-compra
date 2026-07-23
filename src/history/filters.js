// Filtros de historial — BR-16. Funciones puras.

export function filterByDateRange(products, start, end) {
  const startMs = start ? new Date(start).getTime() : -Infinity;
  const endMs = end ? new Date(end).getTime() : Infinity;

  return products.filter((product) => {
    const boughtAtMs = new Date(product.bought_at).getTime();
    return boughtAtMs >= startMs && boughtAtMs <= endMs;
  });
}

export function filterByName(products, query) {
  if (!query) return products;
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') return products;
  return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
}
