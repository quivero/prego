"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("lodash.combinations");
var lodash_1 = require("lodash");
var GraphVertex_js_1 = require("../GraphVertex.js");
var GraphEdge_js_1 = require("../GraphEdge.js");
var Graph_js_1 = require("../Graph.js");
var objects_js_1 = require("../../../utils/objects/objects.js");
exports.createVertices = function (labels) {
    var vertices = [];
    labels.forEach(function (label) {
        var vertex = new GraphVertex_js_1.default(label);
        vertices.push(vertex);
    });
    return vertices;
};
exports.createEdges = function (vertices_tuples) {
    var edges = [];
    vertices_tuples.forEach(function (vertices_tuple) {
        var edge = new GraphEdge_js_1.default(vertices_tuple[0], vertices_tuple[1]);
        edges.push(edge);
    });
    return edges;
};
exports.createEdgesFromVerticesValues = function (vertices_values_tuples) {
    var vertex_id_to_obj = objects_js_1.objectMap(objects_js_1.objectInit(lodash_1.default.uniq(lodash_1.default.flatten(vertices_values_tuples)), {}), function (vertex_key, obj) { return new GraphVertex_js_1.default(vertex_key); });
    return exports.createEdges(vertices_values_tuples.map(function (vertices_values_tuple) { return [
        vertex_id_to_obj[vertices_values_tuple[0]],
        vertex_id_to_obj[vertices_values_tuple[1]],
    ]; }));
};
exports.createCompleteUndirectedGraph = function (vertices_keys) {
    var graph = new Graph_js_1.default(false);
    graph.addEdges(exports.createEdgesFromVerticesValues(lodash_1.default.combinations(vertices_keys, 2)));
    return graph;
};
