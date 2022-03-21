import GraphVertex from '../graph/GraphVertex.js';

export default class MeshVertex extends GraphVertex {
  /**
     * @param {string} label
     */
  constructor(label, coordinate) {
    super(label);
    this.coordinate = coordinate;
  }

  /**
     * @param {string} label
     */
  getKey() {
    return this.value;
  }

  /**
     * @param {string} label
     */
  toString() {
    return this.value;
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
