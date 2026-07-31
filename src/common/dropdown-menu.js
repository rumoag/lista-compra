// Menú desplegable de 3 puntos genérico (generaliza home/list-actions-menu.js, Unidad 5,
// para reutilizarlo en la cabecera y en los items de producto de la Unidad 6). El botón que
// abre el menú es personalizable (toggleClass/toggleContent/toggleLabel) para poder mostrarlo
// como un avatar circular en la topbar (BR-46) sin cambiar el resto de usos, que siguen con
// los "3 puntos" por defecto.
import { icon } from './icon.js';

// Un único dropdown abierto a la vez: el toggle de cada instancia llama a
// event.stopPropagation(), así que el listener de "click fuera" de un dropdown ya
// abierto nunca se entera de que se pulsó el toggle de otro (la propagación se corta
// antes de llegar a document) y ambos quedaban abiertos a la vez.
let closeOpenDropdown = null;

export function renderDropdownMenu(
  container,
  { actions, toggleClass = 'icon-button', toggleContent = icon('dots-three-vertical'), toggleLabel = 'Más opciones' }
) {
  container.innerHTML = `
    <div class="dropdown-menu" data-testid="dropdown-menu">
      <button type="button" class="${toggleClass}" data-testid="dropdown-menu-toggle" aria-label="${toggleLabel}">${toggleContent}</button>
      <div class="dropdown-menu-list" data-testid="dropdown-menu-list" hidden>
        ${actions
          .map((action) => `<button type="button" data-testid="dropdown-menu-${action.testid}">${action.label}</button>`)
          .join('')}
      </div>
    </div>
  `;

  const toggle = container.querySelector('[data-testid="dropdown-menu-toggle"]');
  const dropdown = container.querySelector('[data-testid="dropdown-menu-list"]');

  function close() {
    dropdown.hidden = true;
    document.removeEventListener('click', onOutsideClick);
    if (closeOpenDropdown === close) closeOpenDropdown = null;
  }

  function onOutsideClick(event) {
    if (!container.contains(event.target)) close();
  }

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (dropdown.hidden) {
      if (closeOpenDropdown) closeOpenDropdown();
      dropdown.hidden = false;
      document.addEventListener('click', onOutsideClick);
      closeOpenDropdown = close;
    } else {
      close();
    }
  });

  actions.forEach((action) => {
    container.querySelector(`[data-testid="dropdown-menu-${action.testid}"]`).addEventListener('click', (event) => {
      event.stopPropagation();
      close();
      action.onClick();
    });
  });
}
