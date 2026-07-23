// Creación de household (US-5.2). createHousehold() viene sin cambios desde la Unidad 1;
// la Unidad 4 pule únicamente la copy/presentación (BR-21), sin tocar la lógica.
import { supabase } from '../common/supabase-client.js';

export async function createHousehold() {
  const { data, error } = await supabase.from('households').insert({}).select('id').single();
  if (error) throw error;
  return data.id;
}

export function renderCreateHousehold(container) {
  container.innerHTML = `
    <div class="card" data-testid="create-household">
      <h2>🛒 Lista de la Compra Compartida</h2>
      <p>Crea una lista para compartir con tu pareja. Después podrás generar un QR para pegar en la nevera y acceder desde cualquier móvil, sin necesidad de cuenta ni contraseña.</p>
      <button type="button" data-testid="create-household-button">Crear nueva lista</button>
      <div class="error-message" data-testid="create-household-error" hidden></div>
    </div>
  `;

  const button = container.querySelector('[data-testid="create-household-button"]');
  const errorEl = container.querySelector('[data-testid="create-household-error"]');

  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const householdId = await createHousehold();
      window.location.href = `/${householdId}`;
    } catch (err) {
      errorEl.textContent = 'No se pudo crear la lista. Inténtalo de nuevo.';
      errorEl.hidden = false;
      button.disabled = false;
    }
  });
}
