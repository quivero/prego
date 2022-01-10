import detectDirectedCycle from '../../algorithms/detect-cycle/detectDirectedCycle.js'

export default class Graph {
  /**
   * @param {boolean} isDirected
   */
  constructor(isDirected = false) {
    this.vertices = {};
    this.edges = {};
    this.isDirected = isDirected;
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
        let vertex_i = vertex_keys[i];
        
        for(let j=0; j<n_vertices; j++){
            let neighbors_i = this.getNeighbors(this.getVertexByKey(vertex_i));
            let neighbors_index = [];

            neighbors_i.forEach((vertex) => {
              neighbors_index.push(vertices_index[vertex.getKey()])
            });
            
            adjList[i] = neighbors_index;
        }
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
    const verticesIndices = this.getVerticesIndices();

    return Object.fromEntries([Object.values(verticesIndices), Object.keys(verticesIndices)]);
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
  getCycles(){
    return detectDirectedCycle(this);
  }

  describe(){
    return {
      'vertices': Object.keys(this.vertices).toString(),
      'edges': Object.keys(this.edges).toString(),
      'vertices_to_indices': this.getVerticesIndices(),
      'adjacency_list': this.getAdjacencyList(),
      'loose_nodes': this.looseNodes(),
      'orphan_nodes': this.orphanNodes()
    }
  }

  /**
   * @return {Object}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }
}
