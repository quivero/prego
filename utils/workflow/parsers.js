import _ from 'lodash';
import Graph from '../../data-structures/graph/Graph.js';
import {
  createEdgesFromVerticesValues
} from '../../data-structures/graph/utils/graph.js';
import { getAllIndexes, removeArrayDuplicates } from '../arrays/arrays.js';
import { 
  objectReduce,
  objectMap 
} from '../objects/objects.js';

export const getBlueprintNextNodes = (blueprint) => {
  const nodes = blueprint['blueprint_spec']['nodes'];

  return objectReduce(
    nodes,
    (next_nodes, node_key, node_value) => {
      if (node_value['type'].toLowerCase() === 'flow') {
        next_nodes[node_value.id] = Object.values(node_value.next);
      } else if(node_value['type'].toLowerCase() === 'finish') {
      } else {
        next_nodes[node_value.id] = [node_value.next];
      }

      return next_nodes;
    }
    , {}
  )
}

export const getBlueprintFromToEdgeTuples = (blueprint) => {
  const nodes = blueprint['blueprint_spec']['nodes'];

  return objectReduce(
    getBlueprintNextNodes(blueprint),
    (edge_nodes, curr_node_key, curr_node_value) => {
      
      if(curr_node_value.length > 1) {
        edge_nodes = edge_nodes.concat(
          curr_node_value.map((next_node_key) => [curr_node_key, next_node_key])
        )
      } else {
        edge_nodes.push([curr_node_key, curr_node_value[0]])
      }
      
      return edge_nodes
    }, []
  )
}

export const reachableFinishFromStart = (blueprint) => {
  const start_finish_nodes = startAndFinishNodes(blueprint);
  const reachable_nodes = {};
  const non_reachable_nodes = {};

  const workflow_finish_reachability = {};

  for (const start_node_key of start_finish_nodes.start_nodes) {
    workflow_finish_reachability[start_node_key] = [];

    reachable_nodes[start_node_key] = bp_graph.convertVerticesIndexestoKeys(bp_graph.reachableNodes(start_node_key));

    const reachable_finish_nodes = _.intersection(
      reachable_nodes[start_node_key],
      start_finish_nodes.finish_nodes,
    );

    non_reachable_nodes[start_node_key] = _.difference(bp_graph.getAllVerticesKeys(), reachable_nodes[start_node_key]);

    if (reachable_finish_nodes.length !== 0) {
      workflow_finish_reachability[start_node_key] = reachable_finish_nodes;
    }
  }

  return {
    name: blueprint.name,
    description: blueprint.description,
    node_ids_per_type,
    reachable_from_start: reachable_nodes,
    non_reachable_from_start: non_reachable_nodes,
    reachable_finish_from_start: workflow_finish_reachability,
    graph: bp_graph.describe(),
  };
};

/**
 * @abstract returns an object with all nodes specified by type as keys
 *
 * @param {Object} blueprint
 * @param {Integer} type
 * @param {Object} nodes_per_type
 */
export const getBlueprintNodesByType = (blueprint, type) => {
  const { nodes } = blueprint.blueprint_spec;
  const nodes_per_type = [];

  for (const node of nodes) {
    if (node.type.toLowerCase() === type) {
      nodes_per_type.push(node);
    }
  }

  return nodes_per_type;
};

/**
 * @abstract returns a Graph instance of the blueprint spectrum
 *
 * @param {Object} blueprint
 * @param {Graph} graph
 */
export const parseBlueprintToGraph = (blueprint) => {
  const nodes = blueprint['blueprint_spec']['nodes'];
  
  const graph = new Graph(true);
  
  graph.addEdges(
    removeArrayDuplicates(
      createEdgesFromVerticesValues(
        getBlueprintFromToEdgeTuples(blueprint)
      )
    )
  );

  return graph;
};

/**
 * @abstract returns start and finish nodes object of given blueprint
 *
 * @param {Object} blueprint
 * @param {Graph}
 */
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

  return { start_nodes: [...startNodes], finish_nodes: [...finishNodes] };
};

/**
 * @abstract returns start and finish nodes object of given blueprint
 *
 * @param {Object} blueprint
 * @param {Graph}
 */
export const nodeToLane = (blueprint) => {
  const { nodes } = blueprint.blueprint_spec;
  const node_to_lane = {};

  for (const node of nodes) {
    node_to_lane[node.id] = node.lane_id;
  }

  return node_to_lane;
};

