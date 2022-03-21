import Graph from '../Graph/graph.js';

export default class GraphicMesh extends Graph {
  #distance_function;

  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false, distance_function) {
    super(isDirected);
    this.coordinates = {};
    this.distance_function = distance_function;
  }

  /**
   * @param {GraphicMeshVertex}
   */
  addGVertex(gvertex) {
    super.addVertex(gvertex.vertex);
    this.coordinates[gvertex.label] = this.coordinates;
  }

  distance(gvertex_1, gvertex_2) {
    return this.distance_function(gvertex_1, gvertex_2);
  }

  getPathLength(path) {
    return path.reduce((vertex_i, vertex_i_p_1) => this.distance_function(vertex_i, vertex_i_p_1), 0);
  }
}
