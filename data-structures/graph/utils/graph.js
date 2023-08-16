import 'lodash.combinations';
import _ from 'lodash';

import GraphVertex from '../GraphVertex.js';
import GraphEdge from '../GraphEdge.js';
import Graph from '../Graph.js';

import { objectInit, objectMap } from '#algorithms/objects/objects';

export const createVertices = (labels) => {
  const vertices = [];

  const vertex_gen = (label) => {
    const vertex = new GraphVertex(label);
    vertices.push(vertex);
  };

  labels.forEach(vertex_gen);

  return vertices;
};

export const createEdges = (vertices_tuples) => {
  const edges = [];

  const edge_gen = (vertices_tuple) => {
    const edge = new GraphEdge(vertices_tuple[0], vertices_tuple[1]);
    edges.push(edge);
  };

  vertices_tuples.forEach(edge_gen);

  return edges;
};

export const resetVertices = (vertices) =>
  vertices.map((vertex) => vertex.deleteAllEdges());

export const createEdgesFromVerticesValues = (vertices_values_tuples) => {
  const vertex_id_to_obj = objectMap(
    objectInit(_.uniq(_.flatten(vertices_values_tuples)), {}),
    (vertex_key, obj) => new GraphVertex(vertex_key)
  );

  const edge_value_to_id_mapper = (vertices_values_tuple) => [
    vertex_id_to_obj[vertices_values_tuple[0]],
    vertex_id_to_obj[vertices_values_tuple[1]],
  ];

  return createEdges(vertices_values_tuples.map(edge_value_to_id_mapper));
};

export const createCompleteUndirectedGraph = (vertices_keys) => {
  const graph = new Graph(false);

  graph.addEdges(
    createEdgesFromVerticesValues(_.combinations(vertices_keys, 2))
  );

  return graph;
};
