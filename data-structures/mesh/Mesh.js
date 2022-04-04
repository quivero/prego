import Graph from '../graph/Graph';
import MeshVertex from './MeshVertex';

export default class Mesh extends Graph {
  #metric;

  /**
   * @param {boolean} isDirected
   */
  constructor(metric_function, is_relaxed = false, isDirected = false) {
    super(isDirected);

    this.metric_function = metric_function;

    if (!is_relaxed) {
      if (this.metricIsValid()) {
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

  metricIsValid() {
    // TAKE NOTE: This validation is weak. Either random generator or a user-provided validator function
    // may suit better than it
    const P0 = new MeshVertex('P0', [0, 0]);
    const P1 = new MeshVertex('P1', [0, 1]);
    const P2 = new MeshVertex('P2', [1, 0]);

    const is_positive = this.metric_function(P1, P1) === 0;
    const is_symmetric = this.metric_function(P0, P1) === this.metric_function(P1, P0);
    const is_triangular = this.metric_function(P0, P2) <= this.metric_function(P0, P1) + this.metric_function(P1, P2);

    return is_positive && is_symmetric && is_triangular;
  }

  distance(vertex_1_key, vertex_2_key) {
    return this.metric_function(this.vertices[vertex_1_key], this.vertices[vertex_2_key]);
  }

  getPathLength(path) {
    const indices_to_keys = this.getVerticesIndicestoKeys();
    let path_length = 0;

    path.forEach(
      (vertex_index, index) => {
        if (index !== 0) {
          path_length += this.distance(
            indices_to_keys[path[index - 1]],
            indices_to_keys[vertex_index],
          );
        }
      },
    );

    return path_length;
  }
}
