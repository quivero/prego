import { cyclicSort, getAllIndexes } from '../../utils/arrays/arrays.js'

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

  get cycles(){
      return this.cyclicPaths();
  }
  
  get density(){
      let n_vertices = this.getNumVertices();
      let n_dense = n_vertices*(n_vertices-1)/2;
      let n_edges = this.getAllEdges().length;

      this.#density = n_edges/n_dense;

      return this.#density
  }

  /**
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex) {
    this.vertices[newVertex.getKey()] = newVertex;
    return this
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
   getAdjacencyList(){
      let adjList = {};
      let vertices_index = this.getVerticesIndices();
      let vertex_keys = Object.keys(vertices_index);
      let vertex_values = Object.values(vertices_index);
      let n_vertices = this.getNumVertices();

      // Initialization
      for(let i=0; i<n_vertices; i++){
          adjList[vertex_values[i]] = []      
      }

      for(let i=0; i<n_vertices; i++){  
          let vertex_i = this.getVertexByKey(vertex_keys[i]);
          let neighbors_i = this.getNeighbors(vertex_i);
          
          let neighbors_index = [];

          neighbors_i.forEach((vertex) => {
              neighbors_index.push(vertices_index[vertex.getKey()])
          });
          
          adjList[i] = neighbors_index;
          
      }
      
      return adjList;
  }
  
  /**
   * @returns {GraphEdge[]}
   */
  looseNodes(){
      let loose_nodes = [];
      let adjList = this.getAdjacencyList();
      let n_vertices = this.getNumVertices();
      
      for(let i=0; i<n_vertices; i++){
          if(adjList[i].length==0){
              loose_nodes.push(i);
          }
      }

      return loose_nodes;
  }

  orphanNodes(){
    let orphan_nodes = [];
    let adjList = this.getAdjacencyList();
    let n_vertices = this.getNumVertices();
    let indices_to_vertices = this.getIndicesToVertices();

    let to_vertices = new Set();
    
    for(let i=0; i<n_vertices; i++){
      let neighbors = adjList[i];
      for(let j=0; j<neighbors.length; j++){
          to_vertices.add(neighbors[j]);
      }
    }

    this.getAllVertices().forEach((vertex)=>{
        let vertex_index = this.getVertexIndex(vertex);
        
        if(!to_vertices.has(vertex_index)){
          orphan_nodes.push(vertex_index);
        }
    });

    return orphan_nodes
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge) {
    // Try to find and end start vertices.
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
   addEdges(edges){
      edges.forEach((edge) => this.addEdge(edge));
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
    return this.getAllEdges().reduce((weight, graphEdge) => {
      return weight + graphEdge.weight;
    }, 0);
  }

  /**
   * Reverse all the edges in directed graph.
   * @return {Graph}
   */
  reverse() {
    if(this.isDirected){
      /** @param {GraphEdge} edge */
      this.getAllEdges().forEach((edge) => {
      // Delete straight edge from graph and from vertices.
      this.deleteEdge(edge);

      // Reverse the edge.
      edge.reverse();

      // Add reversed edge back to the graph and its vertices.
      this.addEdge(edge);
      });
    } else{
        console.warn('Warning: This is an UNDIRECTED graph!');;
    }

    return this;
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
    let values = Object.values(vertices_indices);
    let keys = Object.keys(vertices_indices);
    let indices_vertices = {};
    
    for(let i=0; i<this.getNumVertices(); i++){
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
    const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
      return Array(vertices.length).fill(Infinity);
    });

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
   * @return {*[][]}
   */  
  #isCyclicUtil(index, visited, recStack){
    let adjList = this.getAdjacencyList();
    
    // Mark the current node as visited and
    // part of recursion stack
    if (recStack[index])
        return true;

    if (visited[index])
        return false;
    
    visited[index] = true;
    recStack[index] = true;
    
    let children = adjList[index];
    
    for (let c=0;c< children.length;c++){
        if (this.#isCyclicUtil(children[c], visited, recStack)){
            return true;
        }
    }

    recStack[index] = false;

    return false;
  }

  /**
   * @return {Boolean} is_cyclic
   */
  isCyclic(){
      // Mark all the vertices as not visited and
      // not part of recursion stack
      let n_vertices = this.getNumVertices();
      let visited = new Array(n_vertices);
      let recStack = new Array(n_vertices);

      for(let i=0; i<n_vertices; i++){
          visited[i]=false;
          recStack[i]=false;
      }
      
      // Call the recursive helper function to
      // detect cycle in different DFS trees
      for (let i = 0; i<n_vertices;  i++){
        if (this.#isCyclicUtil(i, visited, recStack)){
            return true;
        }
      }

      return false;
  }

  /**
   * @abstract Tarjan method for cycles enumeration
   * Extracted from: https://stackoverflow.com/questions/25898100/enumerating-cycles-in-a-graph-using-tarjans-algorithm
   * @param {Integer} from_index
   * @param {GraphVertex} to_index
   * @return {Array[Array]} cycle
   */
  #tarjanCycleMethod(origin_index, curr_index, f, points, cycles, marked_stack, marked, is_finish){
    let adjList = this.getAdjacencyList();
    let n_vertices = this.getNumVertices();

    points.push(curr_index)
    marked_stack.push(curr_index)
    marked[curr_index] = true
    
    let w;
    for(let i=0; i<n_vertices; i++){
        let w = adjList[curr_index][i];

        if(w < origin_index){
            adjList[curr_index].pop(adjList[curr_index][w])
        } else {
            // Cycle (!): Next node is equal do origin
            if(w == origin_index) {
                this.#cycles.push([...points]);
                f = true
            } else { 
                // 
                if(marked[w] == false){
                    this.#tarjanCycleMethod(origin_index, w, is_finish, 
                                            points, cycles, 
                                            marked_stack, marked, is_finish);
                }
            }
        }
    }

    is_finish = f;
    if(f = true){
        // Index v is now deleted from mark stacked, and has been called u unmark v  
        let u = marked_stack.pop()

        while (u != curr_index){
            marked[u] = false
            u = marked_stack.pop();
        }

        marked[u] = false
    }
    
    points.pop(points[curr_index])
  }

  /**
   * @abstract Returns all cycles within a graph
   * @return {Array[Array]} cycle
   */
  cyclicPaths(){
    if(!this.isCyclic()){
        return []
    }
    
    let marked = [];
    let marked_stack = [];
    this.#cycles = [];
    let n_vertices = this.getNumVertices();

    for(let i=0; i<n_vertices; i++){
        marked.push(false);
    }

    let cycles = [];
    for(let i=0; i<n_vertices; i++){
        let points = []
        this.#tarjanCycleMethod(i, i, false, points, cycles, marked_stack, marked);
        
        while (marked_stack.length > 0){
            u = marked_stack.pop()
            marked[u] = false
        }
    }
            
    return this.#cycles;
  }

  /**
     * @return {object}
     */
  getCycleIndices() {
      const cycles_indices = {};
      let cycles = this.cyclicPaths();
      
      for(let i=0; i<cycles.length; i++){
          cycles_indices[i] = cycles[i];
      }

      return cycles_indices;
  }

  #recurAcyclicPaths(from_index, to_index, is_visited, local_path_list, paths) {
      let adj_list = this.getAdjacencyList();
      let adj_len = adj_list[from_index].length;

      if (from_index == to_index) {
          // Push the discoverred path
          paths.push([...local_path_list]);

          // if match found then no need to traverse more till depth
          return;
      }
      
      // Mark the current node as visited
      is_visited[from_index] = true;

      // Recur for all the vertices adjacent to current vertex u
      for (let i=0; i<adj_len; i++) {
          let neighbor_i = adj_list[from_index][i];
          let ith_was_visited = is_visited[neighbor_i];

          if(!ith_was_visited) {
              // store current node in path[]
              local_path_list.push(neighbor_i);

              this.#recurAcyclicPaths(neighbor_i, to_index, is_visited, 
                                 local_path_list, paths);
              
              // remove current node  in path[]
              let idx = local_path_list.indexOf(neighbor_i);
              local_path_list.splice(idx, 1);

          } 
      }
      
      // Mark the current node as unvisited
      is_visited[from_index] = false;
  }

  /**
   * @param {GraphVertex} from
   * @param {GraphVertex} to
   * @return {Array[Integer]} paths
   */
  acyclicPaths(from, to){
    let from_index = this.getVertexIndex(from);
    let to_index = this.getVertexIndex(to);
    let n_vertices = this.getNumVertices();

    let is_visited = new Array(this.v);
    for(let i=0; i<n_vertices; i++) {
      is_visited[i]=false;
    }
    
    let path_list = [];
    let paths = [];

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
  getVertexCycles(){

    let n_vertices = this.getNumVertices();
    let cycles = this.cyclicPaths();
    let nodes_to_cycles = {};

    for(let i = 0; i<n_vertices; i++){
        nodes_to_cycles[i] = [];
    }

    let cnodes_temp = [];
    for(let i = 0; i<cycles.length; i++){  
      cnodes_temp = cnodes_temp.concat(cycles[i]);
    }

    let cyclic_nodes = Array.from(new Set(...[cnodes_temp]));

    for(let i=0; i<cyclic_nodes.length; i++){
      let j = cyclic_nodes[i];
      
      for(let k=0; k<cycles.length; k++){
        if(cycles[k].includes(j)) {
          let indexes = getAllIndexes(cycles[k], j);
          nodes_to_cycles[j].push(cycles[k]);
        }
      }
    }

    return nodes_to_cycles;
  }

  /**
   * @return {object}
   */
  describe(){
    let is_cyclic = this.isCyclic();
    return {
      'vertices': Object.keys(this.vertices).toString(),
      'edges': Object.keys(this.edges).toString(),
      'vertices_to_indices': this.getVerticesIndices(),
      'adjacency_list': this.getAdjacencyList(),
      'loose_nodes': this.looseNodes(),
      'orphan_nodes': this.orphanNodes(),
      'is_cyclic': is_cyclic,
      ...is_cyclic && {'all_cycles': this.cyclicPaths()}
    }
  }

  /**
   * @return {Object}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }
}
