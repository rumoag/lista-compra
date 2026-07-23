// Estado de selección múltiple — BR-10 (efímero, no persistido).
// Funciones puras (testeadas con PBT, ver business-logic-model.md de la Unidad 2)
// operan sobre un Set inmutable; el factory de abajo mantiene el estado en memoria.

export function toggleSelection(selectionSet, id) {
  const next = new Set(selectionSet);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

export function selectAllIds(ids) {
  return new Set(ids);
}

export function clearSelectionSet() {
  return new Set();
}

export function removeFromSelectionSet(selectionSet, id) {
  const next = new Set(selectionSet);
  next.delete(id);
  return next;
}

export function createSelectionState() {
  let selection = new Set();

  return {
    toggleSelection(id) {
      selection = toggleSelection(selection, id);
      return selection;
    },
    selectAll(ids) {
      selection = selectAllIds(ids);
      return selection;
    },
    clearSelection() {
      selection = clearSelectionSet();
      return selection;
    },
    removeFromSelection(id) {
      selection = removeFromSelectionSet(selection, id);
      return selection;
    },
    getSelection() {
      return selection;
    },
    isSelected(id) {
      return selection.has(id);
    },
  };
}
