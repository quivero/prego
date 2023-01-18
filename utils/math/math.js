import { throwError } from "../sys/sys.js";
import { nNorm } from "../distances/distance.js";

/**
 * @abstract decimal part of a number
 *
 * @param {Number} number
 * @return {Number}
 */
export const decimalPart = (number) => number - Math.floor(number);

/**
 * @abstract xor operator
 *
 * @param {boolean} a
 * @param {boolean} b
 * @return {boolean}
 */
export const xor = (a, b) => {
  const condition = ![0, 1].includes(a) || ![0, 1].includes(b);

  return condition ?
    throwError("Variables a and b must be either boolean or numbers 0/1!") :
    Boolean(a * (1 - b) + b * (1 - a));

};

/**
 * @abstract xor operator
 *
 * @param {Number} min
 * @param {Number} b
 * @return {Number}
 */
export const abRandom = (min, max) => {
  if (min >= max) {
    throwError("The latter number must be greater than the former.");
  }

  return min + (max - min) * Math.random();
};

/**
 * @abstract transformation map of spherical to cartesian coordinates
 * The 3D representation order corresponds to (z, x, y)
 *
 * @param {boolean} a
 * @param {boolean} b
 * @return {boolean}
 */
export const sphericalToCartesian = (coords, R) => {
  const prodsin = (arr) =>
    arr.length === 0
      ? 1
      : arr.reduce((prod_, angle) => prod_ * Math.sin(angle), 1);

  const s2cRecur = (coords_, index) => {
    return prodsin(coords_.slice(0, index)) * Math.cos(coords_[index]);
  };

  const prev_coords = coords.slice(0, coords.length);
  const curr_coord = coords[coords.length - 1];

  return prev_coords
    .map((coord, index) => R * s2cRecur(prev_coords, index))
    .concat([R * prodsin(prev_coords) * Math.sin(curr_coord)]);
};

/**
 * @abstract an spherical coordinate of dimension n has:
 *  1. Dimension greater than 2;
 *  2. Entries from index:
 *    a. 0 to indexn-2 : between [-pi, pi];
 *    b. indexn-1      : between [0, 2 pi];
 *
 * @param {Array} u
 * @return {Boolean}
 */
export const isSpherical = (u) => {
  return !!(
    u.length >= 2 &&
    u
      .slice(0, u.length - 1)
      .reduce(
        (result, elem) => result && elem >= -Math.PI && elem <= Math.PI,
        true
      ) &&
    u
      .slice(u.length - 1, u.length)
      .reduce(
        (result, elem) => result && elem >= 0 && elem <= 2 * Math.PI,
        true
      )
  );
};

/**
 * @abstract dot product
 *
 * @param {Array} arr
 * @return {Number}
 */
export const dot = (a, b) =>
  a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);

/**
 * @abstract vector argument based on n-norm
 *
 * @param {Array} u
 * @param {Array} v
 * @param {Number} n
 * @return {Number}
 */
export const vecArg = (u, v, n) =>
  Math.acos(dot(u, v) / (nNorm(u, n) * nNorm(v, n)));
