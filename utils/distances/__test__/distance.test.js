import {
  nNormDistance,
  nNorm,
  sphereCentralAngle,
  greatCircleDistance,
  nSphereDistance,
  distance,
} from "../distance.js";

import { isSpherical } from "../../math/math.js";
import { throwError } from "../../sys/sys.js";

jest.mock("../../sys/sys");

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
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    return nNormDistance(coord_1, coord_2, -1);

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw exception for negative n", () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    nNormDistance(coord_1, coord_2, -1);

    expect(throwError).toHaveBeenCalled();
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

  it("should return distance between coordinates according to method sphere", () => {
    const coord_1 = [0, 0];
    const coord_2 = [Math.PI / 2, 0];

    expect(
      distance(coord_1, coord_2, { method: "sphere", radius: 1 })
    ).toBeCloseTo((2 * Math.PI) / 4);
  });

  it("should throw exception for missing radius", () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    distance(coord_1, coord_2, { method: "sphere" });

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw exception for missing radius", () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    distance(coord_1, coord_2, { method: "sphere" });

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw exception for 1-dimensional coordinates", () => {
    const coord_1 = [0];
    const coord_2 = [1];

    distance(coord_1, coord_2, { method: "sphere", radius: 1 });

    expect(throwError).toHaveBeenCalled();
  });

  it("should return distance between coordinates according to method sphere", () => {
    const coord_1 = [0, 0];
    const coord_2 = [Math.PI / 2, 0];

    expect(
      distance(coord_1, coord_2, { method: "sphere", radius: 1 })
    ).toBeCloseTo((2 * Math.PI) / 4);
  });

  it("should return distance between coordinates according to method n_norm", () => {
    const coord_1 = [1, 1];
    const coord_2 = [2, 2];

    expect(
      distance(coord_1, coord_2, { method: "n_norm", exponent: 1 })
    ).toBeCloseTo(2);

    expect(
      distance(coord_1, coord_2, { method: "n_norm", exponent: 2 })
    ).toBeCloseTo(Math.sqrt(2));
  });

  it("should return greatest absolute difference for infinity norm", () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    expect(
      distance(coord_1, coord_2, { method: "n_norm", exponent: Infinity })
    ).toBeCloseTo(3);
  });

  it("should throw exception for empty configuration dict", () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    distance(coord_1, coord_2, {});

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw exception for empty configuration dict", () => {
    const coord_1 = [0, 0];
    const coord_2 = [0, 2];

    distance(coord_1, coord_2, {});

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw exception for missing exponent", () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    distance(coord_1, coord_2, { method: "n_norm" });

    expect(throwError).toHaveBeenCalled();
  });

  it("should throw exception for missing exponent", () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    distance(coord_1, coord_2, { method: undefined });

    expect(throwError).toHaveBeenCalled();
  });
});
