import Graph from '../Graph.js';
import GraphVertex from '../GraphVertex.js';
import GraphEdge from '../GraphEdge.js';

console.warn = jest.fn();

beforeEach(() => {
  console.warn.mockClear();
});


describe('Graph', () => {
  it('should add vertices to graph', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');

    graph
      .addVertex(vertexA)
      .addVertex(vertexB);

    expect(graph.toString()).toBe('A,B');
    expect(graph.getVertexByKey(vertexA.getKey())).toEqual(vertexA);
    expect(graph.getVertexByKey(vertexB.getKey())).toEqual(vertexB);
  });

  it('should add edges to undirected graph', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');

    const edgeAB = new GraphEdge(vertexA, vertexB);

    graph.addEdge(edgeAB);

    expect(graph.getAllVertices().length).toBe(2);
    expect(graph.getAllVertices()[0]).toEqual(vertexA);
    expect(graph.getAllVertices()[1]).toEqual(vertexB);

    const graphVertexA = graph.getVertexByKey(vertexA.getKey());
    const graphVertexB = graph.getVertexByKey(vertexB.getKey());

    expect(graph.toString()).toBe('A,B');
    expect(graphVertexA).toBeDefined();
    expect(graphVertexB).toBeDefined();

    expect(graph.getVertexByKey('not existing')).toBeUndefined();

    expect(graphVertexA.getNeighbors().length).toBe(1);
    expect(graphVertexA.getNeighbors()[0]).toEqual(vertexB);
    expect(graphVertexA.getNeighbors()[0]).toEqual(graphVertexB);

    expect(graphVertexB.getNeighbors().length).toBe(1);
    expect(graphVertexB.getNeighbors()[0]).toEqual(vertexA);
    expect(graphVertexB.getNeighbors()[0]).toEqual(graphVertexA);
  });

  it('should add edges to directed graph', () => {
    const graph = new Graph(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');

    const edgeAB = new GraphEdge(vertexA, vertexB);

    graph.addEdge(edgeAB);

    const graphVertexA = graph.getVertexByKey(vertexA.getKey());
    const graphVertexB = graph.getVertexByKey(vertexB.getKey());

    expect(graph.toString()).toBe('A,B');
    expect(graphVertexA).toBeDefined();
    expect(graphVertexB).toBeDefined();

    expect(graphVertexA.getNeighbors().length).toBe(1);
    expect(graphVertexA.getNeighbors()[0]).toEqual(vertexB);
    expect(graphVertexA.getNeighbors()[0]).toEqual(graphVertexB);

    expect(graphVertexB.getNeighbors().length).toBe(0);
  });

  it('should return graph cycles', () => {
    // A directed graph
    let graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);
    
    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.cycles).toEqual([[1, 2, 4], [1, 2, 5]]);
  });

  it('Cycles in a finite graph must be finite', () => {
    // A directed graph
    let graph = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);
    
    // Add vertices
    graph.addVertices([A, B, C, D, E, F]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.cyclicPaths()).toStrictEqual([[1, 2, 4], [1, 2, 5]]);
  })  

  it('Cycles in a finite graph must be finite', () => {
    // A directed graph
    let graph = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);
    
    // Add vertices
    graph.addVertices([A, B, C, D, E, F]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.cyclicPaths()).toStrictEqual([[1, 2, 4], [1, 2, 5]]);
  })

  it('Cycles in a finite graph must be finite', () => {
    // A directed graph
    let graph = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
        
    // Add edges
    graph.addEdges([AB, BC]);

    expect(graph.cyclicPaths()).toEqual([]);
  })

  it('should find edge by vertices in undirected graph', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    const edgeAB = new GraphEdge(vertexA, vertexB, 10);

    graph.addEdge(edgeAB);

    const graphEdgeAB = graph.findEdge(vertexA, vertexB);
    const graphEdgeBA = graph.findEdge(vertexB, vertexA);
    const graphEdgeAC = graph.findEdge(vertexA, vertexC);
    const graphEdgeCA = graph.findEdge(vertexC, vertexA);

    expect(graphEdgeAC).toBeNull();
    expect(graphEdgeCA).toBeNull();
    expect(graphEdgeAB).toEqual(edgeAB);
    expect(graphEdgeBA).toEqual(edgeAB);
    expect(graphEdgeAB.weight).toBe(10);
  });

  it('should find edge by vertices in directed graph', () => {
    const graph = new Graph(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    const edgeAB = new GraphEdge(vertexA, vertexB, 10);

    graph.addEdge(edgeAB);

    const graphEdgeAB = graph.findEdge(vertexA, vertexB);
    const graphEdgeBA = graph.findEdge(vertexB, vertexA);
    const graphEdgeAC = graph.findEdge(vertexA, vertexC);
    const graphEdgeCA = graph.findEdge(vertexC, vertexA);

    expect(graphEdgeAC).toBeNull();
    expect(graphEdgeCA).toBeNull();
    expect(graphEdgeBA).toBeNull();
    expect(graphEdgeAB).toEqual(edgeAB);
    expect(graphEdgeAB.weight).toBe(10);
  });

  it('should return vertex neighbors', () => {
    const graph = new Graph(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAC = new GraphEdge(vertexA, vertexC);

    graph.addEdges([edgeAB, edgeAC]);

    const neighbors = graph.getNeighbors(vertexA);

    expect(neighbors.length).toBe(2);
    expect(neighbors[0]).toEqual(vertexB);
    expect(neighbors[1]).toEqual(vertexC);
  });

  it('should return graph density', () => {
    const graph = new Graph(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAC = new GraphEdge(vertexA, vertexC);

    graph.addEdges([edgeAB, edgeAC]);

    let density = graph.density;

    expect(density).toEqual(2/3);
  });

  it('should throw an error when trying to add edge twice', () => {
    function addSameEdgeTwice() {
      const graph = new Graph(true);

      const vertexA = new GraphVertex('A');
      const vertexB = new GraphVertex('B');

      const edgeAB = new GraphEdge(vertexA, vertexB);

      graph.addEdges([edgeAB, edgeAB]);
    }

    expect(addSameEdgeTwice).toThrow();
  });

  it('should return the list of all added edges', () => {
    const graph = new Graph(true);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);

    graph
      .addEdge(edgeAB)
      .addEdge(edgeBC);

    const edges = graph.getAllEdges();

    expect(edges.length).toBe(2);
    expect(edges[0]).toEqual(edgeAB);
    expect(edges[1]).toEqual(edgeBC);
  });

  it('should calculate total graph weight for default graph', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeAD = new GraphEdge(vertexA, vertexD);

    graph.addEdges([edgeAB, edgeBC, edgeCD, edgeAD]);

    expect(graph.getWeight()).toBe(0);
  });

  it('should calculate total graph weight for weighted graph', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB, 1);
    const edgeBC = new GraphEdge(vertexB, vertexC, 2);
    const edgeCD = new GraphEdge(vertexC, vertexD, 3);
    const edgeAD = new GraphEdge(vertexA, vertexD, 4);

    graph.addEdges([edgeAB, edgeBC, edgeCD, edgeAD]);

    expect(graph.getWeight()).toBe(10);
  });

  it('should get vertices to indexes', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    graph.addVertices([vertexA, vertexB, vertexC])

    expect(graph.getVerticesIndices()).toEqual({
      A: 0,
      B: 1,
      C: 2  
    });
  });

  it('should get indexes to vertices', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    graph.addVertices([vertexA, vertexB, vertexC])

    expect(graph.getIndicesToVertices()).toEqual({
      0: 'A',
      1: 'B',
      2: 'C'  
    });
  });

  it('should get vertex index', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    graph.addVertices([vertexA, vertexB, vertexC])

    expect(graph.getVertexIndex(vertexA)).toEqual(0);
    expect(graph.getVertexIndex(vertexC)).toEqual(2);
    expect(graph.getVertexIndex(vertexB)).toEqual(1);
  });

  it('should prove if a graph is cyclic', () => {
    // A directed graph
    let graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.isCyclic()).toEqual(true);
  });

  it('should prove if a graph is acyclic', () => {
    // A directed graph
    let graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);

    // Add edges
    graph_.addEdges([AB, BC]);

    expect(graph_.isCyclic()).toEqual(false);
  });

  it('should be possible to delete edges from graph', () => {
    const graph = new Graph();

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeAC = new GraphEdge(vertexA, vertexC);

    graph.addEdges([edgeAB, edgeBC, edgeAC]);

    expect(graph.getAllEdges().length).toBe(3);

    graph.deleteEdge(edgeAB);

    expect(graph.getAllEdges().length).toBe(2);
    expect(graph.getAllEdges()[0].getKey()).toBe(edgeBC.getKey());
    expect(graph.getAllEdges()[1].getKey()).toBe(edgeAC.getKey());
  });

  it('should throw an error when trying to delete not existing edge', () => {
    function deleteNotExistingEdge() {
      const graph = new Graph();

      const vertexA = new GraphVertex('A');
      const vertexB = new GraphVertex('B');
      const vertexC = new GraphVertex('C');

      const edgeAB = new GraphEdge(vertexA, vertexB);
      const edgeBC = new GraphEdge(vertexB, vertexC);

      graph.addEdge(edgeAB);
      graph.deleteEdge(edgeBC);
    }

    expect(deleteNotExistingEdge).toThrowError();
  });

  it('should return acyclic paths', () => {
    const graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.acyclicPaths(A, F)).toEqual([[0, 1, 2, 5]]);
  });

  it('should return acyclic paths', () => {
    const graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.getVertexCycles()).toEqual({
      0: [],
      1: [[1, 2, 4], [1, 2, 5]],
      2: [[1, 2, 4], [1, 2, 5]],
      3: [],
      4: [[1, 2, 4]],
      5: [[1, 2, 5]]
    });
  });

  it('should return acyclic paths', () => {
    const graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.getCycleIndices()).toEqual({
      0: [1, 2, 4],
      1: [1, 2, 5]
    });
  });

  it('should return loose nodes', () => {
    const graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    let E = new GraphVertex('E');
    let F = new GraphVertex('F');

    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let CD = new GraphEdge(C, D);
    let CE = new GraphEdge(C, E);
    let EB = new GraphEdge(E, B);
    let CF = new GraphEdge(C, F);
    let FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.looseNodes()).toEqual([3]);
  });

  it('should return orphan nodes', () => {
    const graph_ = new Graph(true);

    // Nodes
    let A = new GraphVertex('A');
    let B = new GraphVertex('B');
    let C = new GraphVertex('C');
    let D = new GraphVertex('D');
    
    // Vertices
    let AB = new GraphEdge(A, B);
    let BC = new GraphEdge(B, C);
    let DB = new GraphEdge(D, B);
    
    // Add edges
    graph_.addEdges([AB, BC, DB]);

    expect(graph_.orphanNodes()).toEqual([0, 3]);
  });

  it('should be possible to reverse graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);

    const graph = new Graph(true);
    graph.addEdges([edgeAB, edgeAC, edgeCD]);

    expect(graph.toString()).toBe('A,B,C,D');
    expect(graph.getAllEdges().length).toBe(3);
    expect(graph.getNeighbors(vertexA).length).toBe(2);
    expect(graph.getNeighbors(vertexA)[0].getKey()).toBe(vertexB.getKey());
    expect(graph.getNeighbors(vertexA)[1].getKey()).toBe(vertexC.getKey());
    expect(graph.getNeighbors(vertexB).length).toBe(0);
    expect(graph.getNeighbors(vertexC).length).toBe(1);
    expect(graph.getNeighbors(vertexC)[0].getKey()).toBe(vertexD.getKey());
    expect(graph.getNeighbors(vertexD).length).toBe(0);

    graph.reverse();

    expect(graph.toString()).toBe('A,B,C,D');
    expect(graph.getAllEdges().length).toBe(3);
    expect(graph.getNeighbors(vertexA).length).toBe(0);
    expect(graph.getNeighbors(vertexB).length).toBe(1);
    expect(graph.getNeighbors(vertexB)[0].getKey()).toBe(vertexA.getKey());
    expect(graph.getNeighbors(vertexC).length).toBe(1);
    expect(graph.getNeighbors(vertexC)[0].getKey()).toBe(vertexA.getKey());
    expect(graph.getNeighbors(vertexD).length).toBe(1);
    expect(graph.getNeighbors(vertexD)[0].getKey()).toBe(vertexC.getKey());
  });

  it('should warn about reversing a graph', () => {
    const graph = new Graph(false);

    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');

    const edgeAB = new GraphEdge(vertexA, vertexB);

    graph.addEdge(edgeAB);
    graph.reverse();

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('should return vertices indices', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeBD = new GraphEdge(vertexB, vertexD);

    const graph = new Graph();
    graph.addEdges([edgeAB, edgeBC, edgeCD, edgeBD]);

    const verticesIndices = graph.getVerticesIndices();
    expect(verticesIndices).toEqual({
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    });
  });

  it('should generate adjacency matrix for undirected graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeBD = new GraphEdge(vertexB, vertexD);

    const graph = new Graph();
    graph.addEdges([edgeAB, edgeBC, edgeCD, edgeBD]);

    const adjacencyMatrix = graph.getAdjacencyMatrix();
    expect(adjacencyMatrix).toEqual([
      [Infinity, 0, Infinity, Infinity],
      [0, Infinity, 0, 0],
      [Infinity, 0, Infinity, 0],
      [Infinity, 0, 0, Infinity],
    ]);
  });

  it('should generate adjacency matrix for directed graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB, 2);
    const edgeBC = new GraphEdge(vertexB, vertexC, 1);
    const edgeCD = new GraphEdge(vertexC, vertexD, 5);
    const edgeBD = new GraphEdge(vertexB, vertexD, 7);

    const graph = new Graph(true);
    graph.addEdges([edgeAB, edgeBC, edgeCD, edgeBD ]);

    const adjacencyMatrix = graph.getAdjacencyMatrix();
    expect(adjacencyMatrix).toEqual([
      [Infinity, 2, Infinity, Infinity],
      [Infinity, Infinity, 1, 7],
      [Infinity, Infinity, Infinity, 5],
      [Infinity, Infinity, Infinity, Infinity],
    ]);
  });
});
