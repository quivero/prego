import Graph from '../graph/Graph';

export default class Mesh extends Graph {
  #metric;

  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false, metric_function, is_relaxed) {
    super(isDirected);
    this.coordinates = {};

    function metricIsValid(metric_function) {
      // TAKE NOTE: This validation is weak. A random generator may suit better than it 
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
      const statement = 'Metric function is not valid. It must obey :';
      const condition_1 =  '1. Value 0 between identical vertices;';
      const condition_2 =  '2. Symmetrical;';
      const condition_3 =  '3. Triangular inequality';
      
      throw Error(statement+'\n'+condition_1+'\n'+condition_2+'\n'+condition_3);
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
