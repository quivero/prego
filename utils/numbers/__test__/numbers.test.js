import {
    primeFactors,
} from '../numbers.js'

describe('numbers', () => {
    it('should return number decimal part', () => {
      expect(primeFactors(100)).toEqual(
        {
          '2': 2,
          '5': 2,
        }
      );

      expect(primeFactors(1000)).toEqual(
        {
          '2': 3,
          '5': 3,
        }
      );

      expect(primeFactors(10000)).toEqual(
        {
          '2': 4,
          '5': 4,
        }
      );
    });
});