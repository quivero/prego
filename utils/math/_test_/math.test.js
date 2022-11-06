import { decimalPart, xor, sphericalToCartesian, abRandom } from "../math.js";

import { nNorm } from "../../distances/distance.js";

describe("combinatorics", () => {
  it("should return number decimal part", () => {
    expect(decimalPart(4.2)).toBeCloseTo(0.2);
  });

  it("should throw for unordered entries", () => {
    function unorderedInputs() {
      return abRandom(2, 1);
    }

    expect(unorderedInputs).toThrowError();
  });

  it("should return a value between 1 and 2", () => {
    expect(Math.floor(abRandom(1, 2))).toBe(1);
    expect(Math.ceil(abRandom(1, 2))).toBe(2);
  });

  it("should return 0 to integer decimal part", () => {
    expect(decimalPart(4)).toBeCloseTo(0);
  });

  it("should return xor table of truth", () => {
    expect(xor(0, 0)).toEqual(false);
    expect(xor(1, 1)).toEqual(false);
    expect(xor(0, 1)).toEqual(true);
    expect(xor(1, 0)).toEqual(true);
  });

  it("should throw error for xor with non 0/1 input", () => {
    function non01XorInput() {
      return xor(0, 2);
    }

    expect(non01XorInput).toThrow();
  });

  it("should return cartesian coordinates", () => {
    expect(nNorm(sphericalToCartesian([0, 0], 1), 2)).toBeCloseTo(1);

    expect(nNorm(sphericalToCartesian([Math.PI / 2, 0], 1), 2)).toBeCloseTo(1);

    expect(
      nNorm(sphericalToCartesian([Math.PI / 2, Math.PI / 2], 1), 2)
    ).toBeCloseTo(1);
  });
});
