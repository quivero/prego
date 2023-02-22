import _ from "lodash";

import { hav, vecArg, sphericalToCartesian, isSpherical } from "#math/numbers/numbers.js";
import { objectHasKey } from "#algorithms/objects/objects.js";

import { throwError } from "#algorithms/sys/sys.js";
import { log } from "#algorithms/logging/logger.js";

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

/**
 * @abstract returns the distance of two points based on
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {String} method
 * @param {Object} methodConfig
 * @return {Number}
 */
export const distance = (coordinate_1, coordinate_2, method, methodConfig) => {
  let notification_message =
    "There must exist property '_placeholder_' on config argument 'methodConfig'!";

  switch (method) {
    case "n_norm":
      let exponent;

      if (!objectHasKey(methodConfig, "exponent")) {
        log("warn", notification_message.replace("_placeholder_", "radius"));
        exponent = 2;
      } else {
        exponent = methodConfig.exponent;
      }

      return nNormDistance(coordinate_1, coordinate_2, exponent);

    case "sphere":
      const are_coords_spherical =
        !isSpherical(coordinate_1) || !isSpherical(coordinate_2);

      return !objectHasKey(methodConfig, "radius")
        ? throwError(notification_message.replace("_placeholder_", "radius"))
        : are_coords_spherical
        ? throwError("Provided coordinates are not spherical!")
        : nSphereDistance(coordinate_1, coordinate_2, methodConfig.radius);

    default:
      throwError("There are only available methods: ['n_norm', 'sphere']");
      return 1;
  }
};

/**
 * @abstract returns the distance of two points based on
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {String} method
 * @param {Object} methodConfig
 * @return {Number}
 */
export const travelTime = (
  average_speed,
  coordinate_1,
  coordinate_2,
  method,
  methodConfig
) => {
  return (
    distance(coordinate_1, coordinate_2, method, methodConfig) / average_speed
  );
};
