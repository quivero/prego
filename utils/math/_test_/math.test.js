import {
  decimalPart,
  xor
} from '../math.js'

describe('combinatorics', () => {
    it('should return number decimal part', () => {
      expect(decimalPart(4.2)).toBeCloseTo(0.2);
    });

    it('should return 0 to integer decimal part', () => {
        expect(decimalPart(4)).toBeCloseTo(0);
    });

    it('should return xor table of truth', () => {
        expect(xor(0, 0)).toEqual(0);
        expect(xor(1, 1)).toEqual(0);
        expect(xor(0, 1)).toEqual(1);
        expect(xor(1, 0)).toEqual(1);
    });
  });