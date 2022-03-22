import GraphVertex from '../graph/GraphVertex.js';

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
 * @param {string} label
 * @param {*[]} coordinate
 */
export const createGVertex = (label, coordinate) => new GraphicMeshVertex(label, coordinate);

/**
 * @param {string} labels
 * @param {*[]} coordinates
 */
export const createGVertices = (labels, coordinates) => zip(labels, coordinates).map((label_coordinate) => new GraphicMeshVertex(label_coordinate[0], label_coordinate[1]));
