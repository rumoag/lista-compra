// Paginación por cursor sobre created_at — ver nfr-design-patterns.md.
// fetchPage({ before, limit }) es inyectado por el llamante (envuelve la query real a Supabase),
// lo que permite probar el paginador sin depender de una conexión real.
export function createPaginator({ pageSize = 20 } = {}) {
  let cursor = null;
  let items = [];

  return {
    async loadNextPage(fetchPage) {
      const page = await fetchPage({ before: cursor, limit: pageSize });
      if (page.length > 0) {
        cursor = page[page.length - 1].created_at;
      }
      items = items.concat(page);
      return items;
    },

    // Inserta un elemento nuevo al principio sin invalidar las páginas ya cargadas
    // (necesario quando Realtime empiece a insertar filas nuevas en la Unidad 2).
    prependItem(item) {
      items = [item, ...items];
      return items;
    },

    removeItem(id) {
      items = items.filter((item) => item.id !== id);
      return items;
    },

    updateItem(id, changes) {
      items = items.map((item) => (item.id === id ? { ...item, ...changes } : item));
      return items;
    },

    getItems() {
      return items;
    },

    reset() {
      cursor = null;
      items = [];
    },
  };
}
