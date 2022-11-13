import GraphVertex from "../graph/GraphVertex.js";
import { zip } from "../../utils/arrays/arrays.js";

export default class MeshVertex extends GraphVertex {
  /**
   * @param {string} label
   */
  constructor(label, coordinates) {
    super(label);

    this.coordinates = coordinates;
  }

  /**
   * @param {string} label
   */
  getKey() {
    return this.label;
  }

  /**
   * @param {string} label
   */
  toString() {
    return this.label;
  }
}

/**
 * @param {string} labels
 * @param {*[]} coordinates
 */
export const createMVertices = (labels, coordinates) =>
  zip(labels, coordinates).map(
    (label_coordinate) =>
      new MeshVertex(label_coordinate[0], label_coordinate[1])
  );
