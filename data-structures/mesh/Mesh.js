import Graph from "../graph/Graph";

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
    const coordinates_1 = this.vertices[vertex_1_key].coordinates;
    const coordinates_2 = this.vertices[vertex_2_key].coordinates

    return this.distance_function(coordinates_1, coordinates_2);
  }

  getPathLength(path) {
    const indices_to_keys = this.getVerticesIndicestoKeys();
    let path_length = 0;

    path.forEach((vertex_index, index) => {
      if (index !== 0) {
        path_length += this.distance(
          indices_to_keys[path[index - 1]], indices_to_keys[vertex_index]
        );
      }
    });

    return path_length;
  }
}
