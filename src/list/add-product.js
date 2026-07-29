// Abre el wizard de "Añadir producto" (FR-13, BR-44) de forma independiente de la vista
// activa: el FAB es persistente entre Lista/Historial/Estadísticas (Unidad 6), así que el
// alta ya no puede depender del estado local de product-list.js (paginator, optimistic update).
// La vista de Lista, si está montada, recoge el producto nuevo vía su propia suscripción
// Realtime (BR-8), igual que si lo añadiera otro miembro del household.
import { supabase } from '../common/supabase-client.js';
import { openProductWizardModal } from './product-wizard-modal.js';
import { fetchSuggestedProducts } from './suggested-products.js';
import { getLocalName } from '../onboarding/name-prompt.js';

export async function openAddProductWizard({ householdId }) {
  let suggestedProducts = [];
  try {
    suggestedProducts = await fetchSuggestedProducts(householdId);
  } catch (err) {
    // Sin sugerencias si falla la consulta — el wizard sigue funcionando con "Otros".
  }

  openProductWizardModal({
    mode: 'create',
    suggestedProducts,
    onSave: async ({ name, quantity_number, quantity_unit, category, note }) => {
      const { error } = await supabase.from('products').insert({
        household_id: householdId,
        name,
        quantity_number,
        quantity_unit,
        category,
        note,
        status: 'pending',
        added_by: getLocalName(),
      });
      if (error) throw error;
    },
  });
}
