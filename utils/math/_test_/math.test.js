import {
  decimalPart,
  xor,
  sphericalToCartesian,
  isSpherical,
  abRandom,
  dot,
  vecArg,
} from "../math.js";

import _ from "lodash";

import { nNorm } from "../../distances/distance.js";

import { throwError } from "../../sys/sys.js";

jest.mock("../../sys/sys");

describe("math", () => {
  it("should return number decimal part", () => {
    expect(decimalPart(4.2)).toBeCloseTo(0.2);
  });

  it("should throw for unordered entries", () => {
    abRandom(2, 1);
    expect(throwError).toHaveBeenCalled();
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
    xor(0, 2);
    expect(throwError).toHaveBeenCalled();
  });

  it("should return cartesian coordinates", () => {
    expect(nNorm(sphericalToCartesian([0, 0], 1), 2)).toBeCloseTo(1);

    expect(nNorm(sphericalToCartesian([Math.PI / 2, 0], 1), 2)).toBeCloseTo(1);

    expect(
      nNorm(sphericalToCartesian([Math.PI / 2, Math.PI / 2], 1), 2)
    ).toBeCloseTo(1);
  });

  it("should return dot product between vectors", () => {
    expect(dot([1, 0, 0], [0, 1, 0])).toBe(0);
    expect(dot([1, 0, 0], [1, 0, 0])).toBe(1);
    expect(dot([1, 1, 1], [1, 1, 1])).toBe(3);
  });

  it("should return dot product between vectors", () => {
    expect(vecArg([1, 0, 0], [0, 0, 1], 2)).toBe(Math.PI / 2);
  });

  it("should return dot product between vectors", () => {
    expect(vecArg([1, 0, 0], [0, 0, 1], 2)).toBe(Math.PI / 2);
  });

  it("should return dot product between vectors", () => {
    expect(vecArg([1, 0, 0], [1, 1, 0], 2)).toBeCloseTo(Math.PI / 4);
  });

  it("should return false examples of spherical coordinates", () => {
    expect(isSpherical([])).toBe(false);
    expect(isSpherical([42])).toBe(false);

    expect(isSpherical([-Math.PI - 0.001, 0])).toBe(false);
    expect(isSpherical([Math.PI + 0.001, 0])).toBe(false);

    expect(isSpherical([0, -0.001])).toBe(false);
    expect(isSpherical([0, 2 * Math.PI + 0.001])).toBe(false);
  });

  it("should return dot product between vectors", () => {
    let phis_1 = _.range(-3, 3, (2 * Math.PI) / 8);
    let phis_2 = _.range(0, 6, (2 * Math.PI) / 8);

    for (let coord_1 of phis_1) {
      for (let coord_2 of phis_2) {
        expect(isSpherical([phis_1[0], phis_2[0]])).toBe(true);
      }
    }
  });
});
