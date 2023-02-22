import { zip } from "lodash";

import MeshVertex from "../MeshVertex.js";

import { generateToken } from "#utils/string/string.js";

import { throwError } from "#utils/sys/sys.js";

import { nRandMinsMaxs, zeros } from "#utils/arrays/arrays.js";

export const TOKEN_LENGTH = 5;

/**
 * @param {string} labels
 * @param {*[]} coordinates
 */
export const createMVertices = (labels, coordinates) => {
  let label, coordinate;   
  
  return zip(labels, coordinates).map(
    (label_coordinate) => {
      label = label_coordinate[0];
      coordinate = label_coordinate[1];
      
      return new MeshVertex(label, coordinate);
    }
  );
}

/**
 * @abstract
 *
 * @param {Number} n
 * @param {Number} dimension
 * @param {Array} bounds
 * @return {MeshVertex[]}
 */
export const createRandomMVertices = (n, bounds) => {
  if (n <= 0 || typeof n !== "number") {
    throwError("The number of vertices must be greater than 0");
  } else {
    return zeros(n).map(
      (zero) => new MeshVertex(generateToken(TOKEN_LENGTH), nRandMinsMaxs(bounds))
    );
  }
};
