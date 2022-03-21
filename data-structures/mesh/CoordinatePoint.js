export default class CoordinatePoint {
  /**
   * @param {boolean} isDirected
   */
  constructor(label, coordinates) {
    this.label = label;
    this.coordinates = coordinate;
  }

  toString() {
    return this.label;
  }
}
