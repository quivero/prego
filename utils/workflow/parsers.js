import Iter from 'es-iter';

import Graph from '../../data-structures/graph/Graph.js';
import GraphVertex from '../../data-structures/graph/GraphVertex.js';
import GraphEdge from '../../data-structures/graph/GraphEdge.js';
import { getUniques, getAllIndexes } from '../arrays/arrays.js';

export const parseBlueprintToGraph = (blueprint) => {
  const { nodes } = blueprint.blueprint_spec;
  const graph = new Graph(true);
  const vertices_dict = {};

  for (let i = 0; i < nodes.length; i++) {
    vertices_dict[nodes[i].id] = new GraphVertex(nodes[i].id);
  }

  const edges = [];

  // Iterate along array elements
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].next != null) {
      // Flow case
      if (typeof (nodes[i].next) === 'object') {
        const next_values = getUniques(Object.values(nodes[i].next));

        for (let j = 0; j < next_values.length; j++) {
          const edge = new GraphEdge(
            vertices_dict[nodes[i].id],
            vertices_dict[next_values[j]],
          );
          edges.push(edge);
        }
      } else {
      // Ordinary edge

        const edge = new GraphEdge(
          vertices_dict[nodes[i].id],
          vertices_dict[nodes[i].next],
        );
        edges.push(edge);
      }
    }
  }

  graph.addEdges(edges);

  return graph;
};

export const startAndFinishNodes = (blueprint) => {
  const { nodes } = blueprint.blueprint_spec;
  const startNodes = [];
  const finishNodes = [];

  for (const node of nodes) {
    if (node.type.toLowerCase() === 'start') {
      startNodes.push(node.id);
    }

    if (node.type.toLowerCase() === 'finish') {
      finishNodes.push(node.id);
    }
  }

  return {'start_nodes': [...startNodes], 'finish_nodes': [...finishNodes]}
}

export const nodeToLane = (blueprint) => {
  const { nodes } = blueprint.blueprint_spec;
  const node_to_lane = {};

  for (const node of nodes) {
    node_to_lane[node.id] = node.lane_id
  }

  return node_to_lane
}

export const nodeRouteToLaneRoute = (node_route,
                                     indexes_to_vertices,
                                     node_id_to_lane) => {
  let lane_route = [];

  for(let vertex_j of node_route){
    let lane_vertex_j = node_id_to_lane[indexes_to_vertices[vertex_j]];

    if(lane_route.length==0){
      lane_route.push(lane_vertex_j);

    } else {
      if(lane_route[lane_route.length-1] !== lane_vertex_j) {
        lane_route.push(lane_vertex_j);
      } else {
        continue;
      }
    }
  }

  return lane_route;
}

export const fromStartToFinishAcyclicPaths = (blueprint, start_key, finish_key) => {
  const bp_graph = parseBlueprintToGraph(blueprint);
  let indexes_to_vertices = bp_graph.getIndicesToVertices();
  let node_id_to_lane = nodeToLane(blueprint);

  const looseNodes = bp_graph.looseNodes();
  const orphanNodes = bp_graph.orphanNodes();
  const vertices_keys_to_indices = bp_graph.getVerticesIndices();

  const start_id = vertices_keys_to_indices[start_key];
  const finish_id = vertices_keys_to_indices[finish_key];

  if (getAllIndexes(orphanNodes, start_id).length === 0) {
    console.warn(`Vertex id ${start_id} is not a start node! Detected start nodes: ${orphanNodes}`);

    return [];
  }

  if (getAllIndexes(looseNodes, finish_id).length === 0) {
    console.warn(`Vertex id ${finish_id} is not a finish node! Detected finish nodes: ${looseNodes}`);

    return [];
  }

  const routes = bp_graph.acyclicPaths(start_key, finish_key);
  const route_describe = { 'length': routes.length,
                           'routes': []};
  let lane_route_i = []

  for(const i of Iter.range(routes.length)) {
    lane_route_i = nodeRouteToLaneRoute(routes[i], indexes_to_vertices, node_id_to_lane);

    route_describe.routes.push(
      {
        'nodes_path': routes[i],
        'lanes_path': lane_route_i,
      }
    );
  }

  return route_describe;
};

export const fromStartToFinishCombsAcyclicPaths = (blueprint) => {
  const sf_nodes = startAndFinishNodes(blueprint);

  const acyclic_paths = {};
  let startNode;
  let finishNode;

  for (const i of Iter.range(sf_nodes.start_nodes.length)) {
    startNode = sf_nodes.start_nodes[i];
    for (const j of Iter.range(sf_nodes.finish_nodes.length)) {
      finishNode = sf_nodes.finish_nodes[j];

      const label = `${startNode}_${finishNode}`;
      acyclic_paths[label] = fromStartToFinishAcyclicPaths(blueprint, startNode, finishNode);
    }
  }

  return acyclic_paths;
};

export const parseWorkflowXMLToGraph = () => {
  throw Error('Not implemented');
};
