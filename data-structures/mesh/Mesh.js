import Graph from '../Graph/graph.js';
import CoordinatePoint from 'CoordinatePoint.js';

export default class Mesh extends Graph {
  #metric;

  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false, metric_function, is_relaxed) {
    super(isDirected);
    this.coordinates = {};

    function metricIsValid(metric_function) {
      let P0 = new CoordinatePoint('P0', [0, 0]);
      let P1 = new CoordinatePoint('P1', [0, 1]);
      let P2 = new CoordinatePoint('P2', [1, 0]);

      return metric_function(P0, P0) === 0 &&
             metric_function(P0, P1) === metric_function(P1, P0) &&
             metric_function(P0, P2) <= metric_function(P0, P1) + metric_function(P1, P2)
    }

    if(!is_relaxed && metricIsValid(metric_function)) {
      this.metric_function = metric_function;  
    } else {
      throw Error('Metric function is not valid. It must: \n 1. Be greater than ');
    }
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
