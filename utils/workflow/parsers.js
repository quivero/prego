import Graph from '../../data-structures/graph/Graph';
import GraphVertex from '../../data-structures/graph/GraphVertex';
import GraphEdge from '../../data-structures/graph/GraphEdge';
import { getUniques, getAllIndexes } from '../arrays/arrays';

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

export const fromStartToFinishAcyclicPaths = (blueprint, start_key, finish_key) => {
  const bp_graph = parseBlueprintToGraph(blueprint);

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
  const route_describe = { length: routes.length, routes };

  return route_describe;
};

export const fromStartToFinishCombsAcyclicPaths = (blueprint) => {
  const { nodes } = blueprint.blueprint_spec;
  const finishNodes = [];
  const startNodes = [];

  for (const node of nodes) {
    if (node.type.toLowerCase() === 'start') {
      startNodes.push(node.id);
    }

    if (node.type.toLowerCase() === 'finish') {
      finishNodes.push(node.id);
    }
  }

  const acyclic_paths = {};
  for (const startNode of startNodes) {
    for (const finishNode of finishNodes) {
      acyclic_paths[`${startNode}_${finishNode}`] = fromStartToFinishAcyclicPaths(blueprint, startNode, finishNode);
    }
  }

  return acyclic_paths;
};

export const parseWorkflowXMLToGraph = () => {
  throw Error('Not implemented');
};
