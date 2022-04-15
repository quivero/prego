"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var GraphVertex_js_1 = require("../../data-structures/graph/GraphVertex.js");
/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @param {GraphVertex} vertexCandidate
 * @return {boolean}
 */
function isSafe(adjacencyMatrix, verticesKeystoIndices, cycle, vertexCandidate) {
    var endVertex = cycle[cycle.length - 1];
    // Get end and candidate vertices indices in adjacency matrix.
    var candidateVertexAdjacencyIndex = verticesKeystoIndices[vertexCandidate.getKey()];
    var endVertexAdjacencyIndex = verticesKeystoIndices[endVertex.getKey()];
    // Check if last vertex in the path and candidate vertex are adjacent.
    if (adjacencyMatrix[endVertexAdjacencyIndex][candidateVertexAdjacencyIndex] === Infinity) {
        return false;
    }
    // Check if vertexCandidate is being added to the path for the first time.
    var candidateDuplicate = cycle.find(function (vertex) { return vertex.getKey() === vertexCandidate.getKey(); });
    return !candidateDuplicate;
}
/**
 * @param {number[][]} adjacencyMatrix
 * @param {object} verticesIndices
 * @param {GraphVertex[]} cycle
 * @return {boolean}
 */
function isCycle(adjacencyMatrix, verticesKeystoIndices, cycle) {
    // Check if first and last vertices in hamiltonian path are adjacent.
    // Get start and end vertices from the path.
    var startVertex = cycle[0];
    var endVertex = cycle[cycle.length - 1];
    // Get start/end vertices indices in adjacency matrix.
    var startVertexAdjacencyIndex = verticesKeystoIndices[startVertex.getKey()];
    var endVertexAdjacencyIndex = verticesKeystoIndices[endVertex.getKey()];
    // Check if we can go from end vertex to the start one.
    return adjacencyMatrix[endVertexAdjacencyIndex][startVertexAdjacencyIndex] !== Infinity;
}
/**
 * @param {number[][]} adjacencyMatrix
 * @param {GraphVertex[]} vertices
 * @param {object} verticesIndices
 * @param {GraphVertex[][]} cycles
 * @param {GraphVertex[]} cycle
 */
function hamiltonianCycleRecursive(_a) {
    var currentCycle, vertexIndex, vertexCandidate, _i, _b, cycle_;
    var adjacencyMatrix = _a.adjacencyMatrix, vertices = _a.vertices, verticesKeystoIndices = _a.verticesKeystoIndices, cycle = _a.cycle;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                currentCycle = __spreadArrays(cycle).map(function (vertex) { return new GraphVertex_js_1.default(vertex.label); });
                if (!(vertices.length === currentCycle.length)) return [3 /*break*/, 3];
                if (!isCycle(adjacencyMatrix, verticesKeystoIndices, currentCycle)) return [3 /*break*/, 2];
                // Another solution has been found. Save it.
                return [4 /*yield*/, currentCycle];
            case 1:
                // Another solution has been found. Save it.
                _c.sent();
                _c.label = 2;
            case 2: return [2 /*return*/];
            case 3:
                vertexIndex = 0;
                _c.label = 4;
            case 4:
                if (!(vertexIndex < vertices.length)) return [3 /*break*/, 10];
                vertexCandidate = vertices[vertexIndex];
                if (!isSafe(adjacencyMatrix, verticesKeystoIndices, currentCycle, vertexCandidate)) return [3 /*break*/, 9];
                // Add candidate vertex to cycle path.
                currentCycle.push(vertexCandidate);
                _i = 0, _b = hamiltonianCycleRecursive({
                    adjacencyMatrix: adjacencyMatrix,
                    vertices: vertices,
                    verticesKeystoIndices: verticesKeystoIndices,
                    cycle: currentCycle,
                });
                _c.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 8];
                cycle_ = _b[_i];
                return [4 /*yield*/, cycle_];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                // BACKTRACKING.
                // Remove candidate vertex from cycle path in order to try another one.
                currentCycle.pop();
                _c.label = 9;
            case 9:
                vertexIndex += 1;
                return [3 /*break*/, 4];
            case 10: return [2 /*return*/];
        }
    });
}
/**
 * @param {Graph} graph
 * @return {GraphVertex[][]}
 */
function hamiltonianCycle(graph) {
    var verticesKeystoIndices, adjacencyMatrix, vertices, startVertex, cycles, cycle, _i, _a, cycle_;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                verticesKeystoIndices = graph.getVerticesKeystoIndices();
                adjacencyMatrix = graph.getAdjacencyMatrix();
                vertices = graph.getAllVertices();
                startVertex = vertices[0];
                cycles = [];
                cycle = [startVertex];
                _i = 0, _a = hamiltonianCycleRecursive({
                    adjacencyMatrix: adjacencyMatrix,
                    vertices: vertices,
                    verticesKeystoIndices: verticesKeystoIndices,
                    cycles: cycles,
                    cycle: cycle,
                });
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                cycle_ = _a[_i];
                return [4 /*yield*/, cycle_];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
exports.default = hamiltonianCycle;
