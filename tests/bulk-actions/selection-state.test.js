import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  toggleSelection,
  selectAllIds,
  clearSelectionSet,
  removeFromSelectionSet,
  createSelectionState,
} from '../../src/bulk-actions/selection-state.js';

describe('toggleSelection — round-trip / auto-inversa (PBT-02)', () => {
  it('aplicar toggleSelection dos veces sobre el mismo id devuelve un set equivalente al original', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), fc.string(), (initialIds, id) => {
        const initial = new Set(initialIds);
        const once = toggleSelection(initial, id);
        const twice = toggleSelection(once, id);
        expect([...twice].sort()).toEqual([...initial].sort());
      })
    );
  });
});

describe('selectAllIds / clearSelectionSet — invariantes (PBT-03)', () => {
  it('selectAllIds produce un set cuyo tamaño es igual al número de ids únicos', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (ids) => {
        const result = selectAllIds(ids);
        expect(result.size).toBe(new Set(ids).size);
      })
    );
  });

  it('clearSelectionSet siempre produce un set vacío, sin importar el estado previo', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (ids) => {
        const result = clearSelectionSet(new Set(ids));
        expect(result.size).toBe(0);
      })
    );
  });
});

describe('removeFromSelectionSet', () => {
  it('elimina el id indicado sin afectar a los demás', () => {
    const initial = new Set(['a', 'b', 'c']);
    const result = removeFromSelectionSet(initial, 'b');
    expect([...result].sort()).toEqual(['a', 'c']);
  });

  it('no falla si el id no estaba presente', () => {
    const initial = new Set(['a']);
    const result = removeFromSelectionSet(initial, 'zzz');
    expect([...result]).toEqual(['a']);
  });
});

describe('createSelectionState', () => {
  it('empieza vacío', () => {
    const state = createSelectionState();
    expect(state.getSelection().size).toBe(0);
  });

  it('toggleSelection añade y quita', () => {
    const state = createSelectionState();
    state.toggleSelection('p1');
    expect(state.isSelected('p1')).toBe(true);
    state.toggleSelection('p1');
    expect(state.isSelected('p1')).toBe(false);
  });

  it('selectAll y clearSelection', () => {
    const state = createSelectionState();
    state.selectAll(['p1', 'p2']);
    expect(state.getSelection().size).toBe(2);
    state.clearSelection();
    expect(state.getSelection().size).toBe(0);
  });

  it('removeFromSelection quita un producto que desaparece por Realtime', () => {
    const state = createSelectionState();
    state.selectAll(['p1', 'p2']);
    state.removeFromSelection('p1');
    expect(state.isSelected('p1')).toBe(false);
    expect(state.isSelected('p2')).toBe(true);
  });
});
