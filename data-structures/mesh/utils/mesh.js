import _ from "lodash";

import MeshVertex from "../MeshVertex.js";

import { objectInit, objectMap } from "../../../utils/objects/objects.js";

import { generateToken } from "../../../utils/string/string.js";

import { abRandom } from "../../../utils/math/math.js";

import { throwError } from "../../../utils/sys/sys.js";

/**
 * @abstract
 *
 * @param {Number} n
 * @param {Number} dimension
 * @param {Array} bounds
 * @return {MeshVertex[]}
 */
export const generateRandomMeshVertices = (n, dimension, bounds) => {
  if (n <= 0 || dimension <= 0) {
    throwError("The number of vertices and dimensions must be greater than 0");
  }

  if (bounds.length !== 2 || bounds[0] >= bounds[1]) {
    throwError(
      "Bound values must have length 2 and latter element greater than the former."
    );
  }

  let label = "";
  const length = 5;
  let coordinates = [];

  return _.range(n).map((element) => {
    label = generateToken(length);

    coordinates = _.range(dimension).map((index) =>
      abRandom(bounds[0], bounds[1])
    );

    return new MeshVertex(label, coordinates);
  });
};
