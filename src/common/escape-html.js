// Escapa HTML/atributos antes de interpolar en un template string (no hay bundler/JSX en
// el proyecto, así que el HTML se construye a mano — ver src/common/icon.js).
const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}
