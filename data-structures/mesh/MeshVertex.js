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
