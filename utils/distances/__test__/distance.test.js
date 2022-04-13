import {
  nNormDistanceFn,
} from '../distance.js';

describe('distance', () => {
  it('should return n norm of two tuple coordinates', () => {
    const coord_1 = [1, 1];
    const coord_2 = [2, 2];

    expect(
      nNormDistanceFn(coord_1, coord_2, 1),
    ).toBe(2);

    expect(
      nNormDistanceFn(coord_1, coord_2, 2),
    ).toBe(Math.sqrt(2));
  });
});
