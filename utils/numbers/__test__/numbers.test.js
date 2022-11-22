import { primeFactors, isPrime } from "../numbers.js";

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

  it("should return true/false for prime/non-prime number ", () => {
    expect(isPrime(7)).toEqual(true);
    expect(isPrime(8)).toEqual(false);
  });

  it("should throw error for unappropriate entry", () => {
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
