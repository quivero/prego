import GraphVertex from '../GraphVertex.js'
import GraphEdge from '../GraphEdge.js'
import Graph from '../Graph.js'

import { 
  objectInit,
  objectMap,
 } from '../../../utils/objects/objects.js';

import 'lodash.combinations';
import _ from 'lodash';

export const createVertices = (labels) => {
    const vertices = [];
  
    labels.forEach((label) => {
      const vertex = new GraphVertex(label);
      vertices.push(vertex);
    });
  
    return vertices;
  };

export const createEdges = (vertices_tuples) => {
    const edges = [];
  
    vertices_tuples.forEach((vertices_tuple) => {
      const edge = new GraphEdge(vertices_tuple[0], vertices_tuple[1]);
      edges.push(edge);
    });
  
    return edges;
  };

  export const createEdgesFromVerticesValues = (vertices_values_tuples) => {
    const vertex_id_to_obj = objectMap(
      objectInit(
        _.uniq(_.flatten(vertices_values_tuples)),
        {}
      ),
      (vertex_key, obj) => {
        return new GraphVertex(vertex_key)
      }
    )
    
    return createEdges(
      vertices_values_tuples.map(
        (vertices_values_tuple) => {
          return [
            vertex_id_to_obj[vertices_values_tuple[0]],
            vertex_id_to_obj[vertices_values_tuple[1]]
          ]
        })
    )
  };

  export const createCompleteUndirectedGraph = (vertices_keys) => {
    const graph = new Graph(false)
    
    graph.addEdges(createEdgesFromVerticesValues(_.combinations(vertices_keys, 2)))

    return graph
  }