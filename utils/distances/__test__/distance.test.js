import {
  nNormDistance,
  nNorm,
} from '../distance.js';

describe('distance', () => {
  it('should return n norm of two tuple coordinates', () => {
    const coord_1 = [1, 1];
    const coord_2 = [2, 2];

    expect(
      nNormDistance(coord_1, coord_2, 1),
    ).toBe(2);

    expect(
      nNormDistance(coord_1, coord_2, 2),
    ).toBe(Math.sqrt(2));
  });

  it('should return greatest absolute difference for infinity norm', () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    expect(
      nNormDistance(coord_1, coord_2, Infinity),
    ).toBe(3);
  });

  it('should return n-norm of a number array', () => {
    const coords = [1, 1, 1, 1, 1];
  
    expect(nNorm(coords, 2)).toBeCloseTo(Math.sqrt(5));
  });

  it('should throw exception for negative n', () => {
    function negativeExponent() {
        const coord_1 = [1, -1];
        const coord_2 = [2, 2];
              
        return nNormDistanceFn(coord_1, coord_2, -1)
    }
    
    expect(negativeExponent).toThrow();
  });
  
});
