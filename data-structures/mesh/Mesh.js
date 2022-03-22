import Graph from '../graph/Graph';
import MeshVertex from '../mesh/MeshVertex';

export default class Mesh extends Graph {
  #metric;

  /**
   * @param {boolean} isDirected
   */
  constructor(metric_function, isDirected = false, is_relaxed = false) {
    super(isDirected);
    this.coordinates = {};

    function metricIsValid(metric_function) {
      // TAKE NOTE: This validation is weak. Either random generator or a user-provided validator function
      // may suit better than it
      const P0 = new MeshVertex('P0', [0, 0]);
      const P1 = new MeshVertex('P1', [0, 1]);
      const P2 = new MeshVertex('P2', [1, 0]);
      
      const is_positive = metric_function(P1, P1) === 0;
      const is_symmetric = metric_function(P0, P1) === metric_function(P1, P0);
      const is_triangular =  metric_function(P0, P2) <= metric_function(P0, P1) + metric_function(P1, P2);
            
      return is_positive && is_symmetric && is_triangular;
    }

    if (!is_relaxed) {
      if(metricIsValid(metric_function)) {
        this.metric_function = metric_function;
      } else {
        const statement = 'Metric function is not valid. It must obey :';
        const condition_1 = '1. Value 0 between identical vertices;';
        const condition_2 = '2. Symmetrical;';
        const condition_3 = '3. Triangular inequality';

        throw Error(`${statement}\n${condition_1}\n${condition_2}\n${condition_3}`);
      }
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
