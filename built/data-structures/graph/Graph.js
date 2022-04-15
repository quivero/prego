"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var _cycles, _density;
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var Queue_js_1 = require("../queue/Queue.js");
var stronglyConnectedComponents_js_1 = require("../../algorithms/strongly-connected-components/stronglyConnectedComponents.js");
var eulerianPath_js_1 = require("../../algorithms/eulerian-path/eulerianPath.js");
var hamiltonianCycle_js_1 = require("../../algorithms/hamiltonian-cycle/hamiltonianCycle.js");
var depthFirstSearch_js_1 = require("../../algorithms/depth-first-search/depthFirstSearch.js");
var VisitMetadata_js_1 = require("./VisitMetadata.js");
var graphBridges_js_1 = require("../../algorithms/bridges/graphBridges.js");
var arrays_js_1 = require("../../utils/arrays/arrays.js");
var graph_js_1 = require("./utils/graph.js");
var objects_js_1 = require("../../utils/objects/objects.js");
var GraphVertex_js_1 = require("./GraphVertex.js");
var GraphEdge_js_1 = require("./GraphEdge.js");
var Graph = /** @class */ (function () {
    /**
     * @param {boolean} isDirected
     */
    function Graph(isDirected) {
        if (isDirected === void 0) { isDirected = false; }
        _cycles.set(this, void 0);
        _density.set(this, void 0);
        this.vertices = {};
        this.edges = {};
        this.isDirected = isDirected;
        __classPrivateFieldSet(this, _cycles, []);
        __classPrivateFieldSet(this, _density, 0);
    }
    Object.defineProperty(Graph.prototype, "cycles", {
        /**
         * @returns {Array} Graph cycles
         */
        get: function () {
            return this.cyclicCircuits();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Graph.prototype, "density", {
        /**
         * @returns {} Graph density defined by number
         * of edges divided by number of possible edges
         */
        get: function () {
            var n_vertices = this.getNumVertices();
            var n_dense = (n_vertices / 2) * (n_vertices - 1);
            var n_edges = this.getAllEdges().length;
            __classPrivateFieldSet(this, _density, n_edges / n_dense);
            return __classPrivateFieldGet(this, _density);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {GraphVertex} newVertex
     * @returns {Graph}
     */
    Graph.prototype.addVertex = function (newVertex) {
        // Check if vertex has been already added.
        if (Object.keys(this.vertices).includes(newVertex.label)) {
            throw Error('Vertex has already been added before. Please, choose other key!');
        }
        this.vertices[newVertex.label] = newVertex;
        return this;
    };
    /**
     * @param {GraphVertex} seekVertex
     * @returns {boolean}
     */
    Graph.prototype.hasVertex = function (seekVertexKey) {
        return this.vertices[seekVertexKey] !== undefined;
    };
    /**
     * @param {GraphVertex[]} vertices
     * @returns {Graph}
     */
    Graph.prototype.addVertices = function (newVertices) {
        var _this = this;
        newVertices.forEach(function (vertex) { return _this.addVertex(vertex); });
    };
    /**
     * @param {string} vertexKey
     * @returns GraphVertex
     */
    Graph.prototype.getVertexByKey = function (vertexKey) {
        return this.vertices[vertexKey];
    };
    /**
     * @param {integer} vertexIndex
     * @returns GraphVertex
     */
    Graph.prototype.getVertexByIndex = function (vertexIndex) {
        var indices_to_vertices = this.getVerticesIndicestoKeys();
        return this.vertices[indices_to_vertices[vertexIndex]];
    };
    /**
     * @param {GraphVertex} vertex
     * @returns {GraphVertex[]}
     */
    Graph.prototype.getNeighbors = function (vertex) {
        return vertex.getNeighbors();
    };
    /**
     * @return {GraphVertex[]}
     */
    Graph.prototype.getAllVertices = function () {
        return Object.values(this.vertices);
    };
    /**
     * @return {Array[string]}
     */
    Graph.prototype.getAllVerticesKeys = function () {
        return Object.keys(this.vertices);
    };
    /**
     * @return {Integer}
     */
    Graph.prototype.getNumVertices = function () {
        return this.getAllVertices().length;
    };
    /**
     * @return {GraphEdge[]}
     */
    Graph.prototype.getAllEdges = function () {
        return Object.values(this.edges);
    };
    /**
     * @return {GraphEdge[]}
     */
    Graph.prototype.getAllEdgesKeys = function () {
        return Object.keys(this.edges);
    };
    /**
     * @return {Array[string]}
     */
    Graph.prototype.getVerticesKeys = function () {
        return Object.keys(this.vertices);
    };
    /**
     * @return {GraphVertex[]}
     */
    Graph.prototype.getVerticesByKeys = function (vertex_keys) {
        var _this = this;
        return vertex_keys.map(function (vertex_key) { return _this.vertices[vertex_key]; });
    };
    /**
     * @return {GraphVertex[]}
     */
    Graph.prototype.getVerticesByIndexes = function (vertex_indexes) {
        var index_to_key = this.getVerticesIndicestoKeys();
        return this.getVerticesByKeys(vertex_indexes.map(function (vertex_index) { return index_to_key[vertex_index]; }));
    };
    /**
     * @param {String[]} vertexKeys
     * @returns {GraphEdge[]}
     */
    Graph.prototype.getEdgesByVertexKeys = function (vertexKeys, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        var edges_from_keys = [];
        var edges = this.getAllEdges();
        var operator_fun = function () { return 42; };
        return edges.map(function (edge) {
            if (exclusive) {
                operator_fun = function (left_operand, right_operand) { return left_operand && right_operand; };
            }
            else {
                operator_fun = function (left_operand, right_operand) { return left_operand || right_operand; };
            }
            if (operator_fun(vertexKeys.includes(edge.startVertex.getKey()), vertexKeys.includes(edge.endVertex.getKey()))) {
                return lodash_1.default.cloneDeep(edge);
            }
            return null;
        }).filter(function (copied_edge) { return copied_edge !== null; });
    };
    /**
     * @param {String[]} vertexKeys
     * @returns {String[]}
     */
    Graph.prototype.getEdgesKeysByVertexKeys = function (vertexKeys, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        return this.getEdgesByVertexKeys(vertexKeys, exclusive).map(function (edge) { return edge.getKey(); });
    };
    /**
     * @param {Array[integer]} vertexIndexes
     * @returns GraphVertex
     */
    Graph.prototype.getEdgesByVertexIndexes = function (verticesIndexes, exclusive) {
        if (exclusive === void 0) { exclusive = false; }
        var vertices_indexes_to_keys = this.getVerticesIndicestoKeys();
        return this.getEdgesByVertexKeys(verticesIndexes.map(function (vertexIndexes) { return vertices_indexes_to_keys[vertexIndexes]; }), exclusive);
    };
    /**
     * @param {integer} vertexIndex
     * @returns GraphVertex
     */
    Graph.prototype.convertVerticesIndexestoKeys = function (vertexIndexes) {
        var vertexKeys = [];
        var vertices_indexes_to_keys = this.getVerticesIndicestoKeys();
        vertexIndexes.forEach(function (vertexIndex) {
            vertexKeys.push(vertices_indexes_to_keys[vertexIndex]);
        });
        return vertexKeys;
    };
    /**
     * @param {string} vertexKey
     * @returns GraphVertex
     */
    Graph.prototype.convertVerticesKeystoIndexes = function (vertexKeys) {
        var vertexIndexes = [];
        var vertices_keys_to_indexes = this.getVerticesKeystoIndices();
        vertexKeys.forEach(function (vertexKey) {
            vertexIndexes.push(vertices_keys_to_indexes[vertexKey]);
        });
        return vertexIndexes;
    };
    /**
     * @param {GraphEdge} edge
     * @returns {Array[Integer]}
     */
    Graph.prototype.convertEdgeToVerticesIndices = function (edge) {
        var keys_to_indices = this.getVerticesKeystoIndices();
        return [
            keys_to_indices[edge.startVertex.getKey()],
            keys_to_indices[edge.endVertex.getKey()],
        ];
    };
    /**
     * @param {GraphEdge} edge
     * @returns {Array[Integer]}
     */
    Graph.prototype.convertEdgesToVerticesIndices = function (edges) {
        var _this = this;
        return edges.map(function (edge) { return _this.convertEdgeToVerticesIndices(edge); });
    };
    /**
     * @param {GraphVertex[]} vertices
     * @returns {String[]}
     */
    Graph.prototype.convertVerticestoVerticesKeys = function (vertices) {
        return vertices.map(function (vertex) { return vertex.getKey(); });
    };
    /**
     * @param {GraphVertex[]} vertices
     * @returns {String[]}
     */
    Graph.prototype.convertVerticestoVerticesIndices = function (vertices) {
        return this.convertVerticesKeystoIndexes(this.convertVerticestoVerticesKeys(vertices));
    };
    /**
     * @abstract Return adjacency list
     * - type = 0: Forward star
     * - type = 1: Reverse star
     * @param {Integer} vertices
     * @returns {Object}
     */
    Graph.prototype.getAdjacencyList = function (type) {
        if (type === void 0) { type = 0; }
        var adjList = {};
        var vertices_keys_to_indexes = this.getVerticesKeystoIndices();
        var vertex_keys = Object.keys(vertices_keys_to_indexes);
        var vertex_values = Object.values(vertices_keys_to_indexes);
        var n_vertices = this.getNumVertices();
        // Initialize
        for (var i = 0; i < n_vertices; i += 1) {
            adjList[vertex_values[i]] = [];
        }
        // to-adjacency dictionary
        if (type === 0) {
            var _loop_1 = function (i) {
                var vertex_i = this_1.getVertexByKey(vertex_keys[i]);
                var neighbors_i = this_1.getNeighbors(vertex_i);
                var neighbors_index = [];
                neighbors_i.forEach(function (vertex) {
                    if (vertex.getKey() !== undefined
                        || !neighbors_index.includes(vertex.getKey())) {
                        neighbors_index.push(vertices_keys_to_indexes[vertex.getKey()]);
                    }
                });
                adjList[i] = neighbors_index;
            };
            var this_1 = this;
            // Populate
            for (var i = 0; i < n_vertices; i += 1) {
                _loop_1(i);
            }
        }
        else {
            // to-adjacency dictionary
            var toAdjList = this.getAdjacencyList(0);
            var vertex_i = -1;
            var vertex_ij = -1;
            var toAdjList_i = [];
            for (var i = 0; i < n_vertices; i += 1) {
                vertex_i = vertex_values[i];
                toAdjList_i = toAdjList[vertex_i];
                for (var j = 0; j < toAdjList_i.length; j += 1) {
                    vertex_ij = toAdjList_i[j];
                    adjList[vertex_ij].push(vertex_i);
                }
            }
        }
        return adjList;
    };
    /**
     * @abstract Return an object that represents:
     * - type = 0: the out-degree of each vertex
     * - type = 1: the in-degree of each vertex
     * @param {Integer} type
     * @return {object}
     */
    Graph.prototype.getInOutDegreeList = function (type) {
        if (type === void 0) { type = 0; }
        var adjList = this.getAdjacencyList(type);
        return objects_js_1.objectMap(adjList, function (value) { return value.length; });
    };
    /**
     * @abstract looseNodes are vertices without to-nodes
     * @returns {GraphEdge[]}
     */
    Graph.prototype.looseNodes = function () {
        var loose_nodes = [];
        var forward_star = this.getAdjacencyList();
        var n_vertices = this.getNumVertices();
        for (var i = 0; i < n_vertices; i += 1) {
            if (forward_star[i].length === 0) {
                loose_nodes.push(i);
            }
        }
        return loose_nodes;
    };
    /**
     * @abstract orphanNodes are vertices without from-nodes
     * @returns {GraphEdge[]}
     */
    Graph.prototype.orphanNodes = function () {
        var orphan_nodes = [];
        var inverse_star = this.getAdjacencyList(1);
        var n_vertices = this.getNumVertices();
        for (var i = 0; i < n_vertices; i += 1) {
            if (inverse_star[i].length === 0) {
                orphan_nodes.push(i);
            }
        }
        return orphan_nodes;
    };
    Graph.prototype.getVerticesNeighbours = function (vertices_indices) {
        var forward_star = this.getAdjacencyList(0);
        var reverse_star = this.getAdjacencyList(1);
        var neighbours = objects_js_1.objectInit(vertices_indices, []);
        vertices_indices.forEach(function (vertex_index) {
            neighbours[vertex_index] = lodash_1.default.uniq(lodash_1.default.union(forward_star[vertex_index], reverse_star[vertex_index]));
        });
        return neighbours;
    };
    /**
     * @param {GraphEdge} edge
     * @returns {Graph}
     */
    Graph.prototype.addEdge = function (edge) {
        // Check if edge has been already added.
        if (this.edges[edge.getKey()]) {
            console.warn("Warning: Edge " + edge.getKey() + " has already been added before. Please, choose other key!");
            return;
        }
        this.edges[edge.getKey()] = edge;
        var startVertex = this.getVertexByKey(edge.startVertex.getKey());
        if (edge.startVertex.getKey() === edge.endVertex.getKey()) {
            // Insert start vertex if it wasn't inserted.
            if (startVertex === undefined) {
                this.addVertex(edge.startVertex);
            }
        }
        else {
            var endVertex = this.getVertexByKey(edge.endVertex.getKey());
            // Insert start vertex if it wasn't inserted.
            if (startVertex === undefined) {
                this.addVertex(edge.startVertex);
            }
            // Insert end vertex if it wasn't inserted.
            if (endVertex === undefined) {
                this.addVertex(edge.endVertex);
            }
        }
        // Add edge to the vertices.
        if (this.isDirected) {
            // If graph IS directed then add the edge only to start vertex.
            edge.startVertex.addEdge(edge);
        }
        else {
            // If graph ISN'T directed then add the edge to both vertices.
            edge.startVertex.addEdge(edge);
            edge.endVertex.addEdge(edge);
        }
    };
    /**
     * @param {GraphEdge} seekEdge
     * @returns {boolean}
     */
    Graph.prototype.hasEdge = function (seekEdgeKey) {
        return this.edges[seekEdgeKey] !== undefined;
    };
    /**
     * @param {GraphEdge[]} edges
     * @returns {}
     */
    Graph.prototype.addEdges = function (edges) {
        var _this = this;
        edges.forEach(function (edge) {
            _this.addEdge(edge);
        });
    };
    /**
     * @param {GraphEdge} edge
     */
    Graph.prototype.deleteEdge = function (edge) {
        // Delete edge from the list of edges.
        if (this.edges[edge.getKey()]) {
            delete this.edges[edge.getKey()];
        }
        else {
            console.warn('Warning: Edge not found in graph');
        }
        // Try to find and end start vertices and delete edge from them.
        var startVertex = this.getVertexByKey(edge.startVertex.getKey());
        var endVertex = this.getVertexByKey(edge.endVertex.getKey());
        startVertex.deleteEdge(edge);
        endVertex.deleteEdge(edge);
    };
    /**
     * @param {Array[GraphEdge]} edges
     */
    Graph.prototype.deleteEdges = function (edges) {
        var _this = this;
        edges.forEach(function (edge) {
            _this.deleteEdge(edge);
        });
    };
    /**
     * @param {GraphVertex} startVertex
     * @param {GraphVertex} endVertex
     * @return {(GraphEdge|null)}
     */
    Graph.prototype.findEdge = function (startVertex, endVertex) {
        var vertex = this.getVertexByKey(startVertex.getKey());
        if (!vertex) {
            return undefined;
        }
        return vertex.findEdge(endVertex);
    };
    /**
     * @param {GraphVertex} startVertex
     * @param {GraphVertex} endVertex
     * @return {(GraphEdge|null)}
     */
    Graph.prototype.findEdgeByVertexIndices = function (startVertex_index, endVertex_index) {
        var vertex = this.getVertexByIndex(startVertex_index);
        if (!vertex) {
            return undefined;
        }
        return vertex.findEdge(this.getVertexByIndex(endVertex_index));
    };
    /**
     * @param {GraphVertex} startVertex
     * @param {GraphVertex} endVertex
     * @return {(GraphEdge|null)}
     */
    Graph.prototype.findEdgesByVertexIndicesTuples = function (vertex_indexes_tuples) {
        var _this = this;
        return vertex_indexes_tuples.map(function (vertex_indexes_tuple) { return _this.findEdgeByVertexIndices(vertex_indexes_tuple[0], vertex_indexes_tuple[1]); });
    };
    /**
     * @return {number}
     */
    Graph.prototype.getWeight = function () {
        return this.getAllEdges().reduce(function (weight, graphEdge) { return weight + graphEdge.weight; }, 0);
    };
    Graph.prototype.getForwardDegrees = function () {
        var adjList = this.getAdjacencyList(0);
        return Object
            .values(adjList)
            .map(function (to_neighbours) { return to_neighbours.length; });
    };
    Graph.prototype.getReverseDegrees = function () {
        var adjList = this.getAdjacencyList(1);
        return Object
            .values(adjList)
            .map(function (to_neighbours) { return to_neighbours.length; });
    };
    /**
     * @return {object}
     */
    Graph.prototype.getVerticesKeystoIndices = function () {
        var verticesIndices = {};
        this.getAllVertices().forEach(function (vertex, index) {
            verticesIndices[vertex.getKey()] = index;
        });
        return verticesIndices;
    };
    /**
     * @return {object}
     */
    Graph.prototype.getVerticesIndicestoKeys = function () {
        var keys_to_indices = this.getVerticesKeystoIndices();
        var values = Object.values(keys_to_indices);
        var keys = Object.keys(keys_to_indices);
        var n_vertices = this.getNumVertices();
        var indices_vertices = {};
        for (var i = 0; i < n_vertices; i += 1) {
            indices_vertices[values[i]] = keys[i];
        }
        return indices_vertices;
    };
    /**
     * @return {GraphVertex}
     */
    Graph.prototype.getVertexIndex = function (vertex) {
        var verticesIndices = this.getVerticesKeystoIndices();
        return verticesIndices[vertex.getKey()];
    };
    /**
     * @return {*[][]}
     */
    Graph.prototype.getAdjacencyMatrix = function () {
        var _this = this;
        var vertices = this.getAllVertices();
        var verticesIndices = this.getVerticesKeystoIndices();
        // Init matrix with infinities meaning that there is no ways of
        // getting from one vertex to another yet.
        var adjacencyMatrix = Array(vertices.length).fill(null).map(function () { return Array(vertices.length).fill(Infinity); });
        // Fill the columns.
        vertices.forEach(function (vertex, vertexIndex) {
            vertex.getNeighbors().forEach(function (neighbor) {
                var neighborIndex = verticesIndices[neighbor.getKey()];
                adjacencyMatrix[vertexIndex][neighborIndex] = _this.findEdge(vertex, neighbor).weight;
            });
        });
        return adjacencyMatrix;
    };
    /**
     * @abstract Reverse all the edges in directed graph.
     * @return {Graph}
     */
    Graph.prototype.reverse = function () {
        var _this = this;
        var is_reversed = {};
        for (var _i = 0, _a = this.getAllEdges(); _i < _a.length; _i++) {
            var edge = _a[_i];
            is_reversed[edge.getKey()] = false;
        }
        if (this.isDirected) {
            /** @param {GraphEdge} edge */
            this.getAllEdges().forEach(function (edge) {
                var edge_key = edge.getKey();
                if (!is_reversed[edge_key]) {
                    // Delete straight edge from graph and from vertices.
                    _this.deleteEdge(edge);
                    // Reverse the edge.
                    edge.reverse();
                    var reversed_edge_key = edge.getKey();
                    if (_this.edges[reversed_edge_key] !== undefined) {
                        var edge_twin = _this.edges[reversed_edge_key];
                        // Delete edge twin from graph and from vertices.
                        _this.deleteEdge(edge_twin);
                        // Reverse edge twin
                        edge_twin.reverse();
                        // Add edge twin
                        _this.addEdge(edge_twin);
                        is_reversed[reversed_edge_key] = true;
                    }
                    // Add reversed edge back to the graph and its vertices.
                    _this.addEdge(edge);
                    is_reversed[edge_key] = true;
                }
            });
        }
        else {
            console.warn('Warning: The reverse of an undirected graph is identical to itself!');
        }
        return this;
    };
    /**
     * @abstract Copy graph
     * @return {Graph}
     */
    Graph.prototype.copy = function () {
        return lodash_1.default.cloneDeep(this);
    };
    /**
     * @returns {Graph} clone of this graph, but undirected
     */
    Graph.prototype.retrieveUndirected = function () {
        var undirected_graph = new Graph(false);
        undirected_graph.addVertices(lodash_1.default.cloneDeep(this.getAllVertices()));
        undirected_graph.addEdges(this.getAllEdges().map(function (edge) { return new GraphEdge_js_1.default(undirected_graph.vertices[edge.startVertex.getKey()], undirected_graph.vertices[edge.endVertex.getKey()], edge.weight); }));
        return undirected_graph;
    };
    /**
     * @abstract Utilitary for isCyclic validator
     * @return {*[][]}
     */
    Graph.prototype. = function (index, visited, recStack) {
        var adjList = this.getAdjacencyList();
        // Mark the current node as visited and part of recursion stack
        if (recStack[index]) {
            return true;
        }
        if (visited[index]) {
            return false;
        }
        visited[index] = true;
        recStack[index] = true;
        var children = adjList[index];
        for (var c = 0; c < children.length; c += 1) {
            if (this..call(this, children[c], visited, recStack)) {
                return true;
            }
        }
        recStack[index] = false;
        return false;
    };
    /**
     * @abstract validates if a graph is cyclic
     * @return {Boolean} is_cyclic
     */
    Graph.prototype.isCyclic = function () {
        // Mark all the vertices as not visited and
        // not part of recursion stack
        var n_vertices = this.getNumVertices();
        var visited = new Array(n_vertices);
        var recStack = new Array(n_vertices);
        for (var i = 0; i < n_vertices; i += 1) {
            visited[i] = false;
            recStack[i] = false;
        }
        // Call the recursive helper function to
        // detect cycle in different DFS trees
        for (var i = 0; i < n_vertices; i += 1) {
            if (this..call(this, i, visited, recStack)) {
                return true;
            }
        }
        return false;
    };
    /**
     * @abstract an utilitary function used by DFS
     * @param {Integer} current_index
     * @param {Array} visited
     * @return {Boolean} is_cyclic
     */
    Graph.prototype.DFSUtil = function (v, visited) {
        var adjList = this.getAdjacencyList();
        // Mark the current node as visited
        visited[v] = true;
        // Recur for all the vertices adjacent to this vertex
        for (var _i = 0, _a = adjList[v]; _i < _a.length; _i++) {
            var i = _a[_i];
            var n = i;
            if (!visited[n]) {
                this.DFSUtil(n, visited);
            }
        }
    };
    /**
     * @abstract returns eulerian walks
     * @return {Array} epath
     */
    Graph.prototype.getEulerianPath = function () {
        var eulerian_path = eulerianPath_js_1.default(this);
        var verticesIndices = this.getVerticesKeystoIndices();
        var epath = [];
        for (var i = 0; i < eulerian_path.length; i += 1) {
            var vertex = eulerian_path[i];
            epath.push(verticesIndices[vertex.label]);
        }
        if (epath.length !== 0) {
            epath.push(epath[0]);
        }
        return epath;
    };
    /**
     * @abstract returns hamiltonian walks
     * @return {Array} hamiltonian_paths
     */
    Graph.prototype.getHamiltonianCycles = function () {
        var _i, _a, hamiltonian_cycle;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = hamiltonianCycle_js_1.default(this);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    hamiltonian_cycle = _a[_i];
                    return [4 /*yield*/, this.convertVerticestoVerticesIndices(hamiltonian_cycle)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    /**
     * @abstract returns true if graph is hamiltonian
     * @return {Array} hamiltonian_paths
     */
    Graph.prototype.isCyclicHamiltonian = function () {
        var cycles = [];
        for (var _i = 0, _a = hamiltonianCycle_js_1.default(this); _i < _a.length; _i++) {
            var hamiltonian_cycle = _a[_i];
            if (hamiltonian_cycle !== undefined) {
                cycles.push(hamiltonian_cycle);
                break;
            }
        }
        return cycles.length !== 0;
    };
    /**
     * @abstract returns strongly connected components (vertes-sets with possible
     * from-to paths)
     * @return {Array} SC_components
     */
    Graph.prototype.getStronglyConnectedComponents = function () {
        var SC_sets = stronglyConnectedComponents_js_1.default(this);
        var verticesIndices = this.getVerticesKeystoIndices();
        var SC_set_by_index = [];
        var SC_sets_by_index = [];
        for (var i = 0; i < SC_sets.length; i += 1) {
            var SC_set = SC_sets[i];
            SC_set_by_index = [];
            for (var j = 0; j < SC_set.length; j += 1) {
                var vertex = SC_set[j];
                SC_set_by_index.push(verticesIndices[vertex.label]);
            }
            SC_sets_by_index.push(SC_set_by_index);
        }
        return SC_sets_by_index;
    };
    /**
     * @abstract returns an object with key as SCC index and value as vertices indices
     * @return {Array} SC_components
     */
    Graph.prototype.getStronglyConnectedComponentsIndices = function () {
        var SCC = this.getStronglyConnectedComponents();
        return objects_js_1.objectMap(objects_js_1.objectInit(lodash_1.default.range(SCC.length), []), function (key, value) { return SCC[Number(key)]; });
    };
    Graph.prototype.getMapSCCToBindingPoints = function () {
        var binding_points = this.bindingPoints();
        var SCC_indices = this.getStronglyConnectedComponentsIndices();
        SCC_indices = objects_js_1.objectMap(SCC_indices, function (key, SCC_vertices) { return SCC_vertices.filter(function (SCC_vertex_id) { return binding_points.includes(SCC_vertex_id); }); });
        return SCC_indices;
    };
    /**
     * @abstract returns true if there is only one component on the graph
     * @return {Boolean} is_connected
     */
    Graph.prototype.isConnected = function () {
        return this.retrieveUndirected().getStronglyConnectedComponents().length === 1;
    };
    /**
     * @abstract returns true if graph is strongly connected
     * @return {Boolean} is_strongly_connected
     */
    Graph.prototype.isStronglyConnected = function () {
        var n_vertices = this.getNumVertices();
        // Step 1: Mark all the vertices as not visited (For
        // first DFS)
        var visited = new Array(this.V);
        for (var i = 0; i < n_vertices; i += 1) {
            visited[i] = false;
        }
        // Step 2: Do DFS traversal starting from the first vertex.
        this.DFSUtil(0, visited);
        // If DFS traversal doesn't visit all vertices, then return false.
        for (var i = 0; i < n_vertices; i += 1) {
            if (visited[i] === false) {
                return false;
            }
        }
        // Step 3: Create a reversed graph
        var gr = this.copy();
        if (this.isDirected) {
            gr.reverse();
        }
        // Step 4: Mark all the vertices as not visited (For second DFS)
        for (var i = 0; i < n_vertices; i += 1) {
            visited[i] = false;
        }
        // Step 5: Do DFS for reversed graph starting from first vertex.
        // Starting Vertex must be same starting point of first DFS
        gr.DFSUtil(0, visited);
        // If all vertices are not visited in second DFS, then
        // return false
        for (var i = 0; i < n_vertices; i += 1) {
            if (visited[i] === false) {
                return false;
            }
        }
        return true;
    };
    /**
     * @abstract returns one of the following values
     *  If the graph is directed:
     *    0 --> If graph is not Eulerian
     *    1 --> If graph has an Euler path (Semi-Eulerian)
     *    2 --> If graph has an Euler Circuit (Eulerian)
     *  If the graph is undirected:
     *    false --> If graph is not Eulerian
     *    true  --> If graph has an Euler Circuit (Eulerian)
     * @return {Boolean} is_eulerian
     */
    Graph.prototype.isEulerian = function () {
        var adjList = this.getAdjacencyList();
        var reverse_star = this.getAdjacencyList(1);
        var n_vertices = this.getNumVertices();
        // Check if all non-zero degree vertices are connected
        if (this.isDirected) {
            // Check if in degree and out degree of every vertex is same
            for (var i = 0; i < n_vertices; i += 1) {
                if (adjList[i].length !== reverse_star[i].length) {
                    return false;
                }
            }
            return true;
        }
        // Check if all non-zero degree vertices are connected
        if (this.isConnected() === false) {
            return 0;
        }
        // Count vertices with odd degree
        var odd = 0;
        for (var i = 0; i < n_vertices; i += 1) {
            if (adjList[i].length % 2 != 0) {
                odd += 1;
            }
        }
        // If count is more than 2, then graph is not Eulerian
        if (odd > 2) {
            return 0;
        }
        // If odd count is 2, then semi-eulerian.
        // If odd count is 0, then eulerian
        // Note: An odd count can never be 1 for undirected graph
        return (odd === 2) ? 1 : 2;
    };
    /**
     * @abstract returns true for an eulerian cycle
     * @return {Boolean} is_eulerian_cycle
     */
    Graph.prototype.isEulerianCycle = function () {
        var num_vertices = this.getNumVertices();
        var forward_star = this.getAdjacencyList(0);
        var reverse_star = this.getAdjacencyList(1);
        // Check if in degree and out degree of every vertex is same
        for (var i = 0; i < num_vertices; i += 1) {
            if (forward_star[i].length !== reverse_star[i].length) {
                return false;
            }
        }
        return true;
    };
    /**
     * @abstract returns true if the graph may be bipartite
     * @return {Boolean} is_eulerian_cycle
     */
    Graph.prototype.isBipartite = function () {
        var num_vertices = this.getNumVertices();
        var adjList = this.getAdjacencyList();
        // vector to store colour of vertex assigning all to -1 i.e. uncoloured
        // colours are either 0 or 1 for understanding take 0 as red and 1 as blue
        var col = new Array(num_vertices);
        for (var i = 0; i < num_vertices; i++) {
            col[i] = -1;
        }
        // queue for BFS storing {vertex , colour}
        var q = [];
        // loop incase graph is not connected
        for (var i = 0; i < num_vertices; i++) {
            // if not coloured
            if (col[i] == -1) {
                // colouring with 0 i.e. red
                q.push({ first: i, second: 0 });
                col[i] = 0;
                while (q.length != 0) {
                    var p = q[0];
                    q.shift();
                    // current vertex
                    var v = p.first;
                    // colour of current vertex
                    var c = p.second;
                    // traversing vertexes connected to current vertex
                    for (var _i = 0, _a = adjList[v]; _i < _a.length; _i++) {
                        var j = _a[_i];
                        // if already coloured with parent vertex color
                        // then bipartite graph is not possible
                        if (col[j] == c) {
                            return false;
                        }
                        // if uncoloured
                        if (col[j] == -1) {
                            // colouring with opposite color to that of parent
                            col[j] = (c == 1) ? 0 : 1;
                            q.push({ first: j, second: col[j] });
                        }
                    }
                }
            }
        }
        // if all vertexes are coloured such that
        // no two connected vertex have same colours
        return true;
    };
    /**
     * @abstract find all bridges. It uses recursive function bridgeUtil()
     * @return {Array}
     */
    Graph.prototype.bridges = function (undirect) {
        if (undirect === void 0) { undirect = false; }
        var bridges = graphBridges_js_1.default(undirect ? this.retrieveUndirected() : this);
        var vertices_keys_to_indices = this.getVerticesKeystoIndices();
        return Object.values(bridges).map(function (bridge_edge) { return [
            vertices_keys_to_indices[bridge_edge.startVertex.getKey()],
            vertices_keys_to_indices[bridge_edge.endVertex.getKey()],
        ]; });
    };
    /**
     * @abstract returns a map from bridge-ends to from-to bridge end object
     * @return {Array}
     */
    Graph.prototype.getBridgeEndIODict = function () {
        var bridges = this.bridges(true);
        var bridge_keys = lodash_1.default.uniq(lodash_1.default.flatten(bridges));
        var forward_star = this.getAdjacencyList(0);
        var inverse_star = this.getAdjacencyList(1);
        var neighbours = [];
        bridge_keys.forEach(function (bridgeEnd) {
        });
        return objects_js_1.objectReduce(bridge_keys, function (bridge_dict, __, bridge_end_key) {
            neighbours = lodash_1.default.remove(lodash_1.default.flatten(bridges.filter(function (bridge) { return bridge.includes(bridge_end_key); })), function (elem) { return elem !== bridge_end_key; });
            bridge_dict[bridge_end_key] = {
                to: neighbours.filter(function (neighbour) { return forward_star[bridge_end_key].includes(neighbour); }),
                from: neighbours.filter(function (neighbour) { return inverse_star[bridge_end_key].includes(neighbour); }),
            };
            return bridge_dict;
        }, {});
    };
    /**
     * @abstract returns a map from island id to object with its bridge ends and inner vertices
     * @return {object}
     */
    Graph.prototype.islands = function () {
        var graph_copy = this.copy();
        var undirected_bridges = this.bridges(true);
        var bridge_ends = lodash_1.default.uniq(lodash_1.default.flatten(undirected_bridges));
        var bridge_edges = graph_copy.findEdgesByVertexIndicesTuples(undirected_bridges);
        // Remove bridges to obtain strongly connected components
        graph_copy.deleteEdges(bridge_edges);
        // Dictionary with islads
        var islands_dict = graph_copy.retrieveUndirected().getStronglyConnectedComponentsIndices();
        return objects_js_1.objectMap(islands_dict, function (key, habitants) { return ({
            bridge_ends: arrays_js_1.sort(habitants.filter(function (habitant) { return bridge_ends.includes(habitant); }), 1),
            inner_vertices: arrays_js_1.sort(habitants.filter(function (habitant) { return !bridge_ends.includes(habitant); }), 1),
        }); });
    };
    /**
     * @abstract returns a map from island id to habitants object
     * @return {object}
     */
    Graph.prototype.islandsHabitants = function () {
        return objects_js_1.objectReduce(this.islands(), function (result, island_id, habitants_) {
            result[island_id] = lodash_1.default.union(habitants_.bridge_ends, habitants_.inner_vertices);
            return result;
        }, {});
    };
    /**
     * @abstract returns an object map from an island id to an array of bridge end indexes
     * @return {Object}
     */
    Graph.prototype.getIslandToBridgeEndList = function () {
        return objects_js_1.objectMap(this.islands(), function (key, habitants) { return habitants.bridge_ends; });
    };
    /**
     * @abstract returns an object map from a bridge end index to an island id
     * @return {Object}
     */
    Graph.prototype.getBridgeEndToIsland = function () {
        return objects_js_1.objectReduce(this.getIslandToBridgeEndList(), function (result, island_id, bridge_ends) {
            bridge_ends.forEach(function (bridge_end) {
                result[bridge_end] = Number(island_id);
            });
            return result;
        }, {});
    };
    /**
     * @abstract returns a map from island id to bridge end id
     * @return {Number}
     */
    Graph.prototype.getIslandFromBridgeEnd = function (bridge_end_index) {
        var index_candidates = objects_js_1.objectKeyFind(this.islands(), function (key, habitants) { return habitants.bridge_ends.includes(bridge_end_index); });
        return Number(index_candidates[0]);
    };
    /**
     * @abstract returns an island map to input-output bridge ends
     * @return {object}
     */
    Graph.prototype.getIslandBridgeEndIODict = function () {
        var bridge_end_io_dict = this.getBridgeEndIODict();
        return objects_js_1.objectReduce(this.islands(), function (result, island_id, habitant_groups) {
            result[island_id] = objects_js_1.objectReduce(habitant_groups.bridge_ends, function (result_, id_, bridge_end_id) {
                if (bridge_end_io_dict[bridge_end_id].from.length !== 0) {
                    result_.target.push(bridge_end_id);
                }
                if (bridge_end_io_dict[bridge_end_id].to.length !== 0) {
                    result_.source.push(bridge_end_id);
                }
                return result_;
            }, { source: [], target: [] });
            return result;
        }, {});
    };
    /**
     * @abstract returns a map from island ids to from-to bridge end ids
     * @return {Array}
     */
    Graph.prototype.getIslandsToFromBridgeEnd = function () {
        var island_bridge_end_list = this.getIslandToBridgeEndList();
        var bridge_end_InOut = this.getBridgeEndIODict();
        var bridges = this.bridges(true);
        var bridge_ends = lodash_1.default.uniq(lodash_1.default.flatten(bridges));
        var forward_star = this.getAdjacencyList(0);
        var reverse_star = this.getAdjacencyList(1);
        var from_to = {};
        return objects_js_1.objectReduce(island_bridge_end_list, function (result, island_id, bridge_ends_) {
            from_to = { from: [], to: [] };
            bridge_ends_.forEach(function (bridge_end) {
                from_to.to = lodash_1.default.uniq(from_to.to.concat(bridge_end_InOut[bridge_end].to));
                from_to.from = lodash_1.default.uniq(from_to.from.concat(bridge_end_InOut[bridge_end].from));
                result[island_id] = from_to;
            });
            return result;
        }, {});
    };
    /**
     * @abstract returns a map from inner island reachibility from vertex to vertex
     * @return {Array}
     */
    Graph.prototype.getIslandInnerReachability = function () {
        var islands = this.islandsHabitants();
        var reachability_list = this.getReachabilityList();
        return objects_js_1.objectReduce(islands, function (result, island_id, habitants) {
            if (habitants.length === 1) {
                var reachables = {};
                reachables[habitants[0]] = [habitants[0]];
                result[island_id] = reachables;
            }
            else {
                result[island_id] = objects_js_1.objectReduce(habitants, function (result_, __, habitant) {
                    result_[habitant] = lodash_1.default.intersection(reachability_list[habitant], habitants);
                    return result_;
                }, {});
            }
            return result;
        }, {});
    };
    /**
     * @abstract returns a map from islands to islands
     * @return {Array}
     */
    Graph.prototype.getIslandIOReachability = function () {
        var reachability_list = this.getReachabilityList();
        return objects_js_1.objectReduce(this.getIslandBridgeEndIODict(), function (result, island_id, habitants) {
            result[island_id] = objects_js_1.objectReduce(habitants.target, function (result_, id_, in_bridge_end) {
                result_[in_bridge_end] = lodash_1.default.intersection(reachability_list[in_bridge_end], habitants.source);
                return result_;
            }, {});
            return result;
        }, {});
    };
    /**
     * @abstract returns a map from islands to islands
     * @return {Array}
     */
    Graph.prototype.getIslandsSubgraphs = function () {
        var _this = this;
        return objects_js_1.objectMap(this.islandsHabitants(), function (island_id, habitants) { return _this.buildSubgraph(habitants); });
    };
    /**
     * @abstract returns a map from islands to islands
     * @return {Array}
     */
    Graph.prototype.getIslandsAdjacencyList = function () {
        var bridge_end_to_island = this.getBridgeEndToIsland();
        return objects_js_1.objectMap(this.getIslandsToFromBridgeEnd(), function (island_id, from_to_dict) { return from_to_dict.to.map(function (to_bridge_end) { return bridge_end_to_island[to_bridge_end]; }); });
    };
    /**
     * @abstract returns a map from islands to from-to islands
     * @return {Array}
     */
    Graph.prototype.getIslandsFromToIslands = function () {
        var bridge_end_to_island = this.getBridgeEndToIsland();
        return objects_js_1.objectMap(this.getIslandsToFromBridgeEnd(), function (island_id, from_to_dict) { return ({
            to: from_to_dict.to.map(function (to_bridge_end) { return bridge_end_to_island[to_bridge_end]; }),
            from: from_to_dict.from.map(function (to_bridge_end) { return bridge_end_to_island[to_bridge_end]; }),
        }); });
    };
    /**
     * @abstract returns an island graph
     * @return {Array}
     */
    Graph.prototype.getIslandGraph = function () {
        var islandAdjList = this.getIslandsAdjacencyList();
        var island_graph = new Graph(this.isDirected);
        island_graph.addEdges(graph_js_1.createEdgesFromVerticesValues(objects_js_1.objectReduce(islandAdjList, function (result, island_id, to_island_ids) {
            to_island_ids.forEach(function (to_island_id) {
                result.push([
                    String(island_id),
                    String(to_island_id),
                ]);
            });
            return result;
        }, [])));
        return island_graph;
    };
    /**
     * @abstract A bridge end is either a bridge head or tail
     * @return {Array}
     */
    Graph.prototype.bridgeEnds = function () {
        return lodash_1.default.uniq(lodash_1.default.flatten(this.bridges()).sort());
    };
    /**
     * @abstract A binding point is either an articulation point or a bridge end
     * @return {Array}
     */
    Graph.prototype.bindingPoints = function () {
        return lodash_1.default.uniq(this.bridgeEnds().concat(this.articulationPoints()));
    };
    /**
     * @abstract find all bridge edges.
     * @return {Array}
     */
    Graph.prototype.getBridgeEdges = function () {
        return this.findEdgesByVertexIndicesTuples(this.bridges());
    };
    /**
    * @abstract Tarjan's algorithm for finding articulation points in graph.
    *
    * @return {Object}
    */
    Graph.prototype.articulationPoints = function () {
        var vertex_key_to_index = this.getVerticesKeystoIndices();
        // Set of vertices we've already visited during DFS.
        var visitedSet = {};
        // Set of articulation points.
        var articulationPointsSet = new Set();
        // Time needed to discover to the current vertex.
        var discoveryTime = 0;
        // Peek the start vertex for DFS traversal.
        var startVertex = this.getAllVertices()[0];
        var dfsCallbacks = {
            /**
             * @param {GraphVertex} currentVertex
             * @param {GraphVertex} previousVertex
             */
            enterVertex: function (_a) {
                var currentVertex = _a.currentVertex, previousVertex = _a.previousVertex;
                // Tick discovery time.
                discoveryTime += 1;
                // Put current vertex to visited set.
                visitedSet[currentVertex.getKey()] = new VisitMetadata_js_1.default({
                    discoveryTime: discoveryTime,
                    lowDiscoveryTime: discoveryTime,
                });
                if (previousVertex) {
                    // Update children counter for previous vertex.
                    visitedSet[previousVertex.getKey()].independentChildrenCount += 1;
                }
            },
            /**
           * @param {GraphVertex} currentVertex
           * @param {GraphVertex} previousVertex
           */
            leaveVertex: function (_a) {
                var currentVertex = _a.currentVertex, previousVertex = _a.previousVertex;
                if (previousVertex === null) {
                    // Don't do anything for the root vertex if it is already current (not previous one)
                    return;
                }
                // Update the low time with the smallest time of adjacent vertices.
                // Get minimum low discovery time from all neighbors.
                /** @param {GraphVertex} neighbor */
                visitedSet[currentVertex.getKey()].lowDiscoveryTime = currentVertex.getNeighbors()
                    .filter(function (earlyNeighbor) { return earlyNeighbor.getKey() !== previousVertex.getKey(); })
                    /**
                     * @param {number} lowestDiscoveryTime
                     * @param {GraphVertex} neighbor
                     */
                    .reduce(function (lowestDiscoveryTime, neighbor) {
                    var neighborLowTime = visitedSet[neighbor.getKey()].lowDiscoveryTime;
                    return neighborLowTime < lowestDiscoveryTime ? neighborLowTime : lowestDiscoveryTime;
                }, visitedSet[currentVertex.getKey()].lowDiscoveryTime);
                // Detect whether previous vertex is articulation point or not.
                // To do so we need to check two [OR] conditions:
                // 1. Is it a root vertex with at least two independent children.
                // 2. If its visited time is <= low time of adjacent vertex.
                if (previousVertex === startVertex) {
                    // Check that root vertex has at least two independent children.
                    if (visitedSet[previousVertex.getKey()].independentChildrenCount >= 2) {
                        var a_point = previousVertex.getKey();
                        articulationPointsSet.add(a_point);
                    }
                }
                else {
                    // Get current vertex low discovery time.
                    var currentLowDiscoveryTime = visitedSet[currentVertex.getKey()].lowDiscoveryTime;
                    // Compare current vertex low discovery time with parent discovery time. Check if there
                    // are any short path (back edge) exists. If we can't get to current vertex other then
                    // via parent then the parent vertex is articulation point for current one.
                    var parentDiscoveryTime = visitedSet[previousVertex.getKey()].discoveryTime;
                    if (parentDiscoveryTime <= currentLowDiscoveryTime) {
                        var a_point = previousVertex.getKey();
                        articulationPointsSet.add(a_point);
                    }
                }
            },
            allowTraversal: function (_a) {
                var nextVertex = _a.nextVertex;
                return !visitedSet[nextVertex.getKey()];
            },
        };
        // Do Depth First Search traversal over submitted graph.
        depthFirstSearch_js_1.default(this, startVertex, dfsCallbacks);
        return __spreadArrays(articulationPointsSet).map(function (elem) { return vertex_key_to_index[elem]; });
    };
    /**
     * @abstract Tarjan method for cycles enumeration
     * Extracted from: https://stackoverflow.com/questions/25898100/enumerating-cycles-in-a-graph-using-tarjans-algorithm
     * @param {Integer} from_index
     * @param {GraphVertex} to_index
     * @return {Array[Array]} cycle
     */
    Graph.prototype. = function (origin_index, curr_index, f, points, marked_stack, marked, is_finish) {
        var adjList = this.getAdjacencyList();
        var n_vertices = this.getNumVertices();
        points.push(curr_index);
        marked_stack.push(curr_index);
        marked[curr_index] = true;
        var w;
        for (var i = 0; i < n_vertices; i += 1) {
            w = adjList[curr_index][i];
            if (w < origin_index) {
                adjList[curr_index].pop(adjList[curr_index][w]);
            }
            else {
                // Cycle (!): Next node is equal do origin
                if (w === origin_index) {
                    var candidate = __spreadArrays(points);
                    // Add cycle candidates if list is empty or
                    // it is not in the list already
                    if (__classPrivateFieldGet(this, _cycles).length === 0) {
                        __classPrivateFieldGet(this, _cycles).push(candidate);
                    }
                    else if (!arrays_js_1.hasElement(__classPrivateFieldGet(this, _cycles), __spreadArrays(points)))
                        __classPrivateFieldGet(this, _cycles).push(candidate);
                    f = true;
                }
                else {
                    //
                    if (marked[w] === false) {
                        this..call(this, origin_index, w, is_finish, points, marked_stack, marked, is_finish);
                    }
                }
            }
        }
        is_finish = f;
        if (is_finish) {
            // Index v is now deleted from mark stacked, and has been called u unmark v
            var u = marked_stack.pop();
            while (u !== curr_index) {
                marked[u] = false;
                u = marked_stack.pop();
            }
            marked[u] = false;
        }
        points.pop(points[curr_index]);
    };
    /**
     * @abstract Returns all cycles within a graph
     *
     * @return {Array[Array]} cycle
     */
    Graph.prototype.cyclicCircuits = function () {
        if (!this.isCyclic()) {
            return [];
        }
        var marked = [];
        var marked_stack = [];
        __classPrivateFieldSet(this, _cycles, []);
        var n_vertices = this.getNumVertices();
        for (var i = 0; i < n_vertices; i += 1) {
            marked.push(false);
        }
        for (var i = 0; i < n_vertices; i += 1) {
            var points = [];
            this..call(this, i, i, false, points, marked_stack, marked);
            while (marked_stack.length > 0) {
                var u = marked_stack.pop();
                marked[u] = false;
            }
        }
        __classPrivateFieldSet(this, _cycles, arrays_js_1.removeArrayDuplicates(__classPrivateFieldGet(this, _cycles).concat(objects_js_1.objectReduce(this.getAdjacencyList(0), function (result, node_id, to_neighbours) {
            if (to_neighbours.includes(Number(node_id))) {
                result.push([Number(node_id)]);
            }
            return result;
        }, []))));
        return __classPrivateFieldGet(this, _cycles);
    };
    /**
     * @abstract returns the graph girph, defined by the smallest cycle length
     *
     * @return {Array[Array]} cycle
     */
    Graph.prototype.girph = function () {
        return Math.min.apply(Math, this.cyclicCircuits().map(function (cycle) { return cycle.length; }));
    };
    /**
     * @abstract returns the in-out volume of certain vertices,
     * defined by the sum of in-out degrees
     * - out: 0
     * - in: 1
     *
     * @return {Array[Array]} cycle
     */
    Graph.prototype.volume = function (vertices_indices, type) {
        if (type === void 0) { type = 0; }
        var degree_list = this.getInOutDegreeList(type);
        return vertices_indices.reduce(function (vol, id_) { return vol + degree_list[id_]; }, 0);
    };
    /**
     * @abstract Returns a dictionary with cycle enumerations
     *
     * @return {object}
     */
    Graph.prototype.getCycleIndices = function (recalculate) {
        if (recalculate === void 0) { recalculate = false; }
        var cycles_indices = {};
        var cycles = [];
        if (__classPrivateFieldGet(this, _cycles).length === 0 || recalculate) {
            cycles = this.cyclicCircuits();
        }
        cycles = __classPrivateFieldGet(this, _cycles);
        for (var i = 0; i < cycles.length; i += 1) {
            cycles_indices[i] = cycles[i];
        }
        return cycles_indices;
    };
    /**
     * @abstract returns a dictionary with extended Venn diagram for cycles
     *
     * @return {object}
     */
    Graph.prototype.getCyclesVenn = function (cycle_indices) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(arrays_js_1.euler(cycle_indices))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    /**
     * @abstract returns a subgraph with vertices indexes specified by input
     *
     * @param {Array} subgraph_vertex_indexes
     * @return {object}
     */
    Graph.prototype.buildSubgraph = function (subgraph_vertex_indexes) {
        // Construct a graph from indices anew
        var subgraph_edges = this.getEdgesByVertexIndexes(subgraph_vertex_indexes, true);
        var new_vertices = {};
        subgraph_edges.forEach(function (edge) {
            var keys_sofar = Object.keys(new_vertices);
            var start_key = edge.startVertex.getKey();
            var end_key = edge.endVertex.getKey();
            if (!keys_sofar.includes(start_key)) {
                new_vertices[start_key] = new GraphVertex_js_1.default(start_key);
            }
            if (!keys_sofar.includes(end_key)) {
                new_vertices[end_key] = new GraphVertex_js_1.default(end_key);
            }
        });
        var new_edges = subgraph_edges.map(function (edge) {
            var start_key = edge.startVertex.getKey();
            var end_key = edge.endVertex.getKey();
            return new GraphEdge_js_1.default(new_vertices[start_key], new_vertices[end_key], edge.weight);
        });
        var subgraph = new Graph(this.isDirected);
        subgraph.addEdges(new_edges);
        return subgraph;
    };
    /**
     * @abstract Returns count of not reachable nodes from vertex v.
     * It uses recursive DFSUtil()
     *
     * @param {Integer} from_vertex_key
     * @return {Integer}
     */
    Graph.prototype.countUnreachebleNodes = function (from_vertex_key) {
        var vertices_keys_to_indices = this.getVerticesKeystoIndices(from_vertex_key);
        var from_vertex_index = vertices_keys_to_indices[from_vertex_key];
        var num_vertices = this.getNumVertices();
        // Mark all the vertices as not visited
        var visited = new Array(num_vertices);
        for (var i = 0; i < num_vertices; i += 1) {
            visited[i] = false;
        }
        // Call the recursive helper function
        // to print DFS traversal
        this.DFSUtil(from_vertex_index, visited);
        // Return count of not visited nodes
        var count = 0;
        for (var i = 0; i < num_vertices; i += 1) {
            if (visited[i] === false) {
                count += 1;
            }
        }
        return count;
    };
    /**
     * @abstract utilitary function to gather reachable nodes
     *
     * @param {Integer} src: source node
     * @param {Integer} visited: visited nodes list
     * @return {Array} reachableNodes
     */
    Graph.prototype. = function (src, visited) {
        var adjList = this.getAdjacencyList();
        // Mark all the vertices as not visited
        // Create a queue for BFS
        // a =  visited
        var queue_ = new Queue_js_1.default();
        queue_.enqueue(src);
        // Assign Component Number
        visited[src] = 1;
        // Vector to store all the reachable
        // nodes from 'src'
        var reachableNodes = [];
        while (queue_.length > 0) {
            // Dequeue a vertex from queue
            var u = queue_.dequeue();
            if ((src !== u) || (src === u && adjList[src].includes(u))) {
                reachableNodes.push(u);
            }
            // Get all adjacent vertices of the dequeued vertex u.
            // If a adjacent has not been visited, then mark it visited and enqueue it
            for (var _i = 0, _a = adjList[u]; _i < _a.length; _i++) {
                var neighbour_id = _a[_i];
                // Assign Component Number to all the  reachable nodes
                if (visited[neighbour_id] === 0) {
                    visited[neighbour_id] = 1;
                    queue_.enqueue(neighbour_id);
                }
            }
        }
        return reachableNodes;
    };
    /**
     * @abstract returns the reachable nodes from some vertex with key vertex_key
     *
     * @param {string} from_vertex_key: source node
     * @return {Array} reachableNodes
     */
    Graph.prototype.reachableNodes = function (from_vertex_key) {
        var vertices_keys_to_indices = this.getVerticesKeystoIndices();
        var from_vertex_id = vertices_keys_to_indices[from_vertex_key];
        var num_vertices = this.getNumVertices();
        var visited = [];
        for (var i = 0; i < num_vertices; i += 1) {
            visited[i] = 0;
        }
        // Get the number of nodes in the graph
        // Map to store list of reachable Nodes for a  given node.
        return this..call(this, from_vertex_id, visited);
    };
    /**
     * @abstract returns the reachability list.
     *  - type := 0 : reachable nodes from vertex id as dict key
     *  - type := 1 : reachable nodes to vertex id as dict key
     * @param {string} type
     * @return {Array} reachableNodes
     */
    Graph.prototype.getReachabilityList = function (type) {
        var _this = this;
        if (type === void 0) { type = 0; }
        var vertices_indices = Object.keys(this.getAdjacencyList());
        var reachability_list = objects_js_1.objectInit(vertices_indices, []);
        var incoming_list = objects_js_1.objectInit(vertices_indices, []);
        vertices_indices.forEach(function (vertex_index) {
            reachability_list[vertex_index] = _this.reachableNodes(_this.convertVerticesIndexestoKeys([vertex_index]));
        });
        if (type == 0) {
            return reachability_list;
        }
        for (var _i = 0, vertices_indices_1 = vertices_indices; _i < vertices_indices_1.length; _i++) {
            var from_vertex_id = vertices_indices_1[_i];
            for (var _a = 0, _b = reachability_list[from_vertex_id]; _a < _b.length; _a++) {
                var to_vertex_id = _b[_a];
                if (!incoming_list[to_vertex_id].includes(Number(from_vertex_id))) {
                    incoming_list[to_vertex_id].push(Number(from_vertex_id));
                }
            }
        }
        return incoming_list;
    };
    /**
     * @abstract returns true if to_vertex_key is reachable from from_vertex_key
     *
     * @param {string} from_vertex_key: source node
     * @param {string} to_vertex_key: destination node
     * @return {Boolean} reachableNodes
     */
    Graph.prototype.isReachable = function (from_vertex_key, to_vertex_key) {
        var vertices_keys_to_indices = this.getVerticesKeystoIndices();
        var to_vertex_id = vertices_keys_to_indices[to_vertex_key];
        var r_nodes_ids = this.reachableNodes(from_vertex_key);
        return r_nodes_ids.includes(to_vertex_id);
    };
    /**
     * @abstract returns true if node predecessor_candidate_key belongs to the
     * list of reverse star list
     *
     * @param {string} from_vertex_key: source node
     * @return {Array} reachableNodes
     */
    Graph.prototype.isPredecessor = function (vertex_key, predecessor_candidate_key) {
        var vertices_keys_to_indices = this.getVerticesKeystoIndices();
        var vertex_id = vertices_keys_to_indices[vertex_key];
        var predecessor_candidate_id = vertices_keys_to_indices[predecessor_candidate_key];
        var reverseStar = this.getAdjacencyList(1);
        return reverseStar[vertex_id].includes(predecessor_candidate_id);
    };
    /**
     * @abstract
     *
     * @param {Integer} from_index           : from-vertex index
     * @param {Integer} to_index             : to-vertex index
     * @param {Array[Boolean]} is_visited    : array with boolean is_visited flags
     * @param {Array} local_path_list        : array with trail sequence
     * @return {Array}
     */
    Graph.prototype. = function (from_index, to_index, is_visited, local_path_list, paths) {
        var adj_list = this.getAdjacencyList();
        var adj_len = adj_list[from_index].length;
        if (from_index === to_index) {
            // Push the discoverred path
            paths.push(__spreadArrays(local_path_list));
            // if match found then no need to traverse more till depth
            return;
        }
        // Mark the current node as visited
        is_visited[from_index] = true;
        // Recur for all the vertices adjacent to current vertex u
        for (var i = 0; i < adj_len; i += 1) {
            var neighbor_i = adj_list[from_index][i];
            var ith_was_visited = is_visited[neighbor_i];
            if (!ith_was_visited) {
                // store current node in path[]
                local_path_list.push(neighbor_i);
                this..call(this, neighbor_i, to_index, is_visited, local_path_list, paths);
                // remove current node  in path[]
                var idx = local_path_list.indexOf(neighbor_i);
                local_path_list.splice(idx, 1);
            }
        }
        // Mark the current node as unvisited
        is_visited[from_index] = false;
    };
    /**
     * @abstract Acyclic paths from from_vertex to to_vertex
     *
     * @param {GraphVertex} from
     * @param {GraphVertex} to
     * @return {Array[Integer]} paths
     */
    Graph.prototype.acyclicPaths = function (from, to) {
        var verticesKeystoIndices = this.getVerticesKeystoIndices();
        var from_index = verticesKeystoIndices[from];
        var to_index = verticesKeystoIndices[to];
        var n_vertices = this.getNumVertices();
        var is_visited = new Array(this.v);
        for (var _i = 0, _a = lodash_1.default.range(n_vertices); _i < _a.length; _i++) {
            var i = _a[_i];
            is_visited[i] = false;
        }
        var path_list = [];
        var paths = [];
        // add source to path[]
        path_list.push(from_index);
        // Call recursive utility
        this..call(this, from_index, to_index, is_visited, path_list, paths);
        return paths;
    };
    /**
     * @abstract AllPaths utilitary function
     *
     * @param {Array} acyclic_path_indexes
     * @param {Array} cycle_nodes_indexes
     * @return {Array[Integer]} allPaths for given acyclic path and
     */
    Graph.prototype. = function (acyclic_path_indexes, cycle_nodes_indexes) {
        var acyclic_path_keys = this.convertVerticesIndexestoKeys(acyclic_path_indexes);
        // Intersection nodes between path and cycle
        var intersect_nodes = lodash_1.default.intersection(acyclic_path_indexes, cycle_nodes_indexes);
        // Forward and reverse list dictionary
        var forward_star = this.getAdjacencyList(0);
        var reverse_star = this.getAdjacencyList(1);
        // Nodes with in- and out- flow nodes
        var inflow_nodes = [];
        var outflow_nodes = [];
        // New routes due cycles
        var new_routes = [];
        // Path length
        var path_len = acyclic_path_indexes.length;
        var path_edges = [];
        for (var i = 0; i < path_len; i += 1) {
            if (i === path_len - 1) {
                break;
            }
            path_edges.push(acyclic_path_keys[i] + "_" + acyclic_path_keys[i + 1]);
        }
        var _loop_2 = function (intersect_node_id) {
            var intersect_node_key = this_2.convertVerticesIndexestoKeys([intersect_node_id]);
            // In case there is an intersection between forward star list
            // regarding the intersection vertex and cycle nodes,
            // than exists edges flowing in or out these vertices.
            // An outflow vertex has edges the do not belong to the acyclic path
            var to_vertices_indexes = lodash_1.default.intersection(forward_star[intersect_node_id], cycle_nodes_indexes);
            var to_edges_candidates = this_2.convertVerticesIndexestoKeys(to_vertices_indexes)
                .map(function (vertex_key) { return intersect_node_key + "_" + vertex_key; });
            var to_edges = lodash_1.default.difference(to_edges_candidates, lodash_1.default.intersection(path_edges, to_edges_candidates));
            if (to_vertices_indexes.length !== 0 && to_edges.length !== 0) {
                outflow_nodes.push(intersect_node_id);
            }
            var from_vertices_indexes = lodash_1.default.intersection(reverse_star[intersect_node_id], cycle_nodes_indexes);
            var from_edges_candidates = this_2.convertVerticesIndexestoKeys(from_vertices_indexes)
                .map(function (vertex_key) { return vertex_key + "_" + intersect_node_key; });
            var from_edges = lodash_1.default.difference(from_edges_candidates, lodash_1.default.intersection(path_edges, from_edges_candidates));
            // An outflow vertex has edges the do not belong to the acyclic path
            if (from_vertices_indexes.length !== 0 && from_edges.length !== 0) {
                inflow_nodes.push(intersect_node_id);
            }
        };
        var this_2 = this;
        // Cycles intercept the main path through in- and out- flow vertices
        for (var _i = 0, intersect_nodes_1 = intersect_nodes; _i < intersect_nodes_1.length; _i++) {
            var intersect_node_id = intersect_nodes_1[_i];
            _loop_2(intersect_node_id);
        }
        // Construct the cycle appendix anew as a graph
        var cycle_subgraph = this.buildSubgraph(cycle_nodes_indexes);
        var subgraph_edges = cycle_subgraph.getAllEdges();
        for (var _a = 0, subgraph_edges_1 = subgraph_edges; _a < subgraph_edges_1.length; _a++) {
            var subgraph_edge = subgraph_edges_1[_a];
            if (path_edges.includes(subgraph_edge.getKey())) {
                cycle_subgraph.deleteEdge(subgraph_edge);
            }
        }
        // New routes may come from out-in flow cyclic paths
        var new_route = [];
        for (var _b = 0, _c = arrays_js_1.cartesianProduct(outflow_nodes, inflow_nodes); _b < _c.length; _b++) {
            var combination = _c[_b];
            var start_node_index = combination[0];
            var finish_node_index = combination[1];
            var startVertex = this.getVertexByIndex(start_node_index);
            var finishVertex = this.getVertexByIndex(finish_node_index);
            for (var _d = 0, _e = cycle_subgraph.allPaths(startVertex, finishVertex); _d < _e.length; _d++) {
                var out_in_flow = _e[_d];
                var out_in_keys = cycle_subgraph.convertVerticesIndexestoKeys(out_in_flow);
                // Nodes of outgoing route MUST only belong to cycle_nodes
                start_node_index = acyclic_path_indexes.indexOf(start_node_index);
                finish_node_index = acyclic_path_indexes.indexOf(finish_node_index);
                var intersec_len = start_node_index === finish_node_index ? 1 : 2;
                var intersection_clause = lodash_1.default.intersection(acyclic_path_keys, out_in_keys).length === intersec_len;
                var finish_precede_start_clause = start_node_index >= finish_node_index;
                var can_increment_route = intersection_clause && finish_precede_start_clause;
                if (can_increment_route) {
                    out_in_flow = this.convertVerticesKeystoIndexes(out_in_keys);
                    new_route = [].concat(acyclic_path_indexes.slice(0, start_node_index + 1), out_in_flow.slice(1, -1), acyclic_path_indexes.slice(finish_node_index));
                    new_routes.push(new_route);
                }
            }
        }
        return new_routes;
    };
    /**
     * @abstract all paths between from and to vertices
     *
     * @param {string} from_key
     * @param {string} to_key
     * @return {Array[Integer]} allPaths for given acyclic path and
     */
    Graph.prototype.allPaths = function (from_key, to_key) {
        if (to_key === void 0) { to_key = from_key; }
        if (!this.isCyclic()) {
            return this.acyclicPaths(from_key, to_key);
        }
        var from_id = this.getVertexIndex(this.vertices[from_key]);
        var acyclic_paths = [];
        if (from_key === to_key) {
            var hamiltonian_cycles = [];
            for (var _i = 0, _a = this.getHamiltonianCycles(); _i < _a.length; _i++) {
                var h_cycle = _a[_i];
                hamiltonian_cycles.push(h_cycle);
            }
            if (hamiltonian_cycles.length === 0) {
                return [];
            }
            return hamiltonian_cycles.map(function (hamiltonian_cycle) {
                var id = arrays_js_1.getAllIndexes(hamiltonian_cycle, from_id);
                id = id[0];
                return hamiltonian_cycle.slice(id).concat(hamiltonian_cycle.slice(0, id)).concat(from_id);
            });
        }
        acyclic_paths = this.acyclicPaths(from_key, to_key);
        var cycle_indices = this.getCycleIndices();
        var cyclic_paths = [];
        if (Object.keys(cycle_indices).length !== 0) {
            var cycle_nodes_arr = [];
            var connected_cycles_indexes = [];
            var acyclic_path = [];
            acyclic_paths = arrays_js_1.removeArrayDuplicates(acyclic_paths);
            // For each acyclic path, it finds if a cyclic connection brings new paths
            for (var path_index in acyclic_paths) {
                acyclic_path = acyclic_paths[path_index];
                var _loop_3 = function (cycles_connection) {
                    connected_cycles_indexes = lodash_1.default.split(cycles_connection[0], ',').map(function (cycle_index) { return Number(cycle_index); });
                    var cycle_nodes = new Set();
                    connected_cycles_indexes.forEach(function (cycle_index) { return cycle_indices[cycle_index].forEach(cycle_nodes.add, cycle_nodes); });
                    cycle_nodes_arr = __spreadArrays(cycle_nodes);
                    var cyclic_paths_i = [];
                    if (lodash_1.default.intersection(acyclic_path, cycle_nodes_arr).length !== 0) {
                        cyclic_paths_i = this_3..call(this_3, acyclic_path, cycle_nodes_arr);
                        cyclic_paths = cyclic_paths.concat(cyclic_paths_i);
                    }
                };
                var this_3 = this;
                for (var _b = 0, _c = this.getCyclesVenn(cycle_indices); _b < _c.length; _b++) {
                    var cycles_connection = _c[_b];
                    _loop_3(cycles_connection);
                }
            }
            cyclic_paths = arrays_js_1.removeArrayDuplicates(cyclic_paths);
        }
        return acyclic_paths.concat(cyclic_paths);
    };
    /**
     * @abstract returns the same graph without edges
     *
     * @return {Graoh} graph
     */
    Graph.prototype.empty = function () {
        this.deleteEdges(this.getAllEdges());
        return this;
    };
    /**
     * @abstract returns true if a graph has no edge
     *
     * @param {Array} chain_candidate
     * @return {Object} nodes_to_cycles
     */
    Graph.prototype.isEmpty = function () {
        return Object.keys(this.edges).length == 0;
    };
    /**
     * @abstract returns true if a indices vertices sequence is a valid chain
     *
     * @param {Array} chain_candidate
     * @return {Object} nodes_to_cycles
     */
    Graph.prototype.isChain = function (chain_candidate) {
        var is_chain = true;
        var adjList = this.getAdjacencyList(0);
        for (var i = 0; i < chain_candidate.length - 1; i += 1) {
            is_chain &= adjList[chain_candidate[i]].includes(chain_candidate[i + 1]);
        }
        return is_chain;
    };
    /**
     * @abstract returns nodes and respective cycles it is within
     *
     * @return {Object} nodes_to_cycles
     */
    Graph.prototype.getVertexCycles = function () {
        var n_vertices = this.getNumVertices();
        var cycles = this.cyclicCircuits();
        var nodes_to_cycles = {};
        for (var i = 0; i < n_vertices; i += 1) {
            nodes_to_cycles[i] = [];
        }
        var cnodes_temp = [];
        for (var i = 0; i < cycles.length; i += 1) {
            cnodes_temp = cnodes_temp.concat(cycles[i]);
        }
        var cyclic_nodes = Array.from(new (Set.bind.apply(Set, __spreadArrays([void 0], [cnodes_temp])))());
        for (var i = 0; i < cyclic_nodes.length; i += 1) {
            var j = cyclic_nodes[i];
            for (var k = 0; k < cycles.length; k += 1) {
                if (cycles[k].includes(j)) {
                    nodes_to_cycles[j].push(cycles[k]);
                }
            }
        }
        return nodes_to_cycles;
    };
    /**
     * @abstract returns a json representation of the current graph
     *
     * @return {Object} graph_json
     */
    Graph.prototype.serialize = function () {
        return {
            isDirected: this.isDirected,
            nodes: this.getAllVertices().map(function (vertex) { return ({
                id: vertex.label,
                value: vertex.value,
            }); }),
            edges: this.getAllEdges().map(function (edge) { return ({
                source: edge.startVertex.label,
                target: edge.endVertex.label,
                weight: edge.weight,
            }); }),
        };
    };
    /**
     * @abstract returns this graph with added vertices and edges
     * @param serialized_graph
     * @return {Graph} this
     */
    Graph.prototype.deserialize = function (graph_json) {
        var _this = this;
        if (graph_json.isDirected !== this.isDirected) {
            throw Error('This direction is different from serialization direction.');
        }
        var vertices = this.getAllVertices();
        this.addVertices(objects_js_1.objectFilter(graph_json.nodes.map(function (node_json) {
            var has_vertex = _this.getVerticesKeys().includes(node_json.id);
            if (!has_vertex) {
                return new GraphVertex_js_1.default(node_json.id, node_json.value);
            }
            return null;
        }), function (key, value) { return value !== null; }));
        this.addEdges(objects_js_1.objectFilter(graph_json.edges.map(function (edge_json) {
            var has_edge = _this.getAllEdgesKeys().includes(edge_json.source + "_" + edge_json.target);
            if (!has_edge) {
                return new GraphEdge_js_1.default(_this.vertices[edge_json.source], _this.vertices[edge_json.target], edge_json.weight);
            }
            return null;
        }), function (key, value) { return value !== null; }));
        return this;
    };
    /**
     * @return {object}
     */
    Graph.prototype.describe = function () {
        var is_cyclic = this.isCyclic();
        var is_eulerian = this.isEulerian();
        return __assign(__assign(__assign(__assign({ vertices: Object.keys(this.vertices).toString(), edges: Object.keys(this.edges).toString(), vertices_keys_to_indices: this.getVerticesKeystoIndices(), adjacency_list: this.getAdjacencyList(), loose_nodes: this.looseNodes(), orphan_nodes: this.orphanNodes(), articulation_nodes: this.articulationPoints(), bridges: this.bridges(true), is_cyclic: is_cyclic }, is_cyclic && { all_cycles: this.cyclicCircuits() }), { is_eulerian: is_eulerian }), is_eulerian && { eulerian_path: this.getEulerianPath() }), { is_connected: this.isConnected() });
    };
    /**
     * @return {Object}
     */
    Graph.prototype.toString = function () {
        return Object.keys(this.edges).toString();
    };
    return Graph;
}());
exports.default = Graph;
_cycles = new WeakMap(), _density = new WeakMap();
