// Colores de los gráficos leídos de los tokens M3 existentes (css/tokens.css), una sola vez
// por gráfico creado — sin listener de cambio de tema en caliente (NFR Design Question 2 = A).
const TOKEN_MAP = {
  primary: '--md-sys-color-primary',
  secondary: '--md-sys-color-secondary',
  tertiary: '--md-sys-color-tertiary',
  onSurface: '--md-sys-color-on-surface',
  outlineVariant: '--md-sys-color-outline-variant',
};

export function getChartColors() {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    Object.entries(TOKEN_MAP).map(([key, token]) => [key, style.getPropertyValue(token).trim()])
  );
}
