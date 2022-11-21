import {
  nNormDistance,
  nNorm,
  sphereCentralAngle,
  greatCircleDistance,
  nSphereDistance,
} from "../distance.js";

describe("distance", () => {
  it("should return n norm of two tuple coordinates", () => {
    const coord_1 = [1, 1];
    const coord_2 = [2, 2];

    expect(nNormDistance(coord_1, coord_2, 1)).toBe(2);

    expect(nNormDistance(coord_1, coord_2, 2)).toBe(Math.sqrt(2));
  });

  it("should return greatest absolute difference for infinity norm", () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    expect(nNormDistance(coord_1, coord_2, Infinity)).toBe(3);
  });

  it("should return n-norm of a number array", () => {
    const coords = [1, 1, 1, 1, 1];

    expect(nNorm(coords, 2)).toBeCloseTo(Math.sqrt(5));
  });

  it("should throw exception for negative n", () => {
    function negativeExponent() {
      const coord_1 = [1, -1];
      const coord_2 = [2, 2];

      return nNormDistance(coord_1, coord_2, -1);
    }

    expect(negativeExponent).toThrow();
  });

  it("should throw exception for negative n", () => {
    function negativeExponent() {
      const coord_1 = [1, -1];
      const coord_2 = [2, 2];

      return nNormDistanceFn(coord_1, coord_2, -1);
    }

    expect(negativeExponent).toThrowError();
  });

  it("should return distance between two coordinates on a sphere", () => {
    const coord_1 = [0, 0];
    const coord_2 = [0, Math.PI / 2];
    const coord_3 = [Math.PI / 2, 0];
    const radius = 1;

    expect(greatCircleDistance(coord_1, coord_2, radius)).toBeCloseTo(
      Math.PI / 2
    );

    expect(greatCircleDistance(coord_1, coord_3, radius)).toBeCloseTo(
      Math.PI / 2
    );

    expect(greatCircleDistance(coord_2, coord_3, radius)).toBeCloseTo(
      Math.PI / 2
    );
  });

  it("should return distance on a ", () => {
    const coord_1 = [0, 0];
    const coord_2 = [Math.PI / 2, 0];
    const coord_3 = [Math.PI, 0];
    const radius = 1;

    expect(nSphereDistance(coord_1, coord_2, radius)).toBeCloseTo(
      (2 * Math.PI * radius) / 4
    );

    expect(nSphereDistance(coord_1, coord_3, radius)).toBeCloseTo(
      (2 * Math.PI * radius) / 2
    );

    expect(nSphereDistance(coord_2, coord_3, radius)).toBeCloseTo(
      (2 * Math.PI * radius) / 4
    );
  });
});
