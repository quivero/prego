import {
  primeFactors,
  isPrime,
  radianToDegree,
  degreeToRadian,
  hav,
  geographicalToSpherical,
} from "../numbers.js";

import { throwError } from "../../sys/sys.js";

jest.mock("../../sys/sys");

describe("numbers", () => {
  it("should return number decimal part", () => {
    expect(primeFactors(1)).toEqual({
      1: 1,
    });

    expect(primeFactors(10)).toEqual({
      2: 1,
      5: 1,
    });

    expect(primeFactors(100)).toEqual({
      2: 2,
      5: 2,
    });

    expect(primeFactors(1000)).toEqual({
      2: 3,
      5: 3,
    });

    expect(primeFactors(10000)).toEqual({
      2: 4,
      5: 4,
    });
  });

  it("should return converted radian to degree", () => {
    expect(radianToDegree(Math.PI)).toBe(180);
  });

  it("should return converted degree to radian", () => {
    expect(degreeToRadian(180)).toBe(Math.PI);
  });

  it("should convert geographical to spherical coordinates", () => {
    expect(geographicalToSpherical(0, 0)).toStrictEqual([Math.PI / 2, 0]);
  });

  it("should return haversine values", () => {
    expect(hav(Math.PI)).toBeCloseTo(1);
    expect(hav(2 * Math.PI)).toBeCloseTo(0);
  });

  it("should throw error for entry with decimal part on function primeFactors", () => {
    primeFactors(42.42);

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw error for entry with inappropriate entry on function primeFactors", () => {
    primeFactors("42");

    expect(throwError).toHaveBeenCalled();
  });

  it("should return true/false for prime/non-prime number ", () => {
    expect(isPrime(7)).toEqual(true);
    expect(isPrime(8)).toEqual(false);
  });

  it("should throw error for inappropriate entry on function isPrime", () => {
    isPrime("42");

    expect(throwError).toHaveBeenCalled();
  });

  it("should return true for prime number and false for ", () => {
    expect(isPrime(7)).toEqual(true);
    expect(isPrime(8)).toEqual(false);
  });

  it("should throw error for negative number", () => {
    primeFactors(-1);
    expect(throwError).toHaveBeenCalled();
  });

  it("should throw error for non-natural number", () => {
    primeFactors(4.2);

    expect(throwError).toHaveBeenCalled();
  });
});
