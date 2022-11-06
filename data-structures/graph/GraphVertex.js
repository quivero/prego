import LinkedList from "../linked-list/LinkedList.js";

export default class GraphVertex {
  /**
   * @param {*} value
   */
  constructor(label, value = 0) {
    if (label === undefined) {
      throw new Error("Graph vertex must have a value");
    }

    /**
     * @param {GraphEdge} edgeA
     * @param {GraphEdge} edgeB
     */
    const edgeComparator = (edgeA, edgeB) => {
      if (edgeA.getKey() === edgeB.getKey()) {
        return 0;
      }

      return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
    };

    // Normally you would store string value like vertex name.
    // But generally it may be any object as well
    this.label = label;
    this.value = value;
    this.edges = new LinkedList(edgeComparator);
  }

  /**
   * @param {GraphEdge} edge
   * @returns {GraphVertex}
   */
  addEdge(edge) {
    this.edges.append(edge);

    return this;
  }

  /**
   * @param {GraphEdge} edges
   * @returns {GraphVertex}
   */
  addEdges(edges) {
    edges.forEach((edge) => {
      this.edges.append(edge);
    });

    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    this.edges.delete(edge);
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdges(edges) {
    edges.forEach((edge) => {
      this.edges.delete(edge);
    });
  }

  /**
   * @returns {GraphVertex[]}
   */
  getNeighbors() {
    const edges = this.edges.toArray();

    /** @param {LinkedListNode} node */
    const neighborsConverter = (node) =>
      node.value.startVertex === this
        ? node.value.endVertex
        : node.value.startVertex;

    // Return either start or end vertex.
    // For undirected graphs it is possible that current vertex will be the end one.
    return edges.map(neighborsConverter);
  }

  /**
   * @return {GraphEdge[]}
   */
  getEdges() {
    return this.edges.toArray().map((linkedListNode) => linkedListNode.value);
  }

  /**
   * @return {number}
   */
  getDegree() {
    return this.edges.toArray().length;
  }

  /**
   * @param {GraphEdge} requiredEdge
   * @returns {boolean}
   */
  hasEdge(requiredEdge) {
    const edgeNode = this.edges.find({
      callback: (edge) => edge === requiredEdge,
    });

    return !!edgeNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {boolean}
   */
  hasNeighbor(vertex) {
    const vertexNode = this.edges.find({
      callback: (edge) =>
        edge.startVertex === vertex || edge.endVertex === vertex,
    });

    return !!vertexNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {(GraphEdge|undefined)}
   */
  findEdge(vertex) {
    const edgeFinder = (edge) =>
      edge.startVertex === vertex || edge.endVertex === vertex;

    const edge = this.edges.find({ callback: edgeFinder });

    return edge ? edge.value : undefined;
  }

  /**
   * @returns {string}
   */
  getKey() {
    return this.label;
  }

  /**
   * @return {GraphVertex}
   */
  deleteAllEdges() {
    this.deleteEdges(this.getEdges());
    return this;
  }

  /**
   * @param {function} [callback]
   * @returns {string}
   */
  toString(callback) {
    return callback ? callback(this.label) : `${this.label}`;
  }
}
