"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Stack_js_1 = require("../../data-structures/stack/Stack.js");
var depthFirstSearch_js_1 = require("../depth-first-search/depthFirstSearch.js");
/**
 * @param {Graph} graph
 * @return {Stack}
 */
function getVerticesSortedByDfsFinishTime(graph) {
    // Set of all visited vertices during DFS pass.
    var visitedVerticesSet = {};
    // Stack of vertices by finish time.
    // All vertices in this stack are ordered by finished time in decreasing order.
    // Vertex that has been finished first will be at the bottom of the stack and
    // vertex that has been finished last will be at the top of the stack.
    var verticesByDfsFinishTime = new Stack_js_1.default();
    // Set of all vertices we're going to visit.
    var notVisitedVerticesSet = {};
    graph.getAllVertices().forEach(function (vertex) {
        notVisitedVerticesSet[vertex.getKey()] = vertex;
    });
    // Specify DFS traversal callbacks.
    var dfsCallbacks = {
        enterVertex: function (_a) {
            var currentVertex = _a.currentVertex;
            // Add current vertex to visited set.
            visitedVerticesSet[currentVertex.getKey()] = currentVertex;
            // Delete current vertex from not visited set.
            delete notVisitedVerticesSet[currentVertex.getKey()];
        },
        // Push vertex to the stack when leaving it.
        // This will make stack to be ordered by finish time in decreasing order.
        leaveVertex: function (_a) {
            var currentVertex = _a.currentVertex;
            verticesByDfsFinishTime.push(currentVertex);
        },
        // Don't allow to traverse the nodes that have been already visited.
        allowTraversal: function (_a) {
            var nextVertex = _a.nextVertex;
            return !visitedVerticesSet[nextVertex.getKey()];
        },
    };
    // Do FIRST DFS PASS traversal for all graph vertices to fill the verticesByFinishTime stack.
    while (Object.values(notVisitedVerticesSet).length) {
        // Peek any vertex to start DFS traversal from.
        var startVertexKey = Object.keys(notVisitedVerticesSet)[0];
        var startVertex = notVisitedVerticesSet[startVertexKey];
        delete notVisitedVerticesSet[startVertexKey];
        depthFirstSearch_js_1.default(graph, startVertex, dfsCallbacks);
    }
    return verticesByDfsFinishTime;
}
/**
 * @param {Graph} graph
 * @param {Stack} verticesByFinishTime
 * @return {*[]}
 */
function getSCCSets(graph, verticesByFinishTime) {
    // Array of arrays of strongly connected vertices.
    var stronglyConnectedComponentsSets = [];
    // Array that will hold all vertices that are being visited during one DFS run.
    var stronglyConnectedComponentsSet = [];
    // Visited vertices set.
    var visitedVerticesSet = {};
    // Callbacks for DFS traversal.
    var dfsCallbacks = {
        enterVertex: function (_a) {
            var currentVertex = _a.currentVertex;
            // Add current vertex to SCC set of current DFS round.
            stronglyConnectedComponentsSet.push(currentVertex);
            // Add current vertex to visited set.
            visitedVerticesSet[currentVertex.getKey()] = currentVertex;
        },
        // Once DFS traversal is finished push the set of found strongly connected
        // components during current DFS round to overall strongly connected components set.
        // The sign that traversal is about to be finished is that we came back to start vertex
        // which doesn't have parent.
        leaveVertex: function (_a) {
            var previousVertex = _a.previousVertex;
            if (previousVertex === null) {
                stronglyConnectedComponentsSets.push(__spreadArrays(stronglyConnectedComponentsSet));
            }
        },
        // Don't allow traversal of already visited vertices.
        allowTraversal: function (_a) {
            var nextVertex = _a.nextVertex;
            return !visitedVerticesSet[nextVertex.getKey()];
        },
    };
    while (!verticesByFinishTime.isEmpty()) {
        /** @var {GraphVertex} startVertex */
        var startVertex = verticesByFinishTime.pop();
        // Reset the set of strongly connected vertices.
        stronglyConnectedComponentsSet = [];
        // Don't do DFS on already visited vertices.
        if (!visitedVerticesSet[startVertex.getKey()]) {
            // Do DFS traversal.
            depthFirstSearch_js_1.default(graph, startVertex, dfsCallbacks);
        }
    }
    return stronglyConnectedComponentsSets;
}
/**
 * Kosaraju's algorithm.
 *
 * @param {Graph} graph
 * @return {*[]}
 */
function stronglyConnectedComponents(graph) {
    // In this algorithm we will need to do TWO DFS PASSES overt the graph.
    // Get stack of vertices ordered by DFS finish time.
    // All vertices in this stack are ordered by finished time in decreasing order:
    // Vertex that has been finished first will be at the bottom of the stack and
    // vertex that has been finished last will be at the top of the stack.
    var verticesByFinishTime = getVerticesSortedByDfsFinishTime(graph);
    // Reverse the graph if directed
    if (graph.isDirected) {
        graph = graph.reverse();
    }
    // Do DFS once again on reversed graph.
    return getSCCSets(graph, verticesByFinishTime);
}
exports.default = stronglyConnectedComponents;
