"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Graph_js_1 = require("../../data-structures/graph/Graph.js");
var graph_js_1 = require("../../data-structures/graph/utils/graph.js");
var arrays_js_1 = require("../arrays/arrays.js");
var objects_js_1 = require("../objects/objects.js");
exports.getBlueprintNextNodes = function (blueprint) {
    var nodes = blueprint.blueprint_spec.nodes;
    return objects_js_1.objectReduce(nodes, function (next_nodes, node_key, node_value) {
        if (node_value.type.toLowerCase() === 'flow') {
            next_nodes[node_value.id] = Object.values(node_value.next);
        }
        else if (node_value.type.toLowerCase() === 'finish') {
        }
        else {
            next_nodes[node_value.id] = [node_value.next];
        }
        return next_nodes;
    }, {});
};
exports.getBlueprintFromToEdgeTuples = function (blueprint) {
    var nodes = blueprint.blueprint_spec.nodes;
    return objects_js_1.objectReduce(exports.getBlueprintNextNodes(blueprint), function (edge_nodes, curr_node_key, curr_node_value) {
        if (curr_node_value.length > 1) {
            edge_nodes = edge_nodes.concat(curr_node_value.map(function (next_node_key) { return [curr_node_key, next_node_key]; }));
        }
        else {
            edge_nodes.push([curr_node_key, curr_node_value[0]]);
        }
        return edge_nodes;
    }, []);
};
exports.reachableFinishFromStart = function (blueprint) {
    var start_finish_nodes = exports.startAndFinishNodes(blueprint);
    var reachable_nodes = {};
    var non_reachable_nodes = {};
    var workflow_finish_reachability = {};
    for (var _i = 0, _a = start_finish_nodes.start_nodes; _i < _a.length; _i++) {
        var start_node_key = _a[_i];
        workflow_finish_reachability[start_node_key] = [];
        reachable_nodes[start_node_key] = bp_graph.convertVerticesIndexestoKeys(bp_graph.reachableNodes(start_node_key));
        var reachable_finish_nodes = lodash_1.default.intersection(reachable_nodes[start_node_key], start_finish_nodes.finish_nodes);
        non_reachable_nodes[start_node_key] = lodash_1.default.difference(bp_graph.getAllVerticesKeys(), reachable_nodes[start_node_key]);
        if (reachable_finish_nodes.length !== 0) {
            workflow_finish_reachability[start_node_key] = reachable_finish_nodes;
        }
    }
    return workflow_finish_reachability;
};
/**
 * @abstract returns an object with a rich description of given blueprint
 *
 * @param {Object} blueprint
 * @param {Object} description
 */
