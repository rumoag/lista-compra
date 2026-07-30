// Skeletons de carga M3 (Ciclo 4 — motion system): placeholders con shimmer que ocupan el
// espacio del contenido real de una pantalla mientras se resuelve su fetch inicial. Antes de
// esto no había ningún indicador — el contenido aparecía de golpe al terminar la carga.
export function renderSkeleton(container, { variant, count = 3 }) {
  container.innerHTML = Array.from({ length: count }, () => variantMarkup(variant)).join('');
}

function variantMarkup(variant) {
  if (variant === 'list-card') {
    return `
      <div class="skeleton-list-card" aria-hidden="true">
        <div class="skeleton-block"></div>
        <div class="skeleton-block"></div>
      </div>
    `;
  }

  if (variant === 'stat-block') {
    return `<div class="skeleton-block skeleton-stat-block" aria-hidden="true"></div>`;
  }

  // 'list-row' por defecto: producto o ticket, misma forma (icono + línea de texto).
  return `
    <div class="skeleton-list-row" aria-hidden="true">
      <div class="skeleton-block"></div>
      <div class="skeleton-block"></div>
    </div>
  `;
}
