import _ from "lodash";

import Queue from "@data-structures/queue/Queue.js";
import stronglyConnectedComponents from "@algorithms/strongly-connected-components/stronglyConnectedComponents.js";

import eulerianPath from "@algorithms//eulerian-path/eulerianPath.js";
import hamiltonianCycle from "@algorithms//hamiltonian-cycle/hamiltonianCycle.js";

import depthFirstSearch from "@algorithms//depth-first-search/depthFirstSearch.js";
import VisitMetadata from "./VisitMetadata.js";

import graphBridges from "@algorithms//bridges/graphBridges.js";

import {
  cartesianProduct,
  euler,
  removeArrayDuplicates,
  getAllIndexes,
  hasElement,
  sort,
} from "../../utils/arrays/arrays.js";

import { throwError, warn } from "../../utils/sys/sys.js";

import { createEdgesFromVerticesValues } from "./utils/graph.js";

import {
  objectInit,
  objectMap,
  objectFilter,
  objectKeyFind,
  objectReduce,
} from "../../utils/objects/objects.js";

import GraphVertex from "./GraphVertex.js";
import GraphEdge from "./GraphEdge.js";

export default class Graph {
  #cycles;

  #density;

  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false) {
    this.vertices = {};
    this.edges = {};
    this.isDirected = isDirected;
    this.#cycles = [];
    this.#density = 0;
  }

  /**
   * @returns {Array} Graph cycles
   */
  get cycles() {
    return this.cyclicCircuits();
  }

  /**
   * @returns {} Graph density defined by number
   * of edges divided by number of possible edges
   */
  get density() {
    const n_vertices = this.getNumVertices();
    const n_dense = (n_vertices / 2) * (n_vertices - 1);
    const n_edges = this.getAllEdges().length;

    this.#density = n_edges / n_dense;

    return this.#density;
  }

  /**
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex) {
    // Check if vertex has been already added.
    if (Object.keys(this.vertices).includes(newVertex.label)) {
      throwError(
        "Vertex has already been added before. Please, choose other key!"
      );
    }

    this.vertices[newVertex.label] = newVertex;
    return this;
  }

  /**
   * @param {GraphVertex} seekVertex
   * @returns {boolean}
   */
  hasVertex(seekVertexKey) {
    return this.vertices[seekVertexKey] !== undefined;
  }

  /**
   * @param {GraphVertex[]} vertices
   * @returns {Graph}
   */
  addVertices(newVertices) {
    newVertices.forEach((vertex) => this.addVertex(vertex));
  }

  /**
   * @param {string} vertexKey
   * @returns GraphVertex
   */
  getVertexByKey(vertexKey) {
    return this.vertices[vertexKey];
  }

  /**
   * @param {integer} vertexIndex
   * @returns GraphVertex
   */
  getVertexByIndex(vertexIndex) {
    const indices_to_vertices = this.getVerticesIndicestoKeys();
    return this.vertices[indices_to_vertices[vertexIndex]];
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {GraphVertex[]}
   */
  getNeighbors(vertex) {
    return vertex.getNeighbors();
  }

  /**
   * @return {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices);
  }

  /**
   * @return {Array[string]}
   */
  getAllVerticesKeys() {
    return Object.keys(this.vertices);
  }

  /**
   * @return {Integer}
   */
  getNumVertices() {
    return this.getAllVertices().length;
  }

  /**
   * @return {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges);
  }

  /**
   * @return {GraphEdge[]}
   */
  getAllEdgesKeys() {
    return Object.keys(this.edges);
  }

  /**
   * @return {Array[string]}
   */
  getVerticesKeys() {
    return Object.keys(this.vertices);
  }

  /**
   * @return {GraphVertex[]}
   */
  getVerticesByKeys(vertex_keys) {
    return vertex_keys.map((vertex_key) => this.vertices[vertex_key]);
  }

  /**
   * @return {GraphVertex[]}
   */
  getVerticesByIndexes(vertex_indexes) {
    const index_to_key = this.getVerticesIndicestoKeys();

    return this.getVerticesByKeys(
      vertex_indexes.map((vertex_index) => index_to_key[vertex_index])
    );
  }

  /**
   * @param {String[]} vertexKeys
   * @returns {GraphEdge[]}
   */
  getEdgesByVertexKeys(vertexKeys, exclusive = false) {
    const edges = this.getAllEdges();

    let operator_fun = () => 42;

    return edges
      .map((edge) => {
        if (exclusive) {
          operator_fun = (left_operand, right_operand) =>
            left_operand && right_operand;
        } else {
          operator_fun = (left_operand, right_operand) =>
            left_operand || right_operand;
        }

        if (
          operator_fun(
            vertexKeys.includes(edge.startVertex.getKey()),
            vertexKeys.includes(edge.endVertex.getKey())
          )
        ) {
          return _.cloneDeep(edge);
        }
        return null;
      })
      .filter((copied_edge) => copied_edge !== null);
  }

  /**
   * @param {String[]} vertexKeys
   * @returns {String[]}
   */
  getEdgesKeysByVertexKeys(vertexKeys, exclusive = false) {
    return this.getEdgesByVertexKeys(vertexKeys, exclusive).map((edge) =>
      edge.getKey()
    );
  }

  /**
   * @param {Array[integer]} chain
   * @returns GraphVertex
   */
  getEdgesFromChain(index_chain) {
    const vertices_indexes_to_keys = this.getVerticesIndicestoKeys();
    const edges = [];

    let from_edge_key = "";
    let to_edge_key = "";

    if (!this.isChain(index_chain)) {
      throwError("Provided chain is not a valid for this graph!");
    } else {
      index_chain.forEach((vertex, index) => {
        from_edge_key = vertices_indexes_to_keys[index_chain[index]];
        to_edge_key = vertices_indexes_to_keys[index_chain[index + 1]];

        if (index !== index_chain.length - 1) {
          edges.push(this.edges[`${from_edge_key}_${to_edge_key}`]);
        }
      });

      return edges;
    }
  }

  /**
   * @param {Array[integer]} vertexIndexes
   * @returns GraphVertex
   */
  getEdgesByVertexIndexes(verticesIndexes, exclusive = false) {
    const vertices_indexes_to_keys = this.getVerticesIndicestoKeys();

    return this.getEdgesByVertexKeys(
      verticesIndexes.map(
        (vertexIndexes) => vertices_indexes_to_keys[vertexIndexes]
      ),
      exclusive
    );
  }

  /**
   * @param {integer} vertexIndex
   * @returns GraphVertex
   */
  convertVerticesIndexestoKeys(vertexIndexes) {
    const vertexKeys = [];
    const vertices_indexes_to_keys = this.getVerticesIndicestoKeys();

    vertexIndexes.forEach((vertexIndex) => {
      vertexKeys.push(vertices_indexes_to_keys[vertexIndex]);
    });

    return vertexKeys;
  }

  /**
   * @param {string} vertexKey
   * @returns GraphVertex
   */
  convertVerticesKeystoIndexes(vertexKeys) {
    const vertexIndexes = [];
    const vertices_keys_to_indexes = this.getVerticesKeystoIndices();

    vertexKeys.forEach((vertexKey) => {
      vertexIndexes.push(vertices_keys_to_indexes[vertexKey]);
    });

    return vertexIndexes;
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Array[Integer]}
   */
  convertEdgeToVerticesIndices(edge) {
    const keys_to_indices = this.getVerticesKeystoIndices();

    return [
      keys_to_indices[edge.startVertex.getKey()],
      keys_to_indices[edge.endVertex.getKey()],
    ];
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Array[Integer]}
   */
  convertEdgesToVerticesIndices(edges) {
    return edges.map((edge) => this.convertEdgeToVerticesIndices(edge));
  }

  /**
   * @param {GraphVertex[]} vertices
   * @returns {String[]}
   */
  convertVerticestoVerticesKeys(vertices) {
    return vertices.map((vertex) => vertex.getKey());
  }

  /**
   * @param {GraphVertex[]} vertices
   * @returns {String[]}
   */
  convertVerticestoVerticesIndices(vertices) {
    return this.convertVerticesKeystoIndexes(
      this.convertVerticestoVerticesKeys(vertices)
    );
  }

  /**
   * @abstract Return adjacency list
   * - type = 0: Forward star
   * - type = 1: Reverse star
   * @param {Integer} vertices
   * @returns {Object}
   */
  getAdjacencyList(type = 0) {
    const adjList = {};
    const vertices_keys_to_indexes = this.getVerticesKeystoIndices();
    const vertex_keys = Object.keys(vertices_keys_to_indexes);
    const vertex_values = Object.values(vertices_keys_to_indexes);
    const n_vertices = this.getNumVertices();

    // Initialize
    for (let i = 0; i < n_vertices; i += 1) {
      adjList[vertex_values[i]] = [];
    }

    // to-adjacency dictionary
    if (type === 0) {
      // Populate
      for (let i = 0; i < n_vertices; i += 1) {
        const vertex_i = this.getVertexByKey(vertex_keys[i]);
        const neighbors_i = this.getNeighbors(vertex_i);

        const neighbors_index = [];
        neighbors_i.forEach((vertex) => {
          if (
            vertex.getKey() !== undefined ||
            !neighbors_index.includes(vertex.getKey())
          ) {
            neighbors_index.push(vertices_keys_to_indexes[vertex.getKey()]);
          }
        });

        adjList[i] = neighbors_index;
      }
    } else {
      // to-adjacency dictionary
      const toAdjList = this.getAdjacencyList(0);

      let vertex_i = -1;
      let vertex_ij = -1;
      let toAdjList_i = [];

      for (let i = 0; i < n_vertices; i += 1) {
        vertex_i = vertex_values[i];
        toAdjList_i = toAdjList[vertex_i];

        for (let j = 0; j < toAdjList_i.length; j += 1) {
          vertex_ij = toAdjList_i[j];

          adjList[vertex_ij].push(vertex_i);
        }
      }
    }

    return adjList;
  }

  /**
   * @abstract Return an object that represents:
   * - type = 0: the out-degree of each vertex
   * - type = 1: the in-degree of each vertex
   * @param {Integer} type
   * @return {object}
   */
  getInOutDegreeList(type = 0) {
    const adjList = this.getAdjacencyList(type);

    return objectMap(adjList, (value) => value.length);
  }

  /**
   * @abstract sinkNodes are vertices without to-nodes
   * @returns {GraphEdge[]}
   */
  sinkNodes() {
    const loose_nodes = [];
    const forward_star = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();

    for (let i = 0; i < n_vertices; i += 1) {
      if (forward_star[i].length === 0) {
        loose_nodes.push(i);
      }
    }

    return loose_nodes;
  }

  /**
   * @abstract sourceNodes are vertices without from-nodes
   * @returns {GraphEdge[]}
   */
  sourceNodes() {
    const orphan_nodes = [];
    const inverse_star = this.getAdjacencyList(1);
    const n_vertices = this.getNumVertices();

    for (let i = 0; i < n_vertices; i += 1) {
      if (inverse_star[i].length === 0) {
        orphan_nodes.push(i);
      }
    }

    return orphan_nodes;
  }

  getVerticesNeighbours(vertices_indices) {
    const forward_star = this.getAdjacencyList(0);
    const reverse_star = this.getAdjacencyList(1);
    const neighbours = objectInit(vertices_indices, []);

    vertices_indices.forEach((vertex_index) => {
      neighbours[vertex_index] = _.uniq(
        _.union(forward_star[vertex_index], reverse_star[vertex_index])
      );
    });

    return neighbours;
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge) {
    // Check if edge has been already added.
    if (this.edges[edge.getKey()]) {
      warn(
        `Edge ${edge.getKey()} has already been added before. Please, choose other key!`
      );
      return;
    }

    this.edges[edge.getKey()] = edge;

    const startVertex = this.getVertexByKey(edge.startVertex.getKey());

    if (edge.startVertex.getKey() === edge.endVertex.getKey()) {
      // Insert start vertex if it wasn't inserted.
      if (startVertex === undefined) {
        this.addVertex(edge.startVertex);
      }
    } else {
      const endVertex = this.getVertexByKey(edge.endVertex.getKey());

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
    } else {
      // If graph ISN'T directed then add the edge to both vertices.
      edge.startVertex.addEdge(edge);
      edge.endVertex.addEdge(edge);
    }
  }

  /**
   * @param {GraphEdge} seekEdge
   * @returns {boolean}
   */
  hasEdge(seekEdgeKey) {
    return this.edges[seekEdgeKey] !== undefined;
  }

  /**
   * @param {GraphEdge[]} edges
   * @returns {}
   */
  addEdges(edges) {
    edges.forEach((edge) => {
      this.addEdge(edge);
    });
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    // Delete edge from the list of edges.
    if (this.edges[edge.getKey()]) {
      delete this.edges[edge.getKey()];
    } else {
      warn("Edge not found in graph");
      return;
    }

    // Try to find and end start vertices and delete edge from them.
    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);
  }

  /**
   * @param {Array[GraphEdge]} edges
   */
  deleteEdges(edges) {
    edges.forEach((edge) => {
      this.deleteEdge(edge);
    });
  }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdge(startVertex, endVertex) {
    const vertex = this.getVertexByKey(startVertex.getKey());

    if (!vertex) {
      return undefined;
    }

    return vertex.findEdge(endVertex);
  }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdgeByVertexIndices(startVertex_index, endVertex_index) {
    const vertex = this.getVertexByIndex(startVertex_index);

    if (!vertex) {
      return undefined;
    }

    return vertex.findEdge(this.getVertexByIndex(endVertex_index));
  }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdgesByVertexIndicesTuples(vertex_indexes_tuples) {
    return vertex_indexes_tuples.map((vertex_indexes_tuple) =>
      this.findEdgeByVertexIndices(
        vertex_indexes_tuple[0],
        vertex_indexes_tuple[1]
      )
    );
  }

  /**
   * @return {number}
   */
  getWeight() {
    return this.getAllEdges().reduce(
      (weight, graphEdge) => weight + graphEdge.weight,
      0
    );
  }

  getForwardDegrees() {
    const adjList = this.getAdjacencyList(0);

    return Object.values(adjList).map((to_neighbours) => to_neighbours.length);
  }

  getReverseDegrees() {
    const adjList = this.getAdjacencyList(1);

    return Object.values(adjList).map((to_neighbours) => to_neighbours.length);
  }

  /**
   * @return {object}
   */
  getVerticesKeystoIndices() {
    const verticesIndices = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * @return {object}
   */
  getVerticesIndicestoKeys() {
    const keys_to_indices = this.getVerticesKeystoIndices();
    const values = Object.values(keys_to_indices);
    const keys = Object.keys(keys_to_indices);
    const n_vertices = this.getNumVertices();

    const indices_vertices = {};

    for (let i = 0; i < n_vertices; i += 1) {
      indices_vertices[values[i]] = keys[i];
    }

    return indices_vertices;
  }

  /**
   * @return {GraphVertex}
   */
  getVertexIndex(vertex) {
    const verticesIndices = this.getVerticesKeystoIndices();
    return verticesIndices[vertex.getKey()];
  }

  /**
   * @return {*[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesKeystoIndices();

    // Init matrix with infinities meaning that there is no ways of
    // getting from one vertex to another yet.
    const adjacencyMatrix = Array(vertices.length)
      .fill(null)
      .map(() => Array(vertices.length).fill(Infinity));

    // Fill the columns.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const neighborIndex = verticesIndices[neighbor.getKey()];

        adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(
          vertex,
          neighbor
        ).weight;
      });
    });

    return adjacencyMatrix;
  }

  /**
   * @abstract Reverse all the edges in directed graph.
   * @return {Graph}
   */
  reverse() {
    const is_reversed = {};
    for (const edge of this.getAllEdges()) {
      is_reversed[edge.getKey()] = false;
    }

    if (this.isDirected) {
      /** @param {GraphEdge} edge */
      this.getAllEdges().forEach((edge) => {
        const edge_key = edge.getKey();

        if (!is_reversed[edge_key]) {
          // Delete straight edge from graph and from vertices.
          this.deleteEdge(edge);

          // Reverse the edge.
          edge.reverse();

          const reversed_edge_key = edge.getKey();

          if (this.edges[reversed_edge_key] !== undefined) {
            const edge_twin = this.edges[reversed_edge_key];

            // Delete edge twin from graph and from vertices.
            this.deleteEdge(edge_twin);

            // Reverse edge twin
            edge_twin.reverse();

            // Add edge twin
            this.addEdge(edge_twin);

            is_reversed[reversed_edge_key] = true;
          }

          // Add reversed edge back to the graph and its vertices.
          this.addEdge(edge);

          is_reversed[edge_key] = true;
        }
      });
    } else {
      warn("The reverse of an undirected graph is identical to itself!");
      return;
    }

    return this;
  }

  /**
   * @abstract Copy graph
   * @return {Graph}
   */
  copy() {
    return _.cloneDeep(this);
  }

  /**
   * @returns {Graph} clone of this graph, but undirected
   */
  retrieveUndirected() {
    const undirected_graph = new Graph(false);

    undirected_graph.addVertices(_.cloneDeep(this.getAllVertices()));

    undirected_graph.addEdges(
      this.getAllEdges().map(
        (edge) =>
          new GraphEdge(
            undirected_graph.vertices[edge.startVertex.getKey()],
            undirected_graph.vertices[edge.endVertex.getKey()],
            edge.weight
          )
      )
    );

    return undirected_graph;
  }

  /**
   * @abstract Utilitary for isCyclic validator
   * @return {*[][]}
   */
  #isCyclicUtil(index, visited, recStack) {
    const adjList = this.getAdjacencyList();

    // Mark the current node as visited and part of recursion stack
    if (recStack[index]) {
      return true;
    }

    if (visited[index]) {
      return false;
    }

    visited[index] = true;
    recStack[index] = true;

    const children = adjList[index];

    for (let c = 0; c < children.length; c += 1) {
      if (this.#isCyclicUtil(children[c], visited, recStack)) {
        return true;
      }
    }

    recStack[index] = false;

    return false;
  }

  /**
   * @abstract validates if a graph is cyclic
   * @return {Boolean} is_cyclic
   */
  isCyclic() {
    // Mark all the vertices as not visited and
    // not part of recursion stack
    const n_vertices = this.getNumVertices();
    const visited = new Array(n_vertices);
    const recStack = new Array(n_vertices);

    for (let i = 0; i < n_vertices; i += 1) {
      visited[i] = false;
      recStack[i] = false;
    }

    // Call the recursive helper function to
    // detect cycle in different DFS trees
    for (let i = 0; i < n_vertices; i += 1) {
      if (this.#isCyclicUtil(i, visited, recStack)) {
        return true;
      }
    }

    return false;
  }

  /**
   * @abstract an utilitary function used by DFS
   * @param {Integer} current_index
   * @param {Array} visited
   * @return {Boolean} is_cyclic
   */
  DFSUtil(v, visited) {
    const adjList = this.getAdjacencyList();

    // Mark the current node as visited
    visited[v] = true;

    // Recur for all the vertices adjacent to this vertex
    for (const i of adjList[v]) {
      const n = i;
      if (!visited[n]) {
        this.DFSUtil(n, visited);
      }
    }
  }

  /**
   * @abstract returns eulerian walks
   * @return {Array} epath
   */
  getEulerianPath() {
    const eulerian_path = eulerianPath(this);
    const verticesIndices = this.getVerticesKeystoIndices();

    const epath = [];

    for (let i = 0; i < eulerian_path.length; i += 1) {
      const vertex = eulerian_path[i];
      epath.push(verticesIndices[vertex.label]);
    }

    if (epath.length !== 0) {
      epath.push(epath[0]);
    }

    return epath;
  }

  /**
   * @abstract returns hamiltonian walks
   * @return {Array} hamiltonian_paths
   */
  *getHamiltonianCycles() {
    for (const hamiltonian_cycle of hamiltonianCycle(this)) {
      yield this.convertVerticestoVerticesIndices(hamiltonian_cycle);
    }
  }

  /**
   * @abstract returns true if graph is hamiltonian
   * @return {Array} hamiltonian_paths
   */
  isCyclicHamiltonian() {
    const cycles = [];

    for (const hamiltonian_cycle of hamiltonianCycle(this)) {
      if (hamiltonian_cycle !== undefined) {
        cycles.push(hamiltonian_cycle);
        break;
      }
    }

    return cycles.length !== 0;
  }

  /**
   * @abstract returns strongly connected components (vertes-sets with possible
   * from-to paths)
   * @return {Array} SC_components
   */
  getStronglyConnectedComponents() {
    const SC_sets = stronglyConnectedComponents(this);

    const verticesIndices = this.getVerticesKeystoIndices();

    let SC_set_by_index = [];
    const SC_sets_by_index = [];

    for (let i = 0; i < SC_sets.length; i += 1) {
      const SC_set = SC_sets[i];

      SC_set_by_index = [];
      for (let j = 0; j < SC_set.length; j += 1) {
        const vertex = SC_set[j];

        SC_set_by_index.push(verticesIndices[vertex.label]);
      }

      SC_sets_by_index.push(SC_set_by_index);
    }

    return SC_sets_by_index;
  }

  /**
   * @abstract returns an object with key as SCC index and value as vertices indices
   * @return {Array} SC_components
   */
  getStronglyConnectedComponentsIndices() {
    const SCC = this.getStronglyConnectedComponents();

    return objectMap(
      objectInit(_.range(SCC.length), []),
      (key, value) => SCC[Number(key)]
    );
  }

  getMapSCCToBindingPoints() {
    const binding_points = this.bindingPoints();
    let SCC_indices = this.getStronglyConnectedComponentsIndices();

    SCC_indices = objectMap(SCC_indices, (key, SCC_vertices) =>
      SCC_vertices.filter((SCC_vertex_id) =>
        binding_points.includes(SCC_vertex_id)
      )
    );

    return SCC_indices;
  }

  /**
   * @abstract returns true if there is only one component on the graph
   * @return {Boolean} is_connected
   */
  isConnected() {
    return (
      this.retrieveUndirected().getStronglyConnectedComponents().length === 1
    );
  }

  /**
   * @abstract returns true if graph is strongly connected
   * @return {Boolean} is_strongly_connected
   */
  isStronglyConnected() {
    const n_vertices = this.getNumVertices();

    // Step 1: Mark all the vertices as not visited (For
    // first DFS)
    const visited = new Array(this.V);
    for (let i = 0; i < n_vertices; i += 1) {
      visited[i] = false;
    }

    // Step 2: Do DFS traversal starting from the first vertex.
    this.DFSUtil(0, visited);

    // If DFS traversal doesn't visit all vertices, then return false.
    for (let i = 0; i < n_vertices; i += 1) {
      if (visited[i] === false) {
        return false;
      }
    }

    // Step 3: Create a reversed graph
    const gr = this.copy();

    if (this.isDirected) {
      gr.reverse();
    }

    // Step 4: Mark all the vertices as not visited (For second DFS)
    for (let i = 0; i < n_vertices; i += 1) {
      visited[i] = false;
    }

    // Step 5: Do DFS for reversed graph starting from first vertex.
    // Starting Vertex must be same starting point of first DFS
    gr.DFSUtil(0, visited);

    // If all vertices are not visited in second DFS, then
    // return false
    for (let i = 0; i < n_vertices; i += 1) {
      if (visited[i] === false) {
        return false;
      }
    }

    return true;
  }

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
  isEulerian() {
    const adjList = this.getAdjacencyList();
    const reverse_star = this.getAdjacencyList(1);
    const n_vertices = this.getNumVertices();

    // Check if all non-zero degree vertices are connected
    if (this.isDirected) {
      // Check if in degree and out degree of every vertex is same
      for (let i = 0; i < n_vertices; i += 1) {
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
    let odd = 0;
    for (let i = 0; i < n_vertices; i += 1) {
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
    return odd === 2 ? 1 : 2;
  }

  /**
   * @abstract returns true for an eulerian cycle
   * @return {Boolean} is_eulerian_cycle
   */
  isEulerianCycle() {
    const num_vertices = this.getNumVertices();
    const forward_star = this.getAdjacencyList(0);
    const reverse_star = this.getAdjacencyList(1);

    // Check if in degree and out degree of every vertex is same
    for (let i = 0; i < num_vertices; i += 1) {
      if (forward_star[i].length !== reverse_star[i].length) {
        return false;
      }
    }

    return true;
  }

  /**
   * @abstract returns true if the graph may be bipartite
   * @return {Boolean} is_eulerian_cycle
   */
  isBipartite() {
    const num_vertices = this.getNumVertices();
    const adjList = this.getAdjacencyList();

    // vector to store colour of vertex assigning all to -1 i.e. uncoloured
    // colours are either 0 or 1 for understanding take 0 as red and 1 as blue
    const col = new Array(num_vertices);
    for (let i = 0; i < num_vertices; i++) {
      col[i] = -1;
    }

    // queue for BFS storing {vertex , colour}
    const q = [];

    // loop incase graph is not connected
    for (let i = 0; i < num_vertices; i++) {
      // if not coloured
      if (col[i] == -1) {
        // colouring with 0 i.e. red
        q.push({ first: i, second: 0 });
        col[i] = 0;

        while (q.length != 0) {
          const p = q[0];
          q.shift();

          // current vertex
          const v = p.first;

          // colour of current vertex
          const c = p.second;

          // traversing vertexes connected to current vertex
          for (const j of adjList[v]) {
            // if already coloured with parent vertex color
            // then bipartite graph is not possible
            if (col[j] == c) {
              return false;
            }

            // if uncoloured
            if (col[j] == -1) {
              // colouring with opposite color to that of parent
              col[j] = c == 1 ? 0 : 1;
              q.push({ first: j, second: col[j] });
            }
          }
        }
      }
    }

    // if all vertexes are coloured such that
    // no two connected vertex have same colours
    return true;
  }

  /**
   * @abstract find all bridges. It uses recursive function bridgeUtil()
   * @return {Array}
   */
  bridges(undirect = false) {
    const bridges = graphBridges(undirect ? this.retrieveUndirected() : this);
    const vertices_keys_to_indices = this.getVerticesKeystoIndices();

    return Object.values(bridges).map((bridge_edge) => [
      vertices_keys_to_indices[bridge_edge.startVertex.getKey()],
      vertices_keys_to_indices[bridge_edge.endVertex.getKey()],
    ]);
  }

  /**
   * @abstract returns a map from bridge-ends to from-to bridge end object
   * @return {Array}
   */
  getBridgeEndIODict() {
    const bridges = this.bridges(true);
    const bridge_keys = _.uniq(_.flatten(bridges));

    const forward_star = this.getAdjacencyList(0);
    const inverse_star = this.getAdjacencyList(1);
    let neighbours = [];

    return objectReduce(
      bridge_keys,
      (bridge_dict, __, bridge_end_key) => {
        neighbours = _.remove(
          _.flatten(
            bridges.filter((bridge) => bridge.includes(bridge_end_key))
          ),
          (elem) => elem !== bridge_end_key
        );

        bridge_dict[bridge_end_key] = {
          to: neighbours.filter((neighbour) =>
            forward_star[bridge_end_key].includes(neighbour)
          ),
          from: neighbours.filter((neighbour) =>
            inverse_star[bridge_end_key].includes(neighbour)
          ),
        };

        return bridge_dict;
      },
      {}
    );
  }

  /**
   * @abstract returns a map from island id to object with its bridge ends and inner vertices
   * @return {object}
   */
  islands() {
    const graph_copy = this.copy();

    const undirected_bridges = this.bridges(true);
    const bridge_ends = _.uniq(_.flatten(undirected_bridges));
    const bridge_edges =
      graph_copy.findEdgesByVertexIndicesTuples(undirected_bridges);

    // Remove bridges to obtain strongly connected components
    graph_copy.deleteEdges(bridge_edges);

    // Dictionary with islads
    const islands_dict = graph_copy
      .retrieveUndirected()
      .getStronglyConnectedComponentsIndices();

    return objectMap(islands_dict, (key, habitants) => ({
      bridge_ends: sort(
        habitants.filter((habitant) => bridge_ends.includes(habitant)),
        1
      ),
      inner_vertices: sort(
        habitants.filter((habitant) => !bridge_ends.includes(habitant)),
        1
      ),
    }));
  }

  /**
   * @abstract returns a map from island id to habitants object
   * @return {object}
   */
  islandsHabitants() {
    return objectReduce(
      this.islands(),
      (result, island_id, habitants_) => {
        result[island_id] = _.union(
          habitants_.bridge_ends,
          habitants_.inner_vertices
        );

        return result;
      },
      {}
    );
  }

  /**
   * @abstract returns an object map from an island id to an array of bridge end indexes
   * @return {Object}
   */
  getIslandToBridgeEndList() {
    return objectMap(this.islands(), (key, habitants) => habitants.bridge_ends);
  }

  /**
   * @abstract returns an object map from a bridge end index to an island id
   * @return {Object}
   */
  getBridgeEndToIsland() {
    return objectReduce(
      this.getIslandToBridgeEndList(),
      (result, island_id, bridge_ends) => {
        bridge_ends.forEach((bridge_end) => {
          result[bridge_end] = Number(island_id);
        });

        return result;
      },
      {}
    );
  }

  /**
   * @abstract returns a map from island id to bridge end id
   * @return {Number}
   */
  getIslandFromBridgeEnd(bridge_end_index) {
    const index_candidates = objectKeyFind(this.islands(), (key, habitants) =>
      habitants.bridge_ends.includes(bridge_end_index)
    );

    return Number(index_candidates[0]);
  }

  /**
   * @abstract returns an island map to input-output bridge ends
   * @return {object}
   */
  getIslandBridgeEndIODict() {
    const bridge_end_io_dict = this.getBridgeEndIODict();

    const islands_io_fun = (result_, id_, bridge_end_id) => {
      if (bridge_end_io_dict[bridge_end_id].from.length !== 0) {
        result_.target.push(bridge_end_id);
      }

      if (bridge_end_io_dict[bridge_end_id].to.length !== 0) {
        result_.source.push(bridge_end_id);
      }

      return result_;
    };

    const island_fun = (result, island_id, habitant_groups) => {
      result[island_id] = objectReduce(
        habitant_groups.bridge_ends,
        islands_io_fun,
        { source: [], target: [] }
      );

      return result;
    };

    return objectReduce(this.islands(), island_fun, {});
  }

  /**
   * @abstract returns a map from island ids to from-to bridge end ids
   * @return {Array}
   */
  getIslandsToFromBridgeEnd() {
    const island_bridge_end_list = this.getIslandToBridgeEndList();
    const bridge_end_InOut = this.getBridgeEndIODict();
    let bridges_iterfun;

    let from_to;

    const fromBridgeToIsland_reduce_fun = (result, island_id, bridge_ends_) => {
      from_to = { from: [], to: [] };

      bridges_iterfun = (bridge_end) => {
        from_to.to = _.uniq(from_to.to.concat(bridge_end_InOut[bridge_end].to));

        from_to.from = _.uniq(
          from_to.from.concat(bridge_end_InOut[bridge_end].from)
        );

        result[island_id] = from_to;
      };

      bridge_ends_.forEach(bridges_iterfun);

      return result;
    };

    return objectReduce(
      island_bridge_end_list,
      fromBridgeToIsland_reduce_fun,
      {}
    );
  }

  /**
   * @abstract returns a map from inner island reachibility from vertex to vertex
   * @return {Array}
   */
  getIslandInnerReachability() {
    const islands = this.islandsHabitants();
    const reachability_list = this.getReachabilityList();

    const innerReachibility_fun = (result, island_id, habitants) => {
      if (habitants.length === 1) {
        const reachables = {};

        reachables[habitants[0]] = [habitants[0]];
        result[island_id] = reachables;
      } else {
        const intersec_fun = (result_, __, habitant) => {
          result_[habitant] = _.intersection(
            reachability_list[habitant],
            habitants
          );
          return result_;
        };

        result[island_id] = objectReduce(habitants, intersec_fun, {});
      }

      return result;
    };

    return objectReduce(islands, innerReachibility_fun, {});
  }

  /**
   * @abstract returns a map from islands to islands
   * @return {Array}
   */
  getIslandIOReachability() {
    const reachability_list = this.getReachabilityList();

    const IO_fun = (result, island_id, habitants) => {
      const from_id_reachibility_fun = (result_, id_, in_bridge_end) => {
        result_[in_bridge_end] = _.intersection(
          reachability_list[in_bridge_end],
          habitants.source
        );

        return result_;
      };

      result[island_id] = objectReduce(
        habitants.target,
        from_id_reachibility_fun,
        {}
      );

      return result;
    };

    return objectReduce(this.getIslandBridgeEndIODict(), IO_fun, {});
  }

  /**
   * @abstract returns a map from islands to islands
   * @return {Array}
   */
  getIslandsSubgraphs() {
    return objectMap(this.islandsHabitants(), (island_id, habitants) =>
      this.buildSubgraph(habitants)
    );
  }

  /**
   * @abstract returns a map from islands to islands
   * @return {Array}
   */
  getIslandsAdjacencyList() {
    const bridge_end_to_island = this.getBridgeEndToIsland();
    const bendToIsland_map_fun = (to_bridge_end) => bridge_end_to_island[to_bridge_end];
    const island_adj_fun = (island_id, from_to_dict) => from_to_dict.to.map(bendToIsland_map_fun);

    return objectMap(this.getIslandsToFromBridgeEnd(), island_adj_fun);
  }

  /**
   * @abstract returns a map from islands to from-to islands
   * @return {Array}
   */
  getIslandsFromToIslands() {
    const bridge_end_to_island = this.getBridgeEndToIsland();

    return objectMap(
      this.getIslandsToFromBridgeEnd(),
      (island_id, from_to_dict) => ({
        to: from_to_dict.to.map(
          (to_bridge_end) => bridge_end_to_island[to_bridge_end]
        ),
        from: from_to_dict.from.map(
          (to_bridge_end) => bridge_end_to_island[to_bridge_end]
        ),
      })
    );
  }

  /**
   * @abstract returns an island graph
   * @return {Array}
   */
  getIslandGraph() {
    const islandAdjList = this.getIslandsAdjacencyList();
    const island_graph = new Graph(this.isDirected);

    island_graph.addEdges(
      createEdgesFromVerticesValues(
        objectReduce(
          islandAdjList,
          (result, island_id, to_island_ids) => {
            to_island_ids.forEach((to_island_id) => {
              result.push([String(island_id), String(to_island_id)]);
            });

            return result;
          },
          []
        )
      )
    );

    return island_graph;
  }

  /**
   * @abstract A bridge end is either a bridge head or tail
   * @return {Array}
   */
  bridgeEnds() {
    return _.uniq(_.flatten(this.bridges()).sort());
  }

  /**
   * @abstract A binding point is either an articulation point or a bridge end
   * @return {Array}
   */
  bindingPoints() {
    return _.uniq(this.bridgeEnds().concat(this.articulationPoints()));
  }

  /**
   * @abstract find all bridge edges.
   * @return {Array}
   */
  getBridgeEdges() {
    return this.findEdgesByVertexIndicesTuples(this.bridges());
  }

  /**
   * @abstract Tarjan's algorithm for finding articulation points in graph.
   *
   * @return {Object}
   */
  articulationPoints() {
    const vertex_key_to_index = this.getVerticesKeystoIndices();

    // Set of vertices we've already visited during DFS.
    const visitedSet = {};

    // Set of articulation points.
    const articulationPointsSet = new Set();

    // Time needed to discover to the current vertex.
    let discoveryTime = 0;

    // Peek the start vertex for DFS traversal.
    const startVertex = this.getAllVertices()[0];

    const dfsCallbacks = {
      /**
       * @param {GraphVertex} currentVertex
       * @param {GraphVertex} previousVertex
       */
      enterVertex: ({ currentVertex, previousVertex }) => {
        // Tick discovery time.
        discoveryTime += 1;

        // Put current vertex to visited set.
        visitedSet[currentVertex.getKey()] = new VisitMetadata({
          discoveryTime,
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
      leaveVertex: ({ currentVertex, previousVertex }) => {
        if (previousVertex === null) {
          // Don't do anything for the root vertex if it is already current (not previous one)
          return;
        }

        // Update the low time with the smallest time of adjacent vertices.
        // Get minimum low discovery time from all neighbors.
        /** @param {GraphVertex} neighbor */
        visitedSet[currentVertex.getKey()].lowDiscoveryTime = currentVertex
          .getNeighbors()
          .filter(
            (earlyNeighbor) =>
              earlyNeighbor.getKey() !== previousVertex.getKey()
          )
          /**
           * @param {number} lowestDiscoveryTime
           * @param {GraphVertex} neighbor
           */
          .reduce((lowestDiscoveryTime, neighbor) => {
            const neighborLowTime =
              visitedSet[neighbor.getKey()].lowDiscoveryTime;
            return neighborLowTime < lowestDiscoveryTime
              ? neighborLowTime
              : lowestDiscoveryTime;
          }, visitedSet[currentVertex.getKey()].lowDiscoveryTime);

        // Detect whether previous vertex is articulation point or not.
        // To do so we need to check two [OR] conditions:
        // 1. Is it a root vertex with at least two independent children.
        // 2. If its visited time is <= low time of adjacent vertex.
        if (previousVertex === startVertex) {
          // Check that root vertex has at least two independent children.
          if (
            visitedSet[previousVertex.getKey()].independentChildrenCount >= 2
          ) {
            const a_point = previousVertex.getKey();

            articulationPointsSet.add(a_point);
          }
        } else {
          // Get current vertex low discovery time.
          const currentLowDiscoveryTime =
            visitedSet[currentVertex.getKey()].lowDiscoveryTime;

          // Compare current vertex low discovery time with parent discovery time. Check if there
          // are any short path (back edge) exists. If we can't get to current vertex other then
          // via parent then the parent vertex is articulation point for current one.
          const parentDiscoveryTime =
            visitedSet[previousVertex.getKey()].discoveryTime;
          if (parentDiscoveryTime <= currentLowDiscoveryTime) {
            const a_point = previousVertex.getKey();

            articulationPointsSet.add(a_point);
          }
        }
      },
      allowTraversal: ({ nextVertex }) => !visitedSet[nextVertex.getKey()],
    };

    // Do Depth First Search traversal over submitted graph.
    depthFirstSearch(this, startVertex, dfsCallbacks);

    return [...articulationPointsSet].map((elem) => vertex_key_to_index[elem]);
  }

  /**
   * @abstract Tarjan method for cycles enumeration
   * Extracted from: https://stackoverflow.com/questions/25898100/enumerating-cycles-in-a-graph-using-tarjans-algorithm
   * @param {Integer} from_index
   * @param {GraphVertex} to_index
   * @return {Array[Array]} cycle
   */
  #tarjanCycleMethod(
    origin_index,
    curr_index,
    finish_recur,
    points,
    marked_stack,
    marked,
    is_finish
  ) {
    const adjList = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();
    let u = {};

    points.push(curr_index);
    marked_stack.push(curr_index);
    marked[curr_index] = true;

    let adj_index;
    for (const i of _.range(n_vertices)) {
      adj_index = adjList[curr_index][i];

      if (adj_index < origin_index) {
        adjList[curr_index].pop(adjList[curr_index][adj_index]);
      } else {
        // Cycle (!): Next node is equal to origin
        if (adj_index === origin_index) {
          const candidate = [...points];

          // Add cycle candidates if list is empty or it is not in the list already
          if (this.#cycles.length === 0) {
            this.#cycles.push(candidate);
          } else if (!hasElement(this.#cycles, [...points])) {
            this.#cycles.push(candidate);
          }

          // Origin index is found
          finish_recur = true;
        } else {
          // Non visited adjacent vertices
          if (marked[adj_index] === false) {
            this.#tarjanCycleMethod(
              origin_index,
              adj_index,
              finish_recur,
              points,
              marked_stack,
              marked,
              is_finish
            );
          }
        }
      }
    }

    is_finish = finish_recur;
    if (is_finish) {
      // Index v is now deleted from mark stacked, and has been called u unmark v
      u = marked_stack.pop();

      while (u !== curr_index) {
        marked[u] = false;
        u = marked_stack.pop();
      }

      marked[u] = false;
    }

    points.pop(points[curr_index]);
  }

  /**
   * @abstract Returns all cycles within a graph
   *
   * @return {Array[Array]} cycle
   */
  cyclicCircuits() {
    if (!this.isCyclic()) {
      return [];
    }

    const marked = [];
    const marked_stack = [];
    this.#cycles = [];
    const n_vertices = this.getNumVertices();

    for (let i = 0; i < n_vertices; i += 1) {
      marked.push(false);
    }

    for (let i = 0; i < n_vertices; i += 1) {
      const points = [];
      this.#tarjanCycleMethod(i, i, false, points, marked_stack, marked);

      while (marked_stack.length > 0) {
        const u = marked_stack.pop();
        marked[u] = false;
      }
    }

    this.#cycles = removeArrayDuplicates(
      this.#cycles.concat(
        objectReduce(
          this.getAdjacencyList(0),
          (result, node_id, to_neighbours) => {
            if (to_neighbours.includes(Number(node_id))) {
              result.push([Number(node_id)]);
            }

            return result;
          },
          []
        )
      )
    );

    return this.#cycles;
  }

  /**
   * @abstract returns the graph girph, defined by the smallest cycle length
   *
   * @return {Array[Array]} cycle
   */
  girph() {
    return Math.min(...this.cyclicCircuits().map((cycle) => cycle.length));
  }

  /**
   * @abstract returns the in-out volume of certain vertices,
   * defined by the sum of in-out degrees
   * - out: 0
   * - in: 1
   *
   * @return {Array[Array]} cycle
   */
  volume(vertices_indices, type = 0) {
    const degree_list = this.getInOutDegreeList(type);

    return vertices_indices.reduce((vol, id_) => vol + degree_list[id_], 0);
  }

  /**
   * @abstract Returns a dictionary with cycle enumerations
   *
   * @return {object}
   */
  getCycleIndices(recalculate = false) {
    const cycles_indices = {};
    let cycles = [];

    if (this.#cycles.length === 0 || recalculate) {
      cycles = this.cyclicCircuits();
    }

    cycles = this.#cycles;

    for (let i = 0; i < cycles.length; i += 1) {
      cycles_indices[i] = cycles[i];
    }

    return cycles_indices;
  }

  /**
   * @abstract returns a dictionary with extended Venn diagram for cycles
   *
   * @return {object}
   */
  *getCyclesVenn(cycle_indices) {
    yield* euler(cycle_indices);
  }

  /**
   * @abstract returns a subgraph with vertices indexes specified by input
   *
   * @param {Array} subgraph_vertex_indexes
   * @return {object}
   */
  buildSubgraph(subgraph_vertex_indexes) {
    // Construct a graph from indices anew
    const subgraph_edges = this.getEdgesByVertexIndexes(
      subgraph_vertex_indexes,
      true
    );

    const new_vertices = {};
    subgraph_edges.forEach((edge) => {
      const keys_sofar = Object.keys(new_vertices);
      const start_key = edge.startVertex.getKey();
      const end_key = edge.endVertex.getKey();

      if (!keys_sofar.includes(start_key)) {
        new_vertices[start_key] = new GraphVertex(start_key);
      }

      if (!keys_sofar.includes(end_key)) {
        new_vertices[end_key] = new GraphVertex(end_key);
      }
    });

    const new_edges = subgraph_edges.map((edge) => {
      const start_key = edge.startVertex.getKey();
      const end_key = edge.endVertex.getKey();

      return new GraphEdge(
        new_vertices[start_key],
        new_vertices[end_key],
        edge.weight
      );
    });

    const subgraph = new Graph(this.isDirected);

    subgraph.addEdges(new_edges);

    return subgraph;
  }

  /**
   * @abstract Returns count of not reachable nodes from vertex v.
   * It uses recursive DFSUtil()
   *
   * @param {Integer} from_vertex_key
   * @return {Integer}
   */
  countUnreachebleNodes(from_vertex_key) {
    const vertices_keys_to_indices =
      this.getVerticesKeystoIndices(from_vertex_key);
    const from_vertex_index = vertices_keys_to_indices[from_vertex_key];
    const num_vertices = this.getNumVertices();

    // Mark all the vertices as not visited
    const visited = new Array(num_vertices);

    for (let i = 0; i < num_vertices; i += 1) {
      visited[i] = false;
    }

    // Call the recursive helper function
    // to print DFS traversal
    this.DFSUtil(from_vertex_index, visited);

    // Return count of not visited nodes
    let count = 0;
    for (let i = 0; i < num_vertices; i += 1) {
      if (visited[i] === false) {
        count += 1;
      }
    }

    return count;
  }

  /**
   * @abstract utilitary function to gather reachable nodes
   *
   * @param {Integer} src: source node
   * @param {Integer} visited: visited nodes list
   * @return {Array} reachableNodes
   */
  #reachUtil(src, visited) {
    const adjList = this.getAdjacencyList();

    // Mark all the vertices as not visited
    // Create a queue for BFS
    // a =  visited
    const queue_ = new Queue();

    queue_.enqueue(src);

    // Assign Component Number
    visited[src] = 1;

    // Vector to store all the reachable
    // nodes from 'src'
    const reachableNodes = [];

    while (queue_.length > 0) {
      // Dequeue a vertex from queue
      const u = queue_.dequeue();

      if (src !== u || (src === u && adjList[src].includes(u))) {
        reachableNodes.push(u);
      }

      // Get all adjacent vertices of the dequeued vertex u.
      // If a adjacent has not been visited, then mark it visited and enqueue it
      for (const neighbour_id of adjList[u]) {
        // Assign Component Number to all the  reachable nodes
        if (visited[neighbour_id] === 0) {
          visited[neighbour_id] = 1;
          queue_.enqueue(neighbour_id);
        }
      }
    }

    return reachableNodes;
  }

  /**
   * @abstract returns the reachable nodes from some vertex with key vertex_key
   *
   * @param {string} from_vertex_key: source node
   * @return {Array} reachableNodes
   */
  reachableNodes(from_vertex_key) {
    const vertices_keys_to_indices = this.getVerticesKeystoIndices();
    const from_vertex_id = vertices_keys_to_indices[from_vertex_key];

    const num_vertices = this.getNumVertices();
    const visited = [];

    for (let i = 0; i < num_vertices; i += 1) {
      visited[i] = 0;
    }

    // Get the number of nodes in the graph
    // Map to store list of reachable Nodes for a  given node.
    return this.#reachUtil(from_vertex_id, visited);
  }

  /**
   * @abstract returns the reachability list.
   *  - type := 0 : reachable nodes from vertex id as dict key
   *  - type := 1 : reachable nodes to vertex id as dict key
   * @param {string} type
   * @return {Array} reachableNodes
   */
  getReachabilityList(type = 0) {
    const vertices_indices = Object.keys(this.getAdjacencyList());
    const reachability_list = objectInit(vertices_indices, []);
    const incoming_list = objectInit(vertices_indices, []);

    vertices_indices.forEach((vertex_index) => {
      reachability_list[vertex_index] = this.reachableNodes(
        this.convertVerticesIndexestoKeys([vertex_index])
      );
    });

    if (type == 0) {
      return reachability_list;
    }

    for (const from_vertex_id of vertices_indices) {
      for (const to_vertex_id of reachability_list[from_vertex_id]) {
        if (!incoming_list[to_vertex_id].includes(Number(from_vertex_id))) {
          incoming_list[to_vertex_id].push(Number(from_vertex_id));
        }
      }
    }

    return incoming_list;
  }

  /**
   * @abstract returns true if to_vertex_key is reachable from from_vertex_key
   *
   * @param {string} from_vertex_key: source node
   * @param {string} to_vertex_key: destination node
   * @return {Boolean} reachableNodes
   */
  isReachable(from_vertex_key, to_vertex_key) {
    const vertices_keys_to_indices = this.getVerticesKeystoIndices();
    const to_vertex_id = vertices_keys_to_indices[to_vertex_key];
    const r_nodes_ids = this.reachableNodes(from_vertex_key);

    return r_nodes_ids.includes(to_vertex_id);
  }

  /**
   * @abstract returns true if node predecessor_candidate_key belongs to the
   * list of reverse star list
   *
   * @param {string} from_vertex_key: source node
   * @return {Array} reachableNodes
   */
  isPredecessor(vertex_key, predecessor_candidate_key) {
    const vertices_keys_to_indices = this.getVerticesKeystoIndices();

    const vertex_id = vertices_keys_to_indices[vertex_key];
    const predecessor_candidate_id =
      vertices_keys_to_indices[predecessor_candidate_key];

    const reverseStar = this.getAdjacencyList(1);

    return reverseStar[vertex_id].includes(predecessor_candidate_id);
  }

  /**
   * @abstract
   *
   * @param {Integer} from_index           : from-vertex index
   * @param {Integer} to_index             : to-vertex index
   * @param {Array[Boolean]} is_visited    : array with boolean is_visited flags
   * @param {Array} local_path_list        : array with trail sequence
   * @return {Array}
   */
  #recurAcyclicPaths(from_index, to_index, is_visited, local_path_list, paths) {
    const adj_list = this.getAdjacencyList();

    const adj_len = adj_list[from_index].length;

    if (from_index === to_index) {
      // Push the discoverred path
      paths.push([...local_path_list]);

      // if match found then no need to traverse more till depth
      return;
    }

    // Mark the current node as visited
    is_visited[from_index] = true;

    // Recur for all the vertices adjacent to current vertex u
    for (let i = 0; i < adj_len; i += 1) {
      const neighbor_i = adj_list[from_index][i];
      const ith_was_visited = is_visited[neighbor_i];

      if (!ith_was_visited) {
        // store current node in path[]
        local_path_list.push(neighbor_i);

        this.#recurAcyclicPaths(
          neighbor_i,
          to_index,
          is_visited,
          local_path_list,
          paths
        );

        // remove current node  in path[]
        const idx = local_path_list.indexOf(neighbor_i);
        local_path_list.splice(idx, 1);
      }
    }

    // Mark the current node as unvisited
    is_visited[from_index] = false;
  }

  /**
   * @abstract Acyclic paths from from_vertex to to_vertex
   *
   * @param {GraphVertex} from
   * @param {GraphVertex} to
   * @return {Array[Integer]} paths
   */
  acyclicPaths(from, to) {
    const verticesKeystoIndices = this.getVerticesKeystoIndices();

    const from_index = verticesKeystoIndices[from];
    const to_index = verticesKeystoIndices[to];

    const n_vertices = this.getNumVertices();

    const is_visited = new Array(this.v);
    for (const i of _.range(n_vertices)) {
      is_visited[i] = false;
    }

    const path_list = [];
    const paths = [];

    // add source to path[]
    path_list.push(from_index);

    // Call recursive utility
    this.#recurAcyclicPaths(from_index, to_index, is_visited, path_list, paths);

    return paths;
  }

  /**
   * @abstract AllPaths utilitary function
   *
   * @param {Array} acyclic_path_indexes
   * @param {Array} cycle_nodes_indexes
   * @return {Array[Integer]} allPaths for given acyclic path
   */
  #allPathsUtil(acyclic_path_indexes, cycle_nodes_indexes) {
    const acyclic_path_keys =
      this.convertVerticesIndexestoKeys(acyclic_path_indexes);

    // Intersection nodes between path and cycle
    const intersect_nodes = _.intersection(
      acyclic_path_indexes,
      cycle_nodes_indexes
    );

    // Forward and reverse list dictionary
    const forward_star = this.getAdjacencyList(0);
    const reverse_star = this.getAdjacencyList(1);

    // Nodes with in- and out- flow nodes
    const inflow_nodes = [];
    const outflow_nodes = [];

    // New routes due cycles
    const new_routes = [];

    // Path length
    const path_len = acyclic_path_indexes.length;

    const path_edges = [];
    for (let i = 0; i < path_len; i += 1) {
      if (i === path_len - 1) {
        break;
      }

      path_edges.push(`${acyclic_path_keys[i]}_${acyclic_path_keys[i + 1]}`);
    }

    // Cycles intercept the main path through in- and out- flow vertices
    for (const intersect_node_id of intersect_nodes) {
      const intersect_node_key = this.convertVerticesIndexestoKeys([
        intersect_node_id,
      ]);

      // In case there is an intersection between forward star list
      // regarding the intersection vertex and cycle nodes,
      // than exists edges flowing in or out these vertices.

      // An outflow vertex has edges that do not belong to the acyclic path
      const to_vertices_indexes = _.intersection(
        forward_star[intersect_node_id],
        cycle_nodes_indexes
      );
      const to_edges_candidates = this.convertVerticesIndexestoKeys(
        to_vertices_indexes
      ).map((vertex_key) => `${intersect_node_key}_${vertex_key}`);
      const to_edges = _.difference(
        to_edges_candidates,
        _.intersection(path_edges, to_edges_candidates)
      );

      if (to_vertices_indexes.length !== 0 && to_edges.length !== 0) {
        outflow_nodes.push(intersect_node_id);
      }

      // Likewise to inflow vertices
      const from_vertices_indexes = _.intersection(
        reverse_star[intersect_node_id],
        cycle_nodes_indexes
      );
      const from_edges_candidates = this.convertVerticesIndexestoKeys(
        from_vertices_indexes
      ).map((vertex_key) => `${vertex_key}_${intersect_node_key}`);
      const from_edges = _.difference(
        from_edges_candidates,
        _.intersection(path_edges, from_edges_candidates)
      );

      if (from_vertices_indexes.length !== 0 && from_edges.length !== 0) {
        inflow_nodes.push(intersect_node_id);
      }
    }

    // Construct the cycle appendix anew as a graph
    const cycle_subgraph = this.buildSubgraph(cycle_nodes_indexes);

    const subgraph_edges = cycle_subgraph.getAllEdges();

    for (const subgraph_edge of subgraph_edges) {
      if (path_edges.includes(subgraph_edge.getKey())) {
        cycle_subgraph.deleteEdge(subgraph_edge);
      }
    }

    // New routes may come from out-in flow cyclic paths
    let new_route = [];
    for (const combination of cartesianProduct(outflow_nodes, inflow_nodes)) {
      let start_node_index = combination[0];
      let finish_node_index = combination[1];

      const startVertex = this.getVertexByIndex(start_node_index);
      const finishVertex = this.getVertexByIndex(finish_node_index);

      for (let out_in_flow of cycle_subgraph.allPaths(
        startVertex,
        finishVertex
      )) {
        const out_in_keys =
          cycle_subgraph.convertVerticesIndexestoKeys(out_in_flow);

        // Nodes of outgoing route MUST only belong to cycle_nodes
        start_node_index = acyclic_path_indexes.indexOf(start_node_index);
        finish_node_index = acyclic_path_indexes.indexOf(finish_node_index);

        const intersec_len = start_node_index === finish_node_index ? 1 : 2;
        const intersection_clause =
          _.intersection(acyclic_path_keys, out_in_keys).length ===
          intersec_len;
        const finish_precede_start_clause =
          start_node_index >= finish_node_index;

        const can_increment_route =
          intersection_clause && finish_precede_start_clause;

        if (can_increment_route) {
          out_in_flow = this.convertVerticesKeystoIndexes(out_in_keys);

          new_route = [].concat(
            acyclic_path_indexes.slice(0, start_node_index + 1),
            out_in_flow.slice(1, -1),
            acyclic_path_indexes.slice(finish_node_index)
          );
          new_routes.push(new_route);
        }
      }
    }

    return new_routes;
  }

  /**
   * @abstract all paths between from and to vertices
   *
   * @param {string} from_key
   * @param {string} to_key
   * @return {Array[Integer]} allPaths for given acyclic path and
   */
  allPaths(from_key, to_key = from_key) {
    // Acyclic paths for acyclic graph
    if (!this.isCyclic()) {
      return this.acyclicPaths(from_key, to_key);
    }

    const from_id = this.getVertexIndex(this.vertices[from_key]);
    let acyclic_paths = [];

    // Hamiltonian paths
    if (from_key === to_key) {
      const hamiltonian_cycles = [];

      for (const h_cycle of this.getHamiltonianCycles()) {
        hamiltonian_cycles.push(h_cycle);
      }

      if (hamiltonian_cycles.length === 0) {
        return [];
      }

      // Add from index to both ends
      return hamiltonian_cycles.map((hamiltonian_cycle) => {
        let id = getAllIndexes(hamiltonian_cycle, from_id);

        id = id[0];

        return hamiltonian_cycle
          .slice(id)
          .concat(hamiltonian_cycle.slice(0, id))
          .concat(from_id);
      });
    }

    acyclic_paths = this.acyclicPaths(from_key, to_key);

    const cycle_indices = this.getCycleIndices();
    let cyclic_paths = [];

    // Cycles in graph
    if (Object.keys(cycle_indices).length !== 0) {
      let cycle_nodes_arr = [];
      let connected_cycles_indexes = [];
      let acyclic_path = [];

      acyclic_paths = removeArrayDuplicates(acyclic_paths);

      // For each acyclic path, it finds if a cyclic connection brings new paths
      for (const path_index in acyclic_paths) {
        acyclic_path = acyclic_paths[path_index];

        for (const cycles_connection of this.getCyclesVenn(cycle_indices)) {
          connected_cycles_indexes = _.split(cycles_connection[0], ",").map(
            (cycle_index) => Number(cycle_index)
          );

          const cycle_nodes = new Set();
          connected_cycles_indexes.forEach((cycle_index) =>
            cycle_indices[cycle_index].forEach(cycle_nodes.add, cycle_nodes)
          );

          cycle_nodes_arr = [...cycle_nodes];

          let cyclic_paths_i = [];

          if (_.intersection(acyclic_path, cycle_nodes_arr).length !== 0) {
            cyclic_paths_i = this.#allPathsUtil(acyclic_path, cycle_nodes_arr);
            cyclic_paths = cyclic_paths.concat(cyclic_paths_i);
          }
        }
      }

      cyclic_paths = removeArrayDuplicates(cyclic_paths);
    }

    return acyclic_paths.concat(cyclic_paths);
  }

  /**
   * @abstract returns the same graph without edges
   *
   * @return {Graph} graph
   */
  empty() {
    this.deleteEdges(this.getAllEdges());

    return this;
  }

  /**
   * @abstract returns true if a graph has no edge
   *
   * @param {Array} chain_candidate
   * @return {Object} nodes_to_cycles
   */
  isEmpty() {
    return Object.keys(this.edges).length == 0;
  }

  /**
   * @abstract returns true if a indices vertices sequence is a valid chain
   *
   * @param {Array} chain_candidate
   * @return {Object} nodes_to_cycles
   */
  isChain(chain_candidate) {
    let is_chain = true;
    const adjList = this.getAdjacencyList(0);

    for (let i = 0; i < chain_candidate.length - 1; i += 1) {
      is_chain &= adjList[chain_candidate[i]].includes(chain_candidate[i + 1]);
    }

    return Boolean(is_chain);
  }

  /**
   * @abstract returns nodes and respective cycles it is within
   *
   * @return {Object} nodes_to_cycles
   */
  getCycles() {
    const n_vertices = this.getNumVertices();
    const cycles = this.cyclicCircuits();
    const nodes_to_cycles = {};

    for (let i = 0; i < n_vertices; i += 1) {
      nodes_to_cycles[i] = [];
    }

    let cnodes_temp = [];
    for (let i = 0; i < cycles.length; i += 1) {
      cnodes_temp = cnodes_temp.concat(cycles[i]);
    }

    const cyclic_nodes = Array.from(new Set(...[cnodes_temp]));

    for (let i = 0; i < cyclic_nodes.length; i += 1) {
      const j = cyclic_nodes[i];

      for (let k = 0; k < cycles.length; k += 1) {
        if (cycles[k].includes(j)) {
          nodes_to_cycles[j].push(cycles[k]);
        }
      }
    }

    return nodes_to_cycles;
  }

  /**
   * @abstract returns a json representation of the current graph
   *
   * @return {Object} graph_json
   */
  serialize() {
    return {
      isDirected: this.isDirected,
      nodes: this.getAllVertices().map((vertex) => ({
        id: vertex.label,
        value: vertex.value,
      })),
      edges: this.getAllEdges().map((edge) => ({
        source: edge.startVertex.label,
        target: edge.endVertex.label,
        weight: edge.weight,
      })),
    };
  }

  /**
   * @abstract returns this graph with added vertices and edges
   * @param serialized_graph
   * @return {Graph} this
   */
  deserialize(graph_json) {
    if (graph_json.isDirected !== this.isDirected) {
      throwError("This direction is different from serialization direction.");
    } else {
      this.addVertices(
        objectFilter(
          graph_json.nodes.map((node_json) => {
            const has_vertex = this.getVerticesKeys().includes(node_json.id);

            if (!has_vertex) {
              return new GraphVertex(node_json.id, node_json.value);
            }
            return null;
          }),
          (key, value) => value !== null
        )
      );

      this.addEdges(
        objectFilter(
          graph_json.edges.map((edge_json) => {
            const has_edge = this.getAllEdgesKeys().includes(
              `${edge_json.source}_${edge_json.target}`
            );

            if (!has_edge) {
              return new GraphEdge(
                this.vertices[edge_json.source],
                this.vertices[edge_json.target],
                edge_json.weight
              );
            }
            return null;
          }),
          (key, value) => value !== null
        )
      );

      return this;
    }
  }

  /**
   * @return {object}
   */
  describe() {
    const is_cyclic = this.isCyclic();
    const is_eulerian = this.isEulerian();

    return {
      vertices: Object.keys(this.vertices).toString(),
      edges: Object.keys(this.edges).toString(),
      vertices_keys_to_indices: this.getVerticesKeystoIndices(),
      adjacency_list: this.getAdjacencyList(),
      sink_nodes: this.sinkNodes(),
      source_nodes: this.sourceNodes(),
      articulation_nodes: this.articulationPoints(),
      bridges: this.bridges(true),
      is_cyclic,
      ...(is_cyclic && { all_cycles: this.cyclicCircuits() }),
      is_eulerian,
      ...(is_eulerian && { eulerian_path: this.getEulerianPath() }),
      is_connected: this.isConnected(),
    };
  }

  /**
   * @return {Object}
   */
  toString() {
    return Object.keys(this.edges).toString();
  }
}
