// Funciones puras de cálculo de participantes (BR-27, BR-28), sin dependencias de red —
// separadas de households-api.js para que los componentes de presentación (list-card.js)
// no arrastren una dependencia transitiva del cliente de Supabase.

const MAX_VISIBLE_PARTICIPANTS = 3;

export function buildParticipantsMap(products) {
  const byHousehold = new Map();

  for (const product of products) {
    if (!byHousehold.has(product.household_id)) {
      byHousehold.set(product.household_id, new Set());
    }
    const set = byHousehold.get(product.household_id);
    if (product.added_by) set.add(product.added_by);
    if (product.bought_by) set.add(product.bought_by);
  }

  const result = new Map();
  for (const [householdId, set] of byHousehold) {
    result.set(householdId, [...set]);
  }
  return result;
}

export function formatParticipants(participants) {
  if (participants.length <= MAX_VISIBLE_PARTICIPANTS) {
    return participants.join(', ');
  }
  const visible = participants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const remaining = participants.length - MAX_VISIBLE_PARTICIPANTS;
  return `${visible.join(', ')} y ${remaining} más`;
}
