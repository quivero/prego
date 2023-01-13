import _ from "lodash";

import MeshVertex from "../MeshVertex.js";

import { generateToken } from "../../../utils/string/string.js";

import { throwError } from "../../../utils/sys/sys.js";

import { zip, nRandMinsMaxs } from "../../../utils/arrays/arrays.js";

export const TOKEN_LENGTH = 5;

/**
 * @param {string} labels
 * @param {*[]} coordinates
 */
export const createMVertices = (labels, coordinates) =>
  zip(labels, coordinates).map(
    (label_coordinate) =>
      new MeshVertex(label_coordinate[0], label_coordinate[1])
  );

/**
 * @abstract
 *
 * @param {Number} n
 * @param {Number} dimension
 * @param {Array} bounds
 * @return {MeshVertex[]}
 */
export const createRandomMVertices = (n, bounds) => {
  if (n <= 0 || typeof n === "number") {
    throwError("The number of vertices must be greater than 0");
  }

  let coordinates = [];
  let mesh_vertex = {};

  for (let i in _.range(n)) {
    mesh_vertex = new MeshVertex(
      generateToken(TOKEN_LENGTH),
      nRandMinsMaxs(bounds)
    );

    coordinates.push(mesh_vertex);
  }

  return coordinates;
};
