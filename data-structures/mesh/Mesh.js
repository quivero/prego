import Graph from "../graph/Graph";
import MeshVertex from "./MeshVertex";

export default class Mesh extends Graph {
  #metric;

  /**
   * @param {boolean} isDirected
   */
  constructor(distance_function, is_relaxed = false, isDirected = false) {
    super(isDirected);

    this.distance_function = distance_function;

    if (!is_relaxed) {
      this.metric_function = distance_function;
    }
  }

  distance(vertex_1_key, vertex_2_key) {
    return this.distance_function(
      this.vertices[vertex_1_key].coordinates,
      this.vertices[vertex_2_key].coordinates
    );
  }

  getPathLength(path) {
    const indices_to_keys = this.getVerticesIndicestoKeys();
    let path_length = 0;

    path.forEach((vertex_index, index) => {
      if (index !== 0) {
        path_length += this.distance(
          indices_to_keys[path[index - 1]],
          indices_to_keys[vertex_index]
        );
      }
    });

    return path_length;
  }
}
