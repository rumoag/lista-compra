// Modal de cambiar nombre (BR-45) — mismo destino desde la cabecera y desde el saludo.
import { openModal } from '../common/modal.js';
import { renderNameForm, getLocalName } from '../onboarding/name-prompt.js';

export function openChangeNameModal({ onSaved }) {
  const { body, close } = openModal({ title: 'Cambiar nombre' });

  renderNameForm(body, {
    currentName: getLocalName() ?? '',
    onSave: (name) => {
      close();
      onSaved(name);
    },
  });
}
