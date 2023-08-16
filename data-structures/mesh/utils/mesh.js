import { zip } from 'lodash';

import MeshVertex from '../MeshVertex.js';

import { generateToken } from '#algorithms/string/string.js';

import { throwError } from '#algorithms/sys/sys.js';

import { nRandMinsMaxs, zeros } from '#algorithms/arrays/arrays.js';

export const TOKEN_LENGTH = 5;

/**
 * @param {string} labels
 * @param {*[]} coordinates
 */
export const createMVertices = (labels, coordinates) => zip(labels, coordinates).map(
  ([label, coordinate]) => new MeshVertex(label, coordinate)
)

/**
 * @abstract
 *
 * @param {Number} n
 * @param {Number} dimension
 * @param {Array} bounds
 * @return {MeshVertex[]}
 */
export const createRandomMVertices = (n, bounds) => {
  if (n <= 0 || typeof n !== 'number') {
    throwError('The number of vertices must be greater than 0');
  } else {
    return zeros(n).map(
      (zero) => new MeshVertex(generateToken(TOKEN_LENGTH), nRandMinsMaxs(bounds))
    );
  }
};