/**
 * @abstract returns lane route from a node_route
 *
 * @param {Object} blueprint
 * @param {Graph}
 */
export const nodeToLaneRoute = (
  node_route,
  vertices_indices_to_keys,
  node_id_to_lane,
) => {
  const lane_route = [];

  for (const vertex_j of node_route) {
    const lane_vertex_j = node_id_to_lane[vertices_indices_to_keys[vertex_j]];

    if (lane_route.length === 0) {
      lane_route.push(lane_vertex_j);
    } else if (lane_route[lane_route.length - 1] !== lane_vertex_j) {
      lane_route.push(lane_vertex_j);
    } else {
      continue;
    }
  }

  return lane_route;
};

/**
 * @abstract returns all paths from certain start_key to finish_key
 *
 * @param {Object} blueprint
 * @param {String} start_key
 * @param {String} finish_key
 * @return {object} all_paths
 */
export const fromStartToFinishAllPaths = (blueprint, start_key, finish_key) => {
  const bp_graph = parseBlueprintToGraph(blueprint);
  const node_id_to_lane = nodeToLane(blueprint);

  const looseNodes = bp_graph.looseNodes();
  const orphanNodes = bp_graph.orphanNodes();
  const vertices_keys_to_indices = bp_graph.getVerticesKeystoIndices();
  const vertices_indices_to_keys = bp_graph.getVerticesIndicestoKeys();

  const start_index = vertices_keys_to_indices[start_key];
  const finish_index = vertices_keys_to_indices[finish_key];

  let is_undefined = false;
  if (start_index === undefined) {
    console.Warning(`Warning: Claimed start vertex key ${start_key} is not available within nodes`);
    is_undefined = true;
  }

  if (finish_index === undefined) {
    console.warn(`Warning: Claimed finish vertex key ${finish_key} is not available within nodes`);
    is_undefined = true;
  }

  if (is_undefined) {
    return [];
  }

  if (getAllIndexes(orphanNodes, start_index).length === 0) {
    console.warn(`Warning: Vertex id ${start_index} is not a start node! Detected start nodes: ${orphanNodes}`);

    return [];
  }

  if (getAllIndexes(looseNodes, finish_index).length === 0) {
    console.warn(`Warning: Vertex id ${finish_index} is not a finish node! Detected finish nodes: ${looseNodes}`);

    return [];
  }

  const routes = bp_graph.allPaths(start_key, finish_key);
  const route_describe = {
    length: routes.length,
    routes: [],
  };

  let lane_route_i = [];
  let node_route_i = [] 
  const total_len = 0;

  for (const i in routes) {
    lane_route_i = nodeToLaneRoute(routes[i], vertices_indices_to_keys, node_id_to_lane);

    node_route_i = bp_graph.convertVerticesIndexestoKeys(routes[i]);

    route_describe.routes.push(
      {
        node_path: {
          length: node_route_i.length,
          trace: node_route_i
        },
        lane_path: {
          length: lane_route_i.length,
          trace: lane_route_i
        },
      },
    );
  }

  return route_describe;
};

/**
 * @abstract returns all paths between all start nodes and finish nodes
 *
 * @param {Object} blueprint
 * @return {object} all_paths
 */
export const fromStartToFinishCombsAllPaths = (blueprint) => {
  const sf_nodes = startAndFinishNodes(blueprint);

  const paths = {};
  let total_length = 0;
  let startNode;
  let finishNode;

  for (const i of _.range(sf_nodes.start_nodes.length)) {
    startNode = sf_nodes.start_nodes[i];
    for (const j of _.range(sf_nodes.finish_nodes.length)) {
      finishNode = sf_nodes.finish_nodes[j];

      const label = `${startNode}_${finishNode}`;
      paths[label] = fromStartToFinishAllPaths(blueprint, startNode, finishNode);

      total_length += paths[label].length;
    }
  }

  return {
    length: total_length,
    from_to: paths,
  };
};

export const parseWorkflowXMLToGraph = () => {
  throw Error('Not implemented');
};

/**
 * @abstract returns workflow islands
 *
 * @param {Object} blueprint
 * @return {object} islands
 */
export const workflowIslands = (blueprint) => parseBlueprintToGraph(blueprint).islands();
