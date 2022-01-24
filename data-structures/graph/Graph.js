import Iter from 'es-iter';
import _ from 'lodash';
import depthFirstSearch from '../../algorithms/depth-first-search/depthFirstSearch';
import VisitMetadata from './VisitMetadata';

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
    return this.cyclicPaths();
  }

  /**
   * @returns {} Graph density defined by number
   * of edges divided by number of possible edges
   */
  get density() {
    const n_vertices = this.getNumVertices();
    const n_dense = n_vertices * (n_vertices - 1) / 2;
    const n_edges = this.getAllEdges().length;

    this.#density = n_edges / n_dense;

    return this.#density;
  }

  /**
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex) {
    this.vertices[newVertex.getKey()] = newVertex;
    return this;
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
    const Indices_to_vertices = this.getIndicesToVertices();
    return Indices_to_vertices[vertexIndex];
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
   * @returns {Object}
   */
  getAdjacencyList() {
    const adjList = {};
    const vertices_index = this.getVerticesIndices();
    const vertex_keys = Object.keys(vertices_index);
    const vertex_values = Object.values(vertices_index);
    const n_vertices = this.getNumVertices();

    // Initialization
    for (let i = 0; i < n_vertices; i++) {
      adjList[vertex_values[i]] = [];
    }

    for (const i of Iter.range(n_vertices)) {
      const vertex_i = this.getVertexByKey(vertex_keys[i]);
      const neighbors_i = this.getNeighbors(vertex_i);

      const neighbors_index = [];

      neighbors_i.forEach((vertex) => {
        neighbors_index.push(vertices_index[vertex.getKey()]);
      });

      adjList[i] = neighbors_index;
    }

    return adjList;
  }

  /**
   * @abstract looseNodes are vertices without to-nodes
   * @returns {GraphEdge[]}
   */
  looseNodes() {
    const loose_nodes = [];
    const adjList = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();

    for (const i of Iter.range(n_vertices)) {
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

    for (const i of Iter.range(n_vertices)) {
      const neighbors = adjList[i];
      for (const j of Iter.range(neighbors.length)) {
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
    // Try to find and end start vertices.
    if (typeof (edge.startVertex) === undefined) {
      console.log(edge.toString());
    }

    let startVertex = this.getVertexByKey(edge.startVertex.getKey());
    let endVertex = this.getVertexByKey(edge.endVertex.getKey());

    // Insert start vertex if it wasn't inserted.
    if (!startVertex) {
      this.addVertex(edge.startVertex);
      startVertex = this.getVertexByKey(edge.startVertex.getKey());
    }

    // Insert end vertex if it wasn't inserted.
    if (!endVertex) {
      this.addVertex(edge.endVertex);
      endVertex = this.getVertexByKey(edge.endVertex.getKey());
    }

    // Check if edge has been already added.
    if (this.edges[edge.getKey()]) {
      throw new Error('Edge has already been added before. Please, choose other key!');
    } else {
      this.edges[edge.getKey()] = edge;
    }

    // Add edge to the vertices.
    if (this.isDirected) {
      // If graph IS directed then add the edge only to start vertex.
      startVertex.addEdge(edge);
    } else {
      // If graph ISN'T directed then add the edge to both vertices.
      startVertex.addEdge(edge);
      endVertex.addEdge(edge);
    }

    return this;
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
      throw new Error('Edge not found in graph');
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

  /**
   * @return {object}
   */
  getVerticesIndices() {
    const verticesIndices = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * @return {object}
   */
  getIndicesToVertices() {
    const vertices_indices = this.getVerticesIndices();
    const values = Object.values(vertices_indices);
    const keys = Object.keys(vertices_indices);
    const n_vertices = this.getNumVertices();
    const indices_vertices = {};

    for (const i of Iter.range(n_vertices)) {
      indices_vertices[values[i]] = keys[i];
    }

    return indices_vertices;
  }

  /**
   * @return {GraphVertex}
   */
  getVertexIndex(vertex) {
    const verticesIndices = this.getVerticesIndices();
    return verticesIndices[vertex.getKey()];
  }

  /**
   * @return {*[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesIndices();

    // Init matrix with infinities meaning that there is no ways of
    // getting from one vertex to another yet.
    const adjacencyMatrix = Array(vertices.length).fill(null).map(
          () => Array(vertices.length).fill(Infinity)
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
   * Reverse all the edges in directed graph.
   * @return {Graph}
   */
  reverse() {
    if (this.isDirected) {
      /** @param {GraphEdge} edge */
      this.getAllEdges().forEach((edge) => {
        // Delete straight edge from graph and from vertices.
        this.deleteEdge(edge);

        // Reverse the edge.
        edge.reverse();

        // Add reversed edge back to the graph and its vertices.
        this.addEdge(edge);
      });
    } else {
      console.warn('Warning: This is an UNDIRECTED graph!');
    }

    return this;
  }

  /**
   * @returns {Graph} clone of this graph, but undirected
   */
  retrieveUndirected() {
    const undirected_graph = new Graph(false);

    for (const edge of this.getAllEdges()) {
      undirected_graph.addEdge(_.cloneDeep(edge));
    }

    return undirected_graph;
  }

  /**
   * @return {*[][]}
   */
  #isCyclicUtil(index, visited, recStack) {
    const adjList = this.getAdjacencyList();

    // Mark the current node as visited and
    // part of recursion stack
    if (recStack[index]) { return true; }

    if (visited[index]) { return false; }

    visited[index] = true;
    recStack[index] = true;

    const children = adjList[index];

    for (const c of Iter.range(children.length)) {
      if (this.#isCyclicUtil(children[c], visited, recStack)) {
        return true;
      }
    }

    recStack[index] = false;

    return false;
  }

  /**
   * @return {Boolean} is_cyclic
   */
  isCyclic() {
    // Mark all the vertices as not visited and
    // not part of recursion stack
    const n_vertices = this.getNumVertices();
    const visited = new Array(n_vertices);
    const recStack = new Array(n_vertices);

    for (const i of Iter.range(n_vertices)) {
      visited[i] = false;
      recStack[i] = false;
    }

    // Call the recursive helper function to
    // detect cycle in different DFS trees
    for (const i of Iter.range(n_vertices)) {
      if (this.#isCyclicUtil(i, visited, recStack)) {
        return true;
      }
    }

    return false;
  }

  // A recursive function that finds and prints bridges using DFS traversal
  // u --> The original vertex
  // u --> The vertex to be visited next
  // pre[v]: order in which dfs examines v
  // low[v]: lowest preorder of any vertex connected to v
  // parent[] --> Stores parent vertices in DFS tree
  #bridgesUtil(u, v, preorder, low, counter, bridges) {
    const adjList = this.getAdjacencyList();

    preorder[v] = counter++;
    low[v] = preorder[v];

    for (const w of adjList[v]) {
      if (preorder[w] === -1) {
        this.#bridgesUtil(v, w, preorder, low, counter, bridges);

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

  // DFS based function to find all bridges. It uses recursive
  // function bridgeUtil()
  bridges() {
    const graph_ = this.isDirected ? this.retrieveUndirected() : _.cloneDeep(this);

    // Mark all the vertices as not visited
    const n_vertices = graph_.getNumVertices();
    const bridges = [];
    const counter = 0;

    // pre[v]: order in which dfs examines v
    // low[v]: lowest preorder of any vertex connected to v
    const preorder = Iter.repeat(-1, n_vertices).toArray();
    const low = Iter.repeat(-1, n_vertices).toArray();

    for (const v of Iter.range(n_vertices)) {
      if (preorder[v] === -1) {
        this.#bridgesUtil(v, v, preorder, low, counter, bridges);
      }
    }

    return bridges;
  }

  /**
   * @abstract Tarjan method for cycles enumeration
   * Extracted from: https://stackoverflow.com/questions/25898100/enumerating-cycles-in-a-graph-using-tarjans-algorithm
   * @param {Integer} from_index
   * @param {GraphVertex} to_index
   * @return {Array[Array]} cycle
   */
  #tarjanCycleMethod(origin_index, curr_index, f, points, cycles, marked_stack, marked, is_finish) {
    const adjList = this.getAdjacencyList();
    const n_vertices = this.getNumVertices();

    points.push(curr_index);
    marked_stack.push(curr_index);
    marked[curr_index] = true;

    let w;
    for (const i of Iter.range(n_vertices)) {
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
            for (const cycle of this.#cycles) {
              if (_.isEqual(candidate, cycle)) {
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
              cycles,
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
   * @return {Array[Array]} cycle
   */
  cyclicPaths() {
    if (!this.isCyclic()) {
      return [];
    }

    const marked = [];
    const marked_stack = [];
    this.#cycles = [];
    const n_vertices = this.getNumVertices();

    for (const i of Iter.range(n_vertices)) {
      marked.push(false);
    }

    const cycles = [];
    for (const i of Iter.range(n_vertices)) {
      const points = [];
      this.#tarjanCycleMethod(i, i, false, points, cycles, marked_stack, marked);

      while (marked_stack.length > 0) {
        const u = marked_stack.pop();
        marked[u] = false;
      }
    }

    return this.#cycles;
  }

  /**
     * @return {object}
     */
  getCycleIndices() {
    const cycles_indices = {};
    let cycles = [];

    if (this.#cycles.length === 0) {
      cycles = this.cyclicPaths();
    }

    for (const i of Iter.range(cycles.length)) {
      cycles_indices[i] = cycles[i];
    }

    return cycles_indices;
  }

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
    for (const i of Iter.range(adj_len)) {
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
   * Tarjan's algorithm for finding articulation points in graph.
   *
   * @return {Object}
   */
  articulationVertices() {
    // Set of vertices we've already visited during DFS.
    const visitedSet = {};

    // Object of articulation points.
    const articulationPointsSet = {};

    // Set of articulation points
    const articulation_vertices = new Set([]);

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
            articulationPointsSet[previousVertex.getKey()] = previousVertex;
            articulation_vertices.add(previousVertex.getKey());
          }
        } else {
          // Get current vertex low discovery time.
          const currentLowDiscoveryTime = visitedSet[currentVertex.getKey()].lowDiscoveryTime;

          // Compare current vertex low discovery time with parent discovery time. Check if there
          // are any short path (back edge) exists. If we can't get to current vertex other then
          // via parent then the parent vertex is articulation point for current one.
          const parentDiscoveryTime = visitedSet[previousVertex.getKey()].discoveryTime;
          if (parentDiscoveryTime <= currentLowDiscoveryTime) {
            articulationPointsSet[previousVertex.getKey()] = previousVertex;
            articulation_vertices.add(previousVertex.getKey());
          }
        }
      },

      allowTraversal: ({ nextVertex }) => !visitedSet[nextVertex.getKey()],
    };

    // Do Depth First Search traversal over submitted graph.
    depthFirstSearch(this, startVertex, dfsCallbacks);

    return [...articulation_vertices];
  }

  /**
   * @param {GraphVertex} from
   * @param {GraphVertex} to
   * @return {Array[Integer]} paths
   */
  acyclicPaths(from, to) {
    const verticesIndices = this.getVerticesIndices();

    const from_index = verticesIndices[from];
    const to_index = verticesIndices[to];
    const n_vertices = this.getNumVertices();

    const is_visited = new Array(this.v);
    for (const i of Iter.range(n_vertices)) {
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
   * @param {GraphVertex} from
   * @param {GraphVertex} to
   * @return {Array[Array]} cycles
   */
  getVertexCycles() {
    const n_vertices = this.getNumVertices();
    const cycles = this.cyclicPaths();
    const nodes_to_cycles = {};

    for (const i of Iter.range(n_vertices)) {
      nodes_to_cycles[i] = [];
    }

    let cnodes_temp = [];
    for (const i of Iter.range(cycles.length)) {
      cnodes_temp = cnodes_temp.concat(cycles[i]);
    }

    const cyclic_nodes = Array.from(new Set(...[cnodes_temp]));

    for (const i of Iter.range(cyclic_nodes.length)) {
      const j = cyclic_nodes[i];

      for (const k of Iter.range(cycles.length)) {
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
    return {
      vertices: Object.keys(this.vertices).toString(),
      edges: Object.keys(this.edges).toString(),
      vertices_to_indices: this.getVerticesIndices(),
      adjacency_list: this.getAdjacencyList(),
      loose_nodes: this.looseNodes(),
      orphan_nodes: this.orphanNodes(),
      bridges: this.bridges(),
      is_cyclic,
      ...is_cyclic && { all_cycles: this.cyclicPaths() },
    };
  }

  /**
   * @return {Object}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }
}