exports.describeBlueprint = function (blueprint) {
    var bp_graph = exports.parseBlueprintToGraph(blueprint);
    var node_ids_per_type = {};
    var types = ['start', 'finish', 'systemtask', 'subprocess',
        'scripttask', 'flow', 'usertask'];
    var _loop_1 = function (type) {
        node_ids_per_type[type] = [];
        exports.getBlueprintNodesByType(blueprint, type).forEach(function (node) {
            node_ids_per_type[type].push(node.id);
        });
    };
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var type = types_1[_i];
        _loop_1(type);
    }
    return {
        name: blueprint.name,
        description: blueprint.description,
        node_ids_per_type: node_ids_per_type,
        reachable_from_start: reachable_nodes,
        non_reachable_from_start: non_reachable_nodes,
        reachable_finish_from_start: exports.reachableFinishFromStart(blueprint),
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
exports.getBlueprintNodesByType = function (blueprint, type) {
    var nodes = blueprint.blueprint_spec.nodes;
    var nodes_per_type = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
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
exports.parseBlueprintToGraph = function (blueprint) {
    var nodes = blueprint.blueprint_spec.nodes;
    var graph = new Graph_js_1.default(true);
    graph.addEdges(arrays_js_1.removeArrayDuplicates(graph_js_1.createEdgesFromVerticesValues(exports.getBlueprintFromToEdgeTuples(blueprint))));
    return graph;
};
/**
 * @abstract returns start and finish nodes object of given blueprint
 *
 * @param {Object} blueprint
 * @param {Graph}
 */
exports.startAndFinishNodes = function (blueprint) {
    var nodes = blueprint.blueprint_spec.nodes;
    var startNodes = [];
    var finishNodes = [];
    for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
        var node = nodes_2[_i];
        if (node.type.toLowerCase() === 'start') {
            startNodes.push(node.id);
        }
        if (node.type.toLowerCase() === 'finish') {
            finishNodes.push(node.id);
        }
    }
    return { start_nodes: __spreadArrays(startNodes), finish_nodes: __spreadArrays(finishNodes) };
};
/**
 * @abstract returns start and finish nodes object of given blueprint
 *
 * @param {Object} blueprint
 * @param {Graph}
 */
exports.nodeToLane = function (blueprint) {
    var nodes = blueprint.blueprint_spec.nodes;
    var node_to_lane = {};
    for (var _i = 0, nodes_3 = nodes; _i < nodes_3.length; _i++) {
        var node = nodes_3[_i];
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
exports.nodeToLaneRoute = function (node_route, vertices_indices_to_keys, node_id_to_lane) {
    var lane_route = [];
    for (var _i = 0, node_route_1 = node_route; _i < node_route_1.length; _i++) {
        var vertex_j = node_route_1[_i];
        var lane_vertex_j = node_id_to_lane[vertices_indices_to_keys[vertex_j]];
        if (lane_route.length === 0) {
            lane_route.push(lane_vertex_j);
        }
        else if (lane_route[lane_route.length - 1] !== lane_vertex_j) {
            lane_route.push(lane_vertex_j);
        }
        else {
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
exports.fromStartToFinishAllPaths = function (blueprint, start_key, finish_key) {
    var bp_graph = exports.parseBlueprintToGraph(blueprint);
    var node_id_to_lane = exports.nodeToLane(blueprint);
    var looseNodes = bp_graph.looseNodes();
    var orphanNodes = bp_graph.orphanNodes();
    var vertices_keys_to_indices = bp_graph.getVerticesKeystoIndices();
    var vertices_indices_to_keys = bp_graph.getVerticesIndicestoKeys();
    var start_index = vertices_keys_to_indices[start_key];
    var finish_index = vertices_keys_to_indices[finish_key];
    var is_undefined = false;
    if (start_index === undefined) {
        console.Warning("Warning: Claimed start vertex key " + start_key + " is not available within nodes");
        is_undefined = true;
    }
    if (finish_index === undefined) {
        console.warn("Warning: Claimed finish vertex key " + finish_key + " is not available within nodes");
        is_undefined = true;
    }
    if (is_undefined) {
        return [];
    }
    if (arrays_js_1.getAllIndexes(orphanNodes, start_index).length === 0) {
        console.warn("Warning: Vertex id " + start_index + ", key " + start_key + ", is not a orphan node! Detected start nodes: " + orphanNodes);
        return [];
    }
    if (arrays_js_1.getAllIndexes(looseNodes, finish_index).length === 0) {
        console.warn("Warning: Vertex id " + finish_index + ", key " + finish_key + ", is not a loose node! Detected finish nodes: " + looseNodes);
        return [];
    }
    var routes = bp_graph.allPaths(start_key, finish_key);
    var route_describe = {
        length: routes.length,
        routes: [],
    };
    var lane_route_i = [];
    var node_route_i = [];
    for (var i in routes) {
        lane_route_i = exports.nodeToLaneRoute(routes[i], vertices_indices_to_keys, node_id_to_lane);
        node_route_i = bp_graph.convertVerticesIndexestoKeys(routes[i]);
        route_describe.routes.push({
            node_path: {
                length: node_route_i.length,
                trace: node_route_i,
            },
            lane_path: {
                length: lane_route_i.length,
                trace: lane_route_i,
            },
        });
    }
    return route_describe;
};
/**
 * @abstract returns all paths between all start nodes and finish nodes
 *
 * @param {Object} blueprint
 * @return {object} all_paths
 */
exports.fromStartToFinishCombsAllPaths = function (blueprint) {
    var sf_nodes = exports.startAndFinishNodes(blueprint);
    var paths = {};
    var total_length = 0;
    var startNode;
    var finishNode;
    for (var _i = 0, _a = lodash_1.default.range(sf_nodes.start_nodes.length); _i < _a.length; _i++) {
        var i = _a[_i];
        startNode = sf_nodes.start_nodes[i];
        for (var _b = 0, _c = lodash_1.default.range(sf_nodes.finish_nodes.length); _b < _c.length; _b++) {
            var j = _c[_b];
            finishNode = sf_nodes.finish_nodes[j];
            var label = startNode + "_" + finishNode;
            paths[label] = exports.fromStartToFinishAllPaths(blueprint, startNode, finishNode);
            total_length += paths[label].length;
        }
    }
    return {
        length: total_length,
        from_to: paths,
    };
};
exports.parseWorkflowXMLToGraph = function () {
    throw Error('Not implemented');
};
/**
 * @abstract returns workflow islands
 *
 * @param {Object} blueprint
 * @return {object} islands
 */
exports.workflowIslands = function (blueprint) { return exports.parseBlueprintToGraph(blueprint).islands(); };
