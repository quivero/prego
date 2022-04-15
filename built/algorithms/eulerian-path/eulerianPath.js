"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphBridges_js_1 = require("../bridges/graphBridges.js");
/**
 * Fleury's algorithm of finding Eulerian Path (visit all graph edges exactly once).
 *
 * @param {Graph} graph
 * @return {GraphVertex[]}
 */
function eulerianPath(graph) {
    if (!graph.isEulerian()) {
        return [];
    }
    var eulerianPathVertices = [];
    // Set that contains all vertices with even rank (number of neighbors).
    var evenRankVertices = {};
    // Set that contains all vertices with odd rank (number of neighbors).
    var oddRankVertices = {};
    // Set of all not visited edges.
    var notVisitedEdges = {};
    graph.getAllEdges().forEach(function (vertex) {
        notVisitedEdges[vertex.getKey()] = vertex;
    });
    // Detect whether graph contains Eulerian Circuit or Eulerian Path or none of them.
    /** @params {GraphVertex} vertex */
    graph.getAllVertices().forEach(function (vertex) {
        if (vertex.getDegree() % 2) {
            oddRankVertices[vertex.getKey()] = vertex;
        }
        else {
            evenRankVertices[vertex.getKey()] = vertex;
        }
    });
    // Check whether we're dealing with Eulerian Circuit or Eulerian Path only.
    // Graph would be an Eulerian Circuit in case if all its vertices has even degree.
    // If not all vertices have even degree then graph must contain only two odd-degree
    // vertices in order to have Euler Path.
    var isCircuit = !Object.values(oddRankVertices).length;
    // Pick start vertex for traversal.
    var startVertex = null;
    if (isCircuit) {
        // For Eulerian Circuit it doesn't matter from what vertex to start thus we'll just
        // peek a first node.
        var evenVertexKey = Object.keys(evenRankVertices)[0];
        startVertex = evenRankVertices[evenVertexKey];
    }
    else {
        // For Eulerian Path we need to start from one of two odd-degree vertices.
        var oddVertexKey = Object.keys(oddRankVertices)[0];
        startVertex = oddRankVertices[oddVertexKey];
    }
    // Start traversing the graph.
    var currentVertex = startVertex;
    var _loop_1 = function () {
        // Add current vertex to Eulerian path.
        eulerianPathVertices.push(currentVertex);
        // Detect all bridges in graph.
        // We need to do it in order to not delete bridges if there are other edges
        // exists for deletion.
        var bridges = graphBridges_js_1.default(graph);
        // Peek the next edge to delete from graph.
        var currentEdges = currentVertex.getEdges();
        /** @var {GraphEdge} edgeToDelete */
        var edgeToDelete = null;
        if (currentEdges.length === 1) {
            // If there is only one edge left we need to peek it.
            edgeToDelete = currentEdges[0];
        }
        else {
            // If there are many edges left then we need to peek any of those except bridges.
            edgeToDelete = currentEdges.filter(function (edge) { return !bridges[edge.getKey()]; })[0];
        }
        // Detect next current vertex.
        if (currentVertex.getKey() === edgeToDelete.startVertex.getKey()) {
            currentVertex = edgeToDelete.endVertex;
        }
        else {
            currentVertex = edgeToDelete.startVertex;
        }
        // Delete edge from not visited edges set.
        delete notVisitedEdges[edgeToDelete.getKey()];
        // If last edge were deleted then add finish vertex to Eulerian Path.
        if (Object.values(notVisitedEdges).length === 0) {
            eulerianPathVertices.push(currentVertex);
        }
        // Delete the edge from graph.
        graph.deleteEdge(edgeToDelete);
    };
    while (Object.values(notVisitedEdges).length) {
        _loop_1();
    }
    return eulerianPathVertices;
}
exports.default = eulerianPath;
