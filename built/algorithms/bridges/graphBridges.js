"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var depthFirstSearch_js_1 = require("../depth-first-search/depthFirstSearch.js");
/**
 * Helper class for visited vertex metadata.
 */
var VisitMetadata = /** @class */ (function () {
    function VisitMetadata(_a) {
        var discoveryTime = _a.discoveryTime, lowDiscoveryTime = _a.lowDiscoveryTime;
        this.discoveryTime = discoveryTime;
        this.lowDiscoveryTime = lowDiscoveryTime;
    }
    return VisitMetadata;
}());
/**
 * @param {Graph} graph
 * @return {Object}
 */
function graphBridges(graph) {
    // Set of vertices we've already visited during DFS.
    var visitedSet = {};
    // Set of bridges.
    var bridges = {};
    // Time needed to discover to the current vertex.
    var discoveryTime = 0;
    // Peek the start vertex for DFS traversal.
    var startVertex = graph.getAllVertices()[0];
    var dfsCallbacks = {
        /**
         * @param {GraphVertex} currentVertex
         */
        enterVertex: function (_a) {
            var currentVertex = _a.currentVertex;
            // Tick discovery time.
            discoveryTime += 1;
            // Put current vertex to visited set.
            visitedSet[currentVertex.getKey()] = new VisitMetadata({
                discoveryTime: discoveryTime,
                lowDiscoveryTime: discoveryTime,
            });
        },
        /**
         * @param {GraphVertex} currentVertex
         * @param {GraphVertex} previousVertex
         */
        leaveVertex: function (_a) {
            var currentVertex = _a.currentVertex, previousVertex = _a.previousVertex;
            if (previousVertex === null) {
                // Don't do anything for the root vertex if it is already current (not previous one).
                return;
            }
            // Check if current node is connected to any early node other then previous one.
            visitedSet[currentVertex.getKey()].lowDiscoveryTime = currentVertex.getNeighbors()
                .filter(function (earlyNeighbor) { return earlyNeighbor.getKey() !== previousVertex.getKey(); })
                .reduce(
            /**
             * @param {number} lowestDiscoveryTime
             * @param {GraphVertex} neighbor
             */
            function (lowestDiscoveryTime, neighbor) {
                var neighborLowTime = visitedSet[neighbor.getKey()].lowDiscoveryTime;
                return neighborLowTime < lowestDiscoveryTime ? neighborLowTime : lowestDiscoveryTime;
            }, visitedSet[currentVertex.getKey()].lowDiscoveryTime);
            // Compare low discovery times. In case if current low discovery time is less than the one
            // in previous vertex then update previous vertex low time.
            var currentLowDiscoveryTime = visitedSet[currentVertex.getKey()].lowDiscoveryTime;
            var previousLowDiscoveryTime = visitedSet[previousVertex.getKey()].lowDiscoveryTime;
            if (currentLowDiscoveryTime < previousLowDiscoveryTime) {
                visitedSet[previousVertex.getKey()].lowDiscoveryTime = currentLowDiscoveryTime;
            }
            // Compare current vertex low discovery time with parent discovery time. Check if there
            // are any short path (back edge) exists. If we can't get to current vertex other then
            // via parent then the parent vertex is articulation point for current one.
            var parentDiscoveryTime = visitedSet[previousVertex.getKey()].discoveryTime;
            if (parentDiscoveryTime < currentLowDiscoveryTime) {
                var bridge = graph.findEdge(previousVertex, currentVertex);
                bridges[bridge.getKey()] = bridge;
            }
        },
        allowTraversal: function (_a) {
            var nextVertex = _a.nextVertex;
            return !visitedSet[nextVertex.getKey()];
        },
    };
    // Do Depth First Search traversal over submitted graph.
    depthFirstSearch_js_1.default(graph, startVertex, dfsCallbacks);
    return bridges;
}
exports.default = graphBridges;
