import _ from "lodash";

import { hav } from "../numbers/numbers.js";
import { vecArg, sphericalToCartesian } from "../math/math.js";
import { throwError } from "../sys/sys.js";

/**
 * @abstract n-norm of a number
 *
 * @param {Array} arr
 * @param {Number} n
 * @return {Number}
 */
export const nNorm = (arr, n) =>
  arr.reduce((dist, elem) => dist + Math.abs(elem) ** n, 0) ** (1 / n);

/**
 * @abstract returns the n-norm of a vector
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {Number} n
 * @return {Number}
 */
export const nNormDistance = (coordinate_1, coordinate_2, n) => {
  if (n < 1) {
    throwError("The exponent n must be a number greater or equal to 1!");
    return;
  }

  const coord_diffs = _.zip(coordinate_1, coordinate_2).map((coord_tuple) =>
    Math.abs(coord_tuple[1] - coord_tuple[0])
  );

  if (n === Infinity) {
    return Math.max(...coord_diffs);
  }

  return nNorm(coord_diffs, n);
};

/**
 * @abstract returns the central angle between two coordinate points on a sphere
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {Number} n
 * @return {Number}
 */
export const sphereCentralAngle = (coordinate_1, coordinate_2) => {
  const longitude_1 = coordinate_1[0];
  const longitude_2 = coordinate_2[0];

  const latitude_1 = coordinate_1[1];
  const latitude_2 = coordinate_2[1];

  const aux_1 = 1 - hav(latitude_1 - latitude_2) - hav(latitude_1 + latitude_2);
  const aux_2 = hav(longitude_2 - longitude_1);
  const aux_3 = hav(latitude_2 - latitude_1);

  const hav_theta = aux_3 + aux_2 * aux_1;

  return 2 * Math.asin(Math.sqrt(hav_theta));
};

/**
 * @abstract returns the distance of two points on a sphere
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {Number} n
 * @return {Number}
 */
export const greatCircleDistance = (coordinate_1, coordinate_2, R) =>
  R * sphereCentralAngle(coordinate_1, coordinate_2);

/**
 * @abstract returns the distance of two points on a sphere
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {Number} n
 * @return {Number}
 */
export const nSphereDistance = (coordinate_1, coordinate_2, R) => {
  return (
    R *
    vecArg(
      sphericalToCartesian(coordinate_1, R),
      sphericalToCartesian(coordinate_2, R),
      2
    )
  );
};
