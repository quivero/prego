export default class CoordinatePoint {
  /**
   * @param {boolean} isDirected
   */
  constructor(label) {
    this.label = label;
    this.coordinate = [];
  }

  toString() {
    return this.label;
  }
}
