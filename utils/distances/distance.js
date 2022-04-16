import _ from 'lodash';
import {
  decimalPart,
} from '../math/math.js';

/**
 * @abstract n-norm of a number
 *
 * @param {Array} arr
 * @param {Number} n
 * @return {Number}
 */
export const nNorm = (arr, n) => arr.reduce(
  (dist, elem) => dist + Math.abs(elem) ** n,
  0,
) ** (1 / n);

/**
 * @abstract
 *
 * @param {Array} coordinate_1
 * @param {Array} coordinate_2
 * @param {Number} n
 * @return {Number}
 */
export const nNormDistance = (coordinate_1, coordinate_2, n) => {
  if (n < 1) {
    throw Error('The exponent n must be a number greater or equal to 1!');
  }
  
  const coord_diffs = _.zip(coordinate_1, coordinate_2).map(
    (coord_tuple) => Math.abs(coord_tuple[1] - coord_tuple[0]),
  );

  if (n === Infinity) {
    return Math.max(...coord_diffs);
  }

  return nNorm(coord_diffs, n);
};
