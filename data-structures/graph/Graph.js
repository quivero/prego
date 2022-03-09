import _ from 'lodash';

import Queue from '../queue/Queue.js';
import stronglyConnectedComponents from '../../algorithms/strongly-connected-components/stronglyConnectedComponents.js';

import eulerianPath from '../../algorithms/eulerian-path/eulerianPath.js';
import hamiltonianCycle from '../../algorithms/hamiltonian-cycle/hamiltonianCycle.js';

import depthFirstSearch from '../../algorithms/depth-first-search/depthFirstSearch.js';
import VisitMetadata from './VisitMetadata.js';

import {
  cartesianProduct,
  extendedVenn,
  removeArrayDuplicates,
  ones,
  getAllIndexes,
} from '../../utils/arrays/arrays.js';

import {
  objectMap,
  initObject
} from '../../utils/objects/objects.js';

import GraphVertex from './GraphVertex.js';
import GraphEdge from './GraphEdge.js';

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
    if (Object.keys(this.vertices).includes(newVertex.value)) {
      throw Error('Vertex has already been added before. Please, choose other key!');
    }

    this.vertices[newVertex.value] = newVertex;
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
   * @return {*[string]}
   */
  getVerticesKeys() {
    return Object.keys(this.vertices);
  }

  /**
   * @return {GraphVertex[]}
   */
  getVerticesByKeys(vertex_keys) {
    return vertex_keys.map(
      (vertex_key) => this.vertices[vertex_key],
    );
  }

  /**
   * @return {GraphVertex[]}
   */
  getVerticesByIndexes(vertex_indexes) {
    const index_to_key = this.getVerticesIndicestoKeys();

    return this.getVerticesByKeys(
      vertex_indexes.map((vertex_index) => index_to_key[vertex_index]),
    );
  }

  /**
   * @param {String[]} vertexKeys
   * @returns {GraphEdge[]}
   */
  getEdgesByVertexKeys(vertexKeys, exclusive = false) {
    const edges_from_keys = [];
    const edges = this.getAllEdges();

    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];

      const startVertexKey = edge.startVertex.getKey();
      const endVertexKey = edge.endVertex.getKey();

      let operator_fun = () => 42;

      if (exclusive) {
        operator_fun = (left_operand, right_operand) => left_operand && right_operand;
      } else {
        operator_fun = (left_operand, right_operand) => left_operand || right_operand;
      }

      if (operator_fun(vertexKeys.includes(startVertexKey), vertexKeys.includes(endVertexKey))) {
        edges_from_keys.push(_.cloneDeep(edge));
      }
    }

    return edges_from_keys;
  }

  /**
   * @param {String[]} vertexKeys
   * @returns {String[]}
   */
  getEdgesKeysByVertexKeys(vertexKeys, exclusive = false) {
    return this.getEdgesByVertexKeys(vertexKeys, exclusive).map(
      (edge) => edge.getKey(),
    );
  }

  /**
   * @param {Array[integer]} vertexIndexes
   * @returns GraphVertex
   */
  getEdgesByVertexIndexes(vertexIndexes, exclusive = false) {
    const vertexKeys = [];
    const vertices_indexes_to_keys = this.getVerticesIndicestoKeys();

    vertexIndexes.forEach((vertexIndex) => {
      vertexKeys.push(vertices_indexes_to_keys[vertexIndex]);
    });

    return this.getEdgesByVertexKeys(vertexKeys, exclusive);
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
   * @param {GraphVertex[]} vertices
   * @returns {String[]}
   */
  convertVerticestoVerticesKeys(vertices) {
    return vertices.map(
      (vertex) => vertex.getKey(),
    );
  }

  /**
   * @param {GraphVertex[]} vertices
   * @returns {String[]}
   */
  convertVerticestoVerticesIndices(vertices) {
    return this.convertVerticesKeystoIndexes(
      this.convertVerticestoVerticesKeys(vertices),
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
        neighbors_i.forEach(
          (vertex) => {
            if (vertex.getKey() !== undefined
               || !neighbors_index.includes(vertex.getKey())) {
              neighbors_index.push(vertices_keys_to_indexes[vertex.getKey()]);
            }
          },
        );

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
    const adjList = getAdjacencyList(type);

    return objectMap(adjList, (value) => value.length);
  }

  /**
   * @abstract looseNodes are vertices without to-nodes
   * @returns {GraphEdge[]}
   */
  looseNodes() {
    const loose_nodes = [];
    const adjList = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();

    for (let i = 0; i < n_vertices; i += 1) {
      if (adjList[i].length === 0) {
        loose_nodes.push(i);
      }
    }

    return loose_nodes;
  }

  /**
   * @abstract orphanNodes are vertices without from-nodes
   * @returns {GraphEdge[]}
   */
  orphanNodes() {
    const orphan_nodes = [];
    const adjList = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();

    const to_vertices = new Set();

    for (let i = 0; i < n_vertices; i += 1) {
      const neighbors = adjList[i];
      for (let j = 0; j < neighbors.length; j += 1) {
        to_vertices.add(neighbors[j]);
      }
    }

    this.getAllVertices().forEach((vertex) => {
      const vertex_index = this.getVertexIndex(vertex);

      if (!to_vertices.has(vertex_index)) {
        orphan_nodes.push(vertex_index);
      }
    });

    return orphan_nodes;
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge) {
    // Check if edge has been already added.
    if (this.edges[edge.getKey()]) {
      console.warn('Warning: Edge has already been added before. Please, choose other key!');
      return;
    }

    this.edges[edge.getKey()] = edge;

    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    // Insert start vertex if it wasn't inserted.
    if (startVertex === undefined) {
      this.addVertex(edge.startVertex);
    }

    // Insert end vertex if it wasn't inserted.
    if (endVertex === undefined) {
      this.addVertex(edge.endVertex);
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
      console.warn('Warning: Edge not found in graph');
    }

    // Try to find and end start vertices and delete edge from them.
    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);
  }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdge(startVertex, endVertex) {
    const vertex = this.getVertexByKey(startVertex.getKey());

    if (!vertex) {
      return null;
    }

    return vertex.findEdge(endVertex);
  }

  /**
   * @return {number}
   */
  getWeight() {
    return this.getAllEdges().reduce((weight, graphEdge) => weight + graphEdge.weight, 0);
  }

  getForwardDegrees() {
    const adjList = this.getAdjacencyList(0);

    return Object
      .values(adjList)
      .map((to_neighbours) => to_neighbours.length);
  }

  getReverseDegrees() {
    const adjList = this.getAdjacencyList(1);

    return Object
      .values(adjList)
      .map((to_neighbours) => to_neighbours.length);
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
    const adjacencyMatrix = Array(vertices.length).fill(null).map(
      () => Array(vertices.length).fill(Infinity),
    );

    // Fill the columns.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const neighborIndex = verticesIndices[neighbor.getKey()];

        adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(vertex, neighbor).weight;
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
      console.warn('Warning: This is an UNDIRECTED graph!');
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
    const edges = this.getAllEdges();

    for (let i = 0; i < edges.length; i += 1) {
      undirected_graph.addEdge(_.cloneDeep(edges[i]));
    }

    return undirected_graph;
  }

  /**
   * @abstract Utilitary for isCyclic validator
   * @return {*[][]}
   */
  #isCyclicUtil(index, visited, recStack) {
    const adjList = this.getAdjacencyList();

    // Mark the current node as visited and part of recursion stack
    if (recStack[index]) { return true; }

    if (visited[index]) { return false; }

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
      if (!visited[n]) { this.DFSUtil(n, visited); }
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
      epath.push(verticesIndices[vertex.value]);
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
  getHamiltonianCycles() {
    const hamiltonian_cycles = hamiltonianCycle(this);

    return hamiltonian_cycles.map(
      (hamiltonian_cycle) => this.convertVerticesKeystoIndexes(
        this.convertVerticestoVerticesKeys(hamiltonian_cycle),
      ),
    );
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

        SC_set_by_index.push(verticesIndices[vertex.value]);
      }

      SC_sets_by_index.push(SC_set_by_index);
    }

    return SC_sets_by_index;
  }

  /**
   * @abstract checks if all non-zero degree vertices are
   * connected. It mainly does DFS traversal starting from all vertices  
   * @return {Boolean} is_connected
   */
  isConnected() {
    const n_vertices = this.getNumVertices();
    const adjList = this.getAdjacencyList();
    const edges = this.getAllEdges();

    // If there are no edges in the graph, return false
    if (edges.length === 0) {
      return false;
    }

    // Mark all the vertices as not visited
    const visited = new Array(n_vertices);
    for (let i = 0; i < n_vertices; i += 1) {
      visited[i] = false;
    }

    const forward_degrees = this.getForwardDegrees();
    const reverse_degrees = this.getReverseDegrees();

    const summedDegrees = [];
    for (let i = 0; i < n_vertices; i += 1) {
      summedDegrees[i] = reverse_degrees[i] + forward_degrees[i];
    }

    const zero_summed_degrees = summedDegrees.filter((summedDegree) => summedDegree === 0);

    if (zero_summed_degrees.length !== 0) { return false; }

    // Find a vertex with non-zero degree
    for (let i = 0; i < n_vertices; i += 1) {
      if (adjList[i].length !== 0) {
        // Start DFS traversal from a vertex with non-zero degree
        this.DFSUtil(i, visited);

        // Check if all non-zero degree vertices are visited
        for (let j = 0; j < n_vertices; j += 1) {
          if (visited[j] === false && adjList[i].length > 0) {
            return false;
          }
        }
      }
    }

    return true;
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
    for (let i = 0; i < n_vertices; i += 1) { visited[i] = false; }

    // Step 2: Do DFS traversal starting from the first vertex.
    this.DFSUtil(0, visited);

    // If DFS traversal doesn't visit all vertices, then return false.
    for (let i = 0; i < n_vertices; i += 1) {
      if (visited[i] === false) { return false; }
    }

    // Step 3: Create a reversed graph
    const gr = this.copy().reverse();

    // Step 4: Mark all the vertices as not visited (For second DFS)
    for (let i = 0; i < n_vertices; i += 1) { visited[i] = false; }

    // Step 5: Do DFS for reversed graph starting from first vertex.
    // Starting Vertex must be same starting point of first DFS
    gr.DFSUtil(0, visited);

    // If all vertices are not visited in second DFS, then
    // return false
    for (let i = 0; i < n_vertices; i += 1) {
      if (visited[i] === false) { return false; }
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
    if (this.isConnected() === false) { return 0; }

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
    return (odd === 2) ? 1 : 2;
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
  isBipartite(){
    let num_vertices = this.getNumVertices();
    let adjList = this.getAdjacencyList()

    // vector to store colour of vertex assigning all to -1 i.e. uncoloured
    // colours are either 0 or 1 for understanding take 0 as red and 1 as blue
    let col = new Array(num_vertices);
    for(let i = 0; i < num_vertices; i++)
        col[i] = -1;
  
    // queue for BFS storing {vertex , colour}
    let q = [];
  
    //loop incase graph is not connected
    for (let i = 0; i < num_vertices; i++) {
      // if not coloured
      if (col[i] == -1) {
        // colouring with 0 i.e. red
        q.push({"first": i, "second": 0});
        col[i] = 0;
      
        while (q.length != 0) {
            let p = q[0];
            q.shift();
          
            //current vertex
            let v = p.first;
            
            // colour of current vertex
            let c = p.second;
              
            // traversing vertexes connected to current vertex
            for (let j of adjList[v]){
                // if already coloured with parent vertex color
                // then bipartite graph is not possible
                if (col[j] == c) {
                  return false;
                }
              
                // if uncoloured
                if (col[j] == -1){
                  // colouring with opposite color to that of parent
                  col[j] = (c==1) ? 0 : 1;
                  q.push({"first": j, "second": col[j]});
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
   * @abstract finds and prints bridges using DFS traversal
   * @param {Integer} u      : The original vertex
   * @param {Integer} v      : --> The vertex to be visited next
   * @param {Array} pre[v]   : order in which dfs examines v
   * @param {Array} low[v]   : lowest preorder of any vertex connected to v
   * @param {Array} parent[] : Stores parent vertices in DFS tree
   */
  bridgesUtil(u, v, preorder, low, counter, bridges) {
    const adjList = this.getAdjacencyList();

    preorder[v] = counter += 1;
    low[v] = preorder[v];

    for (let i = 0; i < adjList[v].length; i += 1) {
      const w = adjList[v][i];
      if (preorder[w] === -1) {
        this.bridgesUtil(v, w, preorder, low, counter, bridges);

        low[v] = Math.min(low[v], low[w]);

        if (low[w] === preorder[w]) {
          bridges.push([v, w]);
        }
      } else {
      // update low number - ignore reverse of edge leading to v

        if (w !== u) { low[v] = Math.min(low[v], preorder[w]); }
      }
    }
  }

  /**
   * @abstract find all bridges. It uses recursive function bridgeUtil()
   * @return {Array}
   */
  bridges() {
    // Mark all the vertices as not visited
    const n_vertices = this.getNumVertices();
    const bridges = [];
    const counter = 0;

    // pre[v]: order in which dfs examines v
    // low[v]: lowest preorder of any vertex connected to v
    const preorder = ones(n_vertices).map((x) => -x);
    const low = ones(n_vertices).map((x) => -x);

    for (const v of _.range(n_vertices)) {
      if (preorder[v] === -1) {
        this.bridgesUtil(v, v, preorder, low, counter, bridges);
      }
    }

    return bridges;
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
        visitedSet[currentVertex.getKey()].lowDiscoveryTime = currentVertex.getNeighbors()
          .filter((earlyNeighbor) => earlyNeighbor.getKey() !== previousVertex.getKey())
        /**
         * @param {number} lowestDiscoveryTime
         * @param {GraphVertex} neighbor
         */
          .reduce(
            (lowestDiscoveryTime, neighbor) => {
              const neighborLowTime = visitedSet[neighbor.getKey()].lowDiscoveryTime;
              return neighborLowTime < lowestDiscoveryTime ? neighborLowTime : lowestDiscoveryTime;
            },
            visitedSet[currentVertex.getKey()].lowDiscoveryTime,
          );

        // Detect whether previous vertex is articulation point or not.
        // To do so we need to check two [OR] conditions:
        // 1. Is it a root vertex with at least two independent children.
        // 2. If its visited time is <= low time of adjacent vertex.
        if (previousVertex === startVertex) {
        // Check that root vertex has at least two independent children.
          if (visitedSet[previousVertex.getKey()].independentChildrenCount >= 2) {
            const a_point = previousVertex.getKey();

            articulationPointsSet.add(a_point);
          }
        } else {
        // Get current vertex low discovery time.
          const currentLowDiscoveryTime = visitedSet[currentVertex.getKey()].lowDiscoveryTime;

          // Compare current vertex low discovery time with parent discovery time. Check if there
          // are any short path (back edge) exists. If we can't get to current vertex other then
          // via parent then the parent vertex is articulation point for current one.
          const parentDiscoveryTime = visitedSet[previousVertex.getKey()].discoveryTime;
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
  #tarjanCycleMethod(origin_index, curr_index, f, points, marked_stack, marked, is_finish) {
    const adjList = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();

    points.push(curr_index);
    marked_stack.push(curr_index);
    marked[curr_index] = true;

    let w;
    for (let i = 0; i < n_vertices; i += 1) {
      w = adjList[curr_index][i];

      if (w < origin_index) {
        adjList[curr_index].pop(adjList[curr_index][w]);
      } else {
        // Cycle (!): Next node is equal do origin
        if (w === origin_index) {
          let candidate = [...points];

          // Add cycle candidates if list is empty or
          // it is not in the list already
          if (this.#cycles.length === 0) {
            this.#cycles.push(candidate);
          } else {
            candidate = [...points];

            let contains_candidate = false;
            for (let i = 0; i < this.#cycles.length; i += 1) {
              if (_.isEqual(candidate, this.#cycles[i])) {
                contains_candidate = true;
              }
            }

            if (!contains_candidate) this.#cycles.push(candidate);
          }

          f = true;
        } else {
          //
          if (marked[w] === false) {
            this.#tarjanCycleMethod(
              origin_index,
              w,
              is_finish,
              points,
              marked_stack,
              marked,
              is_finish,
            );
          }
        }
      }
    }

    is_finish = f;
    if (is_finish) {
      // Index v is now deleted from mark stacked, and has been called u unmark v
      let u = marked_stack.pop();

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

    return this.#cycles;
  }

  /**
   * @abstract returns the graph girph, defined by the smallest sycle length
   * 
   * @return {Array[Array]} cycle
   */
  girph() {
    return Math.min(cyclicCircuits().map((cycle) => { return cycle.length }))
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
  getCyclesVenn(cycle_indices) {
    return extendedVenn(cycle_indices);
  }

  /**
   * @abstract returns a subgraph with vertices indexes specified by input
   * 
   * @param {Array} subgraph_vertex_indexes
   * @return {object}
   */
  buildSubgraph(subgraph_vertex_indexes) {
    // Construct the cycle appendix anew
    const subgraph_edges = this.getEdgesByVertexIndexes(subgraph_vertex_indexes, true);

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
        edge.weight,
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
    const vertices_keys_to_indices = this.getVerticesKeystoIndices(from_vertex_key);
    const from_vertex_index = vertices_keys_to_indices[from_vertex_key];
    const num_vertices = this.getNumVertices();

    // Mark all the vertices as not visited
    const visited = new Array(num_vertices);

    for (let i = 0; i < num_vertices; i += 1) { visited[i] = false; }

    // Call the recursive helper function
    // to print DFS traversal
    this.DFSUtil(from_vertex_index, visited);

    // Return count of not visited nodes
    let count = 0;
    for (let i = 0; i < num_vertices; i += 1) {
      if (visited[i] === false) { count += 1; }
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
      reachableNodes.push(u);

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
    const reachability_list = initObject(vertices_indices, []);
    
    vertices_indices.forEach((vertex_index) => {
      reachability_list[vertex_index] = this.reachableNodes(
        this.convertVerticesKeystoIndexes([from_vertex_key]))
    });
    
    if(type == 0) {
      return reachability_list;

    } else {
      let incoming_list = initObject(vertices_indices, [])
      
      vertices_indices.forEach((vertex_index) => {
        reachability_list[vertex_index].forEach((reachable_index_from_vertex_id) => {
          incoming_list[reachable_index_from_vertex_id].push(vertex_index)
        })
      })
    }
  }

  /**
   * @abstract returns the reachability venn diagram as a dict. 
   *  - type := 0 : reachable nodes from vertex id as dict key 
   *  - type := 1 : reachable nodes to vertex id as dict key
   * @param {string} type
   * @return {object} reachabilityVenn
   */
   reachabilityVenn(type = 0) {
     return extendedVenn(this.getReachabilityList(type))
   }

  /**
   * @abstract returns the reachability list. 
   *  - type := 0 : 
   *  - type := 1 : 
   * @param {string} from_vertex_key: source node
   * @return {Array} reachableNodes
   */
  getReachabilityVenn(type = 0) {

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
    let r_nodes_ids = reachableNodes(from_vertex_key)

    return r_nodes_ids.includes(to_vertex_id)
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
    const predecessor_candidate_id = vertices_keys_to_indices[predecessor_candidate_key];
    
    const reverseStar = this.getAdjacencyList(1)

    return reverseStar[vertex_id].includes(predecessor_candidate_id)
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
          paths,
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
   * @return {Array[Integer]} allPaths for given acyclic path and 
   */
  #allPathsUtil(acyclic_path_indexes, cycle_nodes_indexes) {
    const acyclic_path_keys = this.convertVerticesIndexestoKeys(acyclic_path_indexes);

    // Intersection nodes between path and cycle
    const intersect_nodes = _.intersection(acyclic_path_indexes, cycle_nodes_indexes);

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
      const intersect_node_key = this.convertVerticesIndexestoKeys([intersect_node_id]);

      // In case there is an intersection between forward star list
      // regarding the intersection vertex and cycle nodes,
      // than exists edges flowing in or out these vertices.

      // An outflow vertex has edges the do not belong to the acyclic path
      const to_vertices_indexes = _.intersection(forward_star[intersect_node_id], cycle_nodes_indexes);

      const to_edges_candidates = this.convertVerticesIndexestoKeys(to_vertices_indexes)
        .map((vertex_key) => `${intersect_node_key}_${vertex_key}`);

      const to_edges = _.difference(to_edges_candidates, _.intersection(path_edges, to_edges_candidates));

      if (to_vertices_indexes.length !== 0 && to_edges.length !== 0) {
        outflow_nodes.push(intersect_node_id);
      }

      const from_vertices_indexes = _.intersection(reverse_star[intersect_node_id], cycle_nodes_indexes);

      const from_edges_candidates = this.convertVerticesIndexestoKeys(from_vertices_indexes)
        .map((vertex_key) => `${vertex_key}_${intersect_node_key}`);

      const from_edges = _.difference(from_edges_candidates, _.intersection(path_edges, from_edges_candidates));

      // An outflow vertex has edges the do not belong to the acyclic path
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

      for (let out_in_flow of cycle_subgraph.allPaths(startVertex, finishVertex)) {
        const out_in_keys = cycle_subgraph.convertVerticesIndexestoKeys(out_in_flow);

        // Nodes of outgoing route MUST only belong to cycle_nodes
        start_node_index = acyclic_path_indexes.indexOf(start_node_index);
        finish_node_index = acyclic_path_indexes.indexOf(finish_node_index);

        const intersec_len = start_node_index === finish_node_index ? 1 : 2;
        const intersection_clause = _.intersection(acyclic_path_keys, out_in_keys).length === intersec_len;
        const finish_precede_start_clause = start_node_index >= finish_node_index;

        const can_increment_route = intersection_clause && finish_precede_start_clause;

        if (can_increment_route) {
          out_in_flow = this.convertVerticesKeystoIndexes(out_in_keys);

          new_route = [].concat(
            acyclic_path_indexes.slice(0, start_node_index + 1),
            out_in_flow.slice(1, -1),
            acyclic_path_indexes.slice(finish_node_index),
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
    if (!this.isCyclic()) {
      return this.acyclicPaths(from_key, to_key);
    }

    const from_id = this.getVertexIndex(this.vertices[from_key]);

    let acyclic_paths = [];
    if (from_key === to_key) {
      const hamiltonian_cycles = this.getHamiltonianCycles();

      if (hamiltonian_cycles.length === 0) {
        return [];
      }
      return hamiltonian_cycles.map((hamiltonian_cycle) => {
        let id = getAllIndexes(hamiltonian_cycle, from_id);

        id = id[0];

        return hamiltonian_cycle.slice(id).concat(
          hamiltonian_cycle.slice(0, id),
        ).concat(from_id);
      });
    }
    acyclic_paths = this.acyclicPaths(from_key, to_key);

    const cycle_indices = this.getCycleIndices();
    const cycles_venn = this.getCyclesVenn(cycle_indices);

    let cyclic_paths = [];

    const cycles_connections = Object.keys(cycles_venn);
    let cycle_nodes_arr = [];
    let connected_cycles_indexes = [];
    let acyclic_path = [];

    const cycles_connections_len = cycles_connections.length;
    let cycles_connection = [];
    const eval_len = acyclic_paths.length * cycles_connections_len;

    acyclic_paths = removeArrayDuplicates(acyclic_paths);

    console.warn(`Warning: Evaluation intersections between acyclic routes and cycle ${eval_len}`);

    // For each acyclic path, it finds if a cyclic connection brings new paths
    for (const path_index in acyclic_paths) {
      acyclic_path = acyclic_paths[path_index];

      for (const cycles_connection_index in cycles_connections) {
        cycles_connection = cycles_connections[cycles_connection_index];

        connected_cycles_indexes = _.split(cycles_connection, ',');

        const cycle_nodes = new Set();
        connected_cycles_indexes.forEach((cycle_index) => {
          cycle_index = Number(cycle_index);

          cycle_indices[cycle_index].forEach(cycle_nodes.add, cycle_nodes);
        });

        cycle_nodes_arr = [...cycle_nodes];

        let cyclic_paths_i = [];

        if (_.intersection(acyclic_path, cycle_nodes_arr).length !== 0) {
          cyclic_paths_i = this.#allPathsUtil(acyclic_path, cycle_nodes_arr);
          cyclic_paths = cyclic_paths.concat(cyclic_paths_i);
        }
      }
    }

    cyclic_paths = removeArrayDuplicates(cyclic_paths);

    return acyclic_paths.concat(cyclic_paths);
  }

  /**
   * @abstract returns true if a graph has no edge
   * 
   * @param {Array} chain_candidate
   * @return {Object} nodes_to_cycles
   */
   isEmpty() {
    return Object.keys(this.edges).length == 0
  }

  /**
   * @abstract returns true if a indices vertices sequence is a valid chain
   * 
   * @param {Array} chain_candidate
   * @return {Object} nodes_to_cycles
   */
  isChain(chain_candidate) {
    let is_chain = true;
    let adjList = this.getAdjacencyList(0)

    for(let i=0; i<chain_candidate.length-1; i+=1) {
      is_chain &&= adjList[chain_candidate[i]].includes(chain_candidate[i+1])
    }

    return is_chain
  }

  /**
   * @abstract returns nodes and respective cycles it is within
   * 
   * @return {Object} nodes_to_cycles
   */
  getVertexCycles() {
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
      loose_nodes: this.looseNodes(),
      orphan_nodes: this.orphanNodes(),
      articulation_nodes: this.articulationPoints(),
      bridges: this.bridges(),
      is_cyclic,
      ...is_cyclic && { all_cycles: this.cyclicCircuits() },
      is_eulerian,
      ...is_eulerian && { eulerian_path: this.getEulerianPath() },
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
