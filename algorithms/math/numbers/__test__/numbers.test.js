import _ from 'lodash';

import {
  primeFactors,
  isPrime,
  radianToDegree,
  degreeToRadian,
  hav,
  geographicalToSpherical,
  decimalPart,
  xor,
  sphericalToCartesian,
  isSpherical,
  abRandom,
  dot,
  vecArg,
} from '../numbers.js';

import { throwError } from '#algorithms/sys/sys.js';

import { nNorm } from '#math/distances/distance.js';

jest.mock('#algorithms/sys/sys');

describe('numbers', () => {
  it.each([
    [ primeFactors(1), { 1: 1 } ],
    [ primeFactors(10), { 2: 1, 5: 1, } ],
    [ primeFactors(100), { 2: 2, 5: 2, } ],
    [ primeFactors(1000), { 2: 3, 5: 3, } ],
    [ primeFactors(10000), { 2: 4, 5: 4, } ],
  ])(
    'should return number decimal part',
    (result, expectation) => expect(result).toEqual(expectation)
  );

  it('should return converted radian to degree', () => {
    expect(radianToDegree(Math.PI)).toBe(180);
  });

  it('should return converted degree to radian', () => {
    expect(degreeToRadian(180)).toBe(Math.PI);
  });

  it('should convert geographical to spherical coordinates', () => {
    expect(geographicalToSpherical(0, 0)).toStrictEqual([Math.PI / 2, 0]);
  });

  it('should return haversine values', () => {
    expect(hav(Math.PI)).toBeCloseTo(1);
    expect(hav(2 * Math.PI)).toBeCloseTo(0);
  });

  it('should throw error for entry with decimal part on function primeFactors', () => {
    primeFactors(42.42);

    expect(throwError).toHaveBeenCalled();
  });

  it('should throw error for entry with inappropriate entry on function primeFactors', () => {
    primeFactors('42');

    expect(throwError).toHaveBeenCalled();
  });

  it('should return true/false for prime/non-prime number ', () => {
    expect(isPrime(7)).toEqual(true);
    expect(isPrime(8)).toEqual(false);
  });

  it('should throw error for inappropriate entry on function isPrime', () => {
    isPrime('42');

    expect(throwError).toHaveBeenCalled();
  });

  it('should return true for prime number and false for ', () => {
    expect(isPrime(7)).toEqual(true);
    expect(isPrime(8)).toEqual(false);
  });

  it('should throw error for negative number', () => {
    primeFactors(-1);
    expect(throwError).toHaveBeenCalled();
  });

  it('should throw error for non-natural number', () => {
    primeFactors(4.2);

    expect(throwError).toHaveBeenCalled();
  });
});

describe('math', () => {
  it('should return number decimal part', () => {
    expect(decimalPart(4.2)).toBeCloseTo(0.2);
  });

  it('should throw for unordered entries', () => {
    abRandom(2, 1);
    expect(throwError).toHaveBeenCalled();
  });

  it('should return a value between 1 and 2', () => {
    expect(Math.floor(abRandom(1, 2))).toBe(1);
    expect(Math.ceil(abRandom(1, 2))).toBe(2);
  });

  it('should return 0 to integer decimal part', () => {
    expect(decimalPart(4)).toBeCloseTo(0);
  });

  it('should return xor table of truth', () => {
    expect(xor(0, 0)).toEqual(false);
    expect(xor(1, 1)).toEqual(false);
    expect(xor(0, 1)).toEqual(true);
    expect(xor(1, 0)).toEqual(true);
  });

  it('should throw error for xor with non 0/1 input', () => {
    xor(0, 2);
    expect(throwError).toHaveBeenCalled();
  });

  it('should return cartesian coordinates', () => {
    expect(nNorm(sphericalToCartesian([0, 0], 1), 2)).toBeCloseTo(1);

    expect(nNorm(sphericalToCartesian([Math.PI / 2, 0], 1), 2)).toBeCloseTo(1);

    expect(
      nNorm(sphericalToCartesian([Math.PI / 2, Math.PI / 2], 1), 2)
    ).toBeCloseTo(1);
  });

  it('should return dot product between vectors', () => {
    expect(dot([1, 0, 0], [0, 1, 0])).toBe(0);
    expect(dot([1, 0, 0], [1, 0, 0])).toBe(1);
    expect(dot([1, 1, 1], [1, 1, 1])).toBe(3);
  });

  it('should return dot product between vectors', () => {
    expect(vecArg([1, 0, 0], [0, 0, 1], 2)).toBe(Math.PI / 2);
  });

  it('should return dot product between vectors', () => {
    expect(vecArg([1, 0, 0], [0, 0, 1], 2)).toBe(Math.PI / 2);
  });

  it('should return dot product between vectors', () => {
    expect(vecArg([1, 0, 0], [1, 1, 0], 2)).toBeCloseTo(Math.PI / 4);
  });

  it('should return false examples of spherical coordinates', () => {
    expect(isSpherical([])).toBe(false);
    expect(isSpherical([42])).toBe(false);

    expect(isSpherical([-Math.PI - 0.001, 0])).toBe(false);
    expect(isSpherical([Math.PI + 0.001, 0])).toBe(false);

    expect(isSpherical([0, -0.001])).toBe(false);
    expect(isSpherical([0, 2 * Math.PI + 0.001])).toBe(false);
  });

  it('should verify spherical arguments', () => {
    let phis_1 = _.range(-3, 3, (2 * Math.PI) / 8);
    let phis_2 = _.range(0, 6, (2 * Math.PI) / 8);

    for (let coord_1 of phis_1) {
      for (let coord_2 of phis_2) {
        expect(isSpherical([coord_1, coord_2])).toBe(true);
      }
    }
  });
});
