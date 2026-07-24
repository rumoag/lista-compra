import { describe, it, expect } from 'vitest';
import { buildParticipantsMap, formatParticipants } from '../../src/home/participants.js';

describe('buildParticipantsMap (BR-27)', () => {
  it('une added_by y bought_by sin duplicados por household', () => {
    const products = [
      { household_id: 'h1', added_by: 'Ana', bought_by: null },
      { household_id: 'h1', added_by: 'Luis', bought_by: 'Ana' },
      { household_id: 'h2', added_by: 'Mar', bought_by: null },
    ];

    const map = buildParticipantsMap(products);

    expect(new Set(map.get('h1'))).toEqual(new Set(['Ana', 'Luis']));
    expect(map.get('h2')).toEqual(['Mar']);
  });

  it('ignora valores nulos de bought_by', () => {
    const products = [{ household_id: 'h1', added_by: 'Ana', bought_by: null }];
    const map = buildParticipantsMap(products);
    expect(map.get('h1')).toEqual(['Ana']);
  });
});

describe('formatParticipants (BR-28)', () => {
  it('muestra todos los nombres si son 3 o menos', () => {
    expect(formatParticipants(['Ana', 'Luis'])).toBe('Ana, Luis');
  });

  it('trunca a 3 nombres y añade el contador si hay más', () => {
    expect(formatParticipants(['Ana', 'Luis', 'Mar', 'Eva', 'Tom'])).toBe('Ana, Luis, Mar y 2 más');
  });
});
