import GraphVertex from '../graph/GraphVertex.js';
import CoordinatePoint from './CoordinatePoint.js';

export default class GraphicMeshVertex extends CoordinatePoint {
  /**
     * @param {string} label
     */
  constructor(label, coordinate) {
    super(label, coordinate);
    this.vertex = new GraphVertex(label);
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
