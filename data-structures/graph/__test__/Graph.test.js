import _ from 'lodash';
import Graph from '../Graph';
import GraphEdge from '../GraphEdge';

import {
  createVertices,
  createEdges,
  createEdgesFromVerticesValues,
  resetVertices,
} from '#gutils/graph.js';

import { ones, isCyclicEqual } from '#algorithms/arrays/arrays';

import {
  expectToBe,
  expectToBeEqual,
  expectToStrictEqual,
  expectToBeDefined,
  expectToBeUndefined,
} from '#algorithms/testing/expectTo.js';

import { batchAssert } from '#algorithms/testing/assertions.js';

import { throwError, warn } from '#algorithms/sys/sys.js';

jest.mock('#algorithms/sys/sys.js');

let preamble, expected, result;
let graph, graph_;
let edges_vertices, edges;

let A, B, C, D, E, F, G, H;

let vertices_keys;

vertices_keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
[A, B, C, D, E, F, G, H] = createVertices(vertices_keys);

let AB, AC, AD, BC, BD, BE, CD, CE, CF, DA, DE, EB, EF, FA, FB;

let trivia;

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

beforeEach(() => {
  // restore the spy created with spyOn
  [A, B, C, D, E, F, G, H] = resetVertices([A, B, C, D, E, F, G, H]);
});

describe('Graph', () => {
  it('should add vertices to graph', () => {
    preamble = () => {
      graph = new Graph();
      graph.addVertices([A, B]);

      return graph;
    };

    graph = preamble();
    trivia = [
      [graph.toString(graph.getVertexByKey(A.getKey())), expectToBe, ''],
      [graph.getVertexByKey(A.getKey()), expectToBe, A],
      [graph.getVertexByKey(B.getKey()), expectToBe, B],
    ];

    batchAssert(trivia);
  });

  it('should get vertex by its index', () => {
    let vertex;

    preamble = () => {
      graph = new Graph();

      graph.addVertices([A, B]);
      return graph.getVertexByIndex(0);
    };

    vertex = preamble();

    expected = vertex.getKey();
    result = 'A';

    expect(expected).toEqual(result);
  });

  it('should serialize and deserialize graph', () => {
    graph_ = new Graph(true);

    [AB, BC, CD] = createEdgesFromVerticesValues([
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'D'],
    ]);

    preamble = () => {
      graph = new Graph(true);

      graph.addEdges([AB, BC]);

      return graph;
    };

    graph = preamble();

    let graph_serialization = graph.serialize();
    result = graph_serialization;

    expected = {
      isDirected: true,
      nodes: [
        { id: 'A', value: 0 },
        { id: 'B', value: 0 },
        { id: 'C', value: 0 },
      ],
      edges: [
        { source: 'A', target: 'B', weight: 0 },
        { source: 'B', target: 'C', weight: 0 },
      ],
    };

    expect(result).toEqual(expected);

    // Deserialize graph serialization with its json representation
    preamble = () => {
      graph.addEdge(CD);
      graph_serialization = graph.serialize();
      graph.empty();
      graph.addEdges([AB, BC]);
      graph.deserialize(result);

      return graph;
    };

    graph = preamble(graph, AB, BC, CD);
    result = graph.getNumVertices();
    expected = 4;

    expect(result).toBe(expected);

    preamble = (graph_) => {
      graph_.deserialize(graph_serialization);

      return graph_;
    };

    graph_ = preamble(graph_);

    edges = graph_.getAllEdges();

    trivia = [
      [graph_.getNumVertices(), 4],
      [edges.length, 3],
      [edges[0].toString(), 'A_B'],
      [edges[1].toString(), 'B_C'],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }
  });

  it('should throw error for graph in other direction than serialization', () => {
    graph = new Graph(true);

    const edges_labels = [
      ['A', 'B'],
      ['B', 'C'],
    ];
    const [AB, BC] = createEdgesFromVerticesValues(edges_labels);

    graph.addEdges([AB, BC]);

    graph_ = { isDirected: false };
    graph.deserialize(graph_);

    result = throwError;
    expected = 1;

    expect(result).toHaveBeenCalledTimes(expected);
  });

  it('should return edges from index chain', () => {
    graph = new Graph(true);

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    result = graph.getEdgesFromChain([0, 1, 2]).length;
    expected = 2;

    expect(result).toBe(expected);
  });

  it('should throw error for inexistent vertex from index chain', () => {
    graph = new Graph(true);
    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);
    graph.getEdgesFromChain([0, 2]);

    expect(throwError).toHaveBeenCalled();
  });

  it('should get vertices by indexes', () => {
    graph = new Graph();

    graph.addVertices([A, B]);

    const vertices_index = graph
      .getVerticesByIndexes([0, 1])
      .map((vertex) => vertex.getKey());

    result = vertices_index;
    expected = ['A', 'B'];

    expect(result).toEqual(expected);
  });

  it('should get vertices keys', () => {
    graph = new Graph();

    graph.addVertices([A, B]);

    result = graph.getVerticesKeys();
    expected = ['A', 'B'];

    expect(result).toEqual(expected);
  });

  it('should throw a warning for added repeated vertices', () => {
    graph = new Graph();

    graph.addVertex(A);
    graph.addVertex(A);

    result = throwError;
    expected = 1;

    expect(result).toHaveBeenCalledTimes(expected);
  });

  it('should return true for a valid chain', () => {
    // A directed graph
    graph = new Graph(true);

    // Edges
    [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    result = graph.isChain([0, 1, 2, 3]);
    expected = true;

    expect(result).toBe(expected);
  });

  it('should return false for a invalid chain', () => {
    // A directed graph
    graph = new Graph(true);

    // Edges
    [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    result = graph.isChain([0, 1, 2, 1]);
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should return true for a empty graph', () => {
    // A directed graph
    graph = new Graph(true);

    // Add vertices
    graph.addVertices([A, B, C]);

    result = graph.isEmpty();
    expected = true;

    expect(result).toEqual(expected);
  });

  it('should return the graph description', () => {
    // A directed graph
    graph = new Graph(true);

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    // Add vertices
    graph.addEdges([AB, BC]);

    result = graph.describe();
    expected = {
      vertices: 'A,B,C',
      edges: 'A_B,B_C',
      vertices_keys_to_indices: { A: 0, B: 1, C: 2 },
      adjacency_list: { 0: [1], 1: [2], 2: [] },
      sink_nodes: [2],
      source_nodes: [0],
      articulation_nodes: [1],
      bridges: [
        [1, 2],
        [0, 1],
      ],
      is_cyclic: false,
      is_eulerian: false,
      is_connected: true,
    };

    expect(result).toEqual(expected);
  });

  it('should return false for a non-empty graph', () => {
    // A directed graph
    graph = new Graph(true);

    // Add vertices
    graph.addVertices([A, B, C]);

    // Edges
    [AB] = createEdges([[A, B]]);

    // Add edges
    graph.addEdges([AB]);

    result = graph.isEmpty();
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should get edges by vertex keys', () => {
    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    edges = graph.getEdgesByVertexKeys(['A', 'B'], false);

    let edge_keys = [];
    edges.forEach((edge) => {
      edge_keys.push(edge.getKey());
    });

    result = graph.getEdgesKeysByVertexKeys(['A', 'B'], false);
    expected = ['A_B', 'B_C'];

    expect(result).toEqual(expected);

    edges = graph.getEdgesByVertexKeys(['A', 'B'], true);

    edge_keys = [];
    edges.forEach((edge) => {
      edge_keys.push(edge.getKey());
    });

    result = edge_keys;
    expected = ['A_B'];

    expect(result).toEqual(expected);

    result = graph.getEdgesKeysByVertexKeys(['A', 'B'], true);
    expected = ['A_B'];

    expect(result).toEqual(expected);

    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edge = graph.findEdgeByVertexIndices(0, 1);

    expect(edge.getKey()).toBe('A_B');

    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    result = graph.findEdgeByVertexIndices(0, 3);
    expected = undefined;

    expect(result).toBe(expected);

    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    edges = graph.findEdgesByVertexIndicesTuples([
      [0, 1],
      [1, 2],
    ]);

    trivia = [
      [edges[0].getKey(), 'A_B'],
      [edges[1].getKey(), 'B_C'],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toEqual(expected);
    }
  });

  it('should get undefined for undefined start vertex index', () => {
    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    edges = graph.findEdgesByVertexIndicesTuples([[3, 4]]);

    result = edges[0];
    expected = undefined;

    expect(result).toBe(expected);

    result = graph.findEdgesByVertexIndicesTuples([[3, 4]]);
    expected = [undefined];

    expect(result).toStrictEqual(expected);
  });

  it('should add edge to the same vertex', () => {
    graph = new Graph();

    let AA;
    [AA] = createEdges([[A, A]]);

    graph.addEdges([AA]);

    result = Object.keys(graph.edges);
    expected = ['A_A'];

    expect(result).toEqual(expected);
  });

  it('should add edges to undirected graph', () => {
    graph = new Graph();

    const AB = new GraphEdge(A, B);

    graph.addEdge(AB);

    const graphA = graph.getVertexByKey(A.getKey());
    const graphB = graph.getVertexByKey(B.getKey());

    trivia = [
      [graph.getAllVertices().length, expectToBeDefined, 2],
      [graph.getAllVertices()[0], expectToBeEqual, A],
      [graph.getAllVertices()[1], expectToBeEqual, B],
      [graph.toString(), expectToBe, 'A_B'],
      [graphA, expectToBeDefined],
      [graphB, expectToBeDefined],
      [graph.getVertexByKey('unknown'), expectToBeUndefined],
      [graphA.getNeighbors().length, expectToBe, 1],
      [graphA.getNeighbors()[0], expectToBeEqual, B],
      [graphA.getNeighbors()[0], expectToBeEqual, graphB],
      [graphB.getNeighbors().length, expectToBe, 1],
      [graphB.getNeighbors()[0], expectToBe, A],
      [graphB.getNeighbors()[0], expectToBe, graphA],
    ];

    batchAssert(trivia);
  });

  it('should add edges to directed graph', () => {
    graph = new Graph(true);
    AB = new GraphEdge(A, B);

    graph.addEdge(AB);

    const graphA = graph.getVertexByKey(A.getKey());
    const graphB = graph.getVertexByKey(B.getKey());

    trivia = [
      [graph.toString(), expectToBe, 'A_B'],
      [graphA, expectToBeDefined],
      [graphB, expectToBeDefined],
      [graphA.getNeighbors().length, expectToBe, 1],
      [graphA.getNeighbors()[0], expectToBeEqual, B],
      [graphA.getNeighbors()[0], expectToBeEqual, graphB],
      [graphB.getNeighbors().length, expectToBe, 0],
    ];

    batchAssert(trivia);
  });

  it('should check if vertex and edge exist', () => {
    graph = new Graph();

    graph.addVertices([A, B]);

    // Edges
    [AB] = createEdges([[A, B]]);
    graph.addEdge(AB);

    trivia = [
      [graph.hasVertex(A.getKey()), expectToBe, true],
      [graph.hasEdge(AB.getKey()), expectToBe, true],
    ];

    batchAssert(trivia);
  });

  it('should copy directed graph but undirected', () => {
    // A directed graph
    graph_ = new Graph(true);

    // Vertices
    AB = new GraphEdge(A, B);

    graph_.addEdge(AB);

    // Add edges
    const graph_undirected = graph_.retrieveUndirected();

    result = graph_undirected.isDirected;
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should copy undirected graph', () => {
    // A directed graph
    graph_ = new Graph(false);

    // Vertices
    AB = new GraphEdge(A, B);

    graph_.addEdge(AB);

    // Add edges
    const graph_undirected = graph_.retrieveUndirected();

    result = graph_undirected.isDirected;
    expected = false;

    expect(result).toEqual(expected);
  });

  it('Cycles in a finite graph 1 must be finite', () => {
    // A directed graph
    graph = new Graph(true);

    // Edges
    [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    result = graph.cyclicCircuits();
    expected = [
      [1, 2, 4],
      [1, 2, 5],
    ];

    expect(result).toStrictEqual(expected);
  });

  it('should return self-cycles', () => {
    graph = new Graph(true);

    let AA;

    [AA] = createEdges([[A, A]]);
    graph.addEdges([AA]);

    result = graph.cyclicCircuits();
    expected = [[0]];

    expect(result).toStrictEqual(expected);
  });

  it('Cycles in a finite graph 2 must be finite', () => {
    graph = new Graph(true);

    [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ]);
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    result = graph.cyclicCircuits();
    expected = [
      [1, 2, 4],
      [1, 2, 5],
    ];

    expect(result).toStrictEqual(expected);
  });

  it('should return Eulerian Circuit in graph', () => {
    graph = new Graph();

    [AB, BC, CD, DE, EF] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
    ]);
    graph.addEdges([AB, BC, CD, DE, EF]);

    result = graph.getEulerianPath();
    expected = [0, 1, 2, 3, 4, 5, 0];

    expect(result).toStrictEqual(expected);
  });

  it('should return true if find Eulerian Circuit in graph', () => {
    graph = new Graph(true);

    [AB, BC, CD, DE, EF, BE] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
      [B, E],
    ]);
    graph.addEdges([AB, BC, CD, DE, EF, BE]);

    result = graph.isEulerian();
    expected = false;

    expect(result).toStrictEqual(expected);
  });

  it('should return false for a non-eulerian directed graph', () => {
    graph = new Graph(true);

    [AB, BC, BD] = createEdges([
      [A, B],
      [B, C],
      [B, D],
    ]);

    graph.addEdges([AB, BC, CD]);

    trivia = [
      [graph.isEulerian(), expectToStrictEqual, false],
      [graph.isEulerianCycle(), expectToStrictEqual, false],
    ];

    batchAssert(trivia);
  });

  it('should return true for an eulerian directed graph', () => {
    graph = new Graph(true);

    [AB, BC, CD, DA] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, A],
    ]);
    graph.addEdges([AB, BC, CD, DA]);

    trivia = [
      [graph.isEulerian(), expectToStrictEqual, true],
      [graph.isEulerianCycle(), expectToStrictEqual, true],
    ];

    batchAssert(trivia);
  });

  it('should return false for an directed graph with different in and out edge flow', () => {
    graph = new Graph(true);

    [AB, BC, CD] = createEdges([
      [A, B],
      [B, C],
      [C, D],
    ]);
    graph.addEdges([AB, BC, CD]);

    result = graph.isEulerian();
    expected = false;

    expect(result).toStrictEqual(expected);
  });

  it('should return 0 for an eulerian undirected graph', () => {
    graph = new Graph();

    [AB, BC, BD] = createEdges([
      [A, B],
      [B, C],
      [B, D],
    ]);
    graph.addEdges([AB, BC, BD]);

    result = graph.isEulerian();
    expected = 0;

    expect(result).toStrictEqual(expected);
  });

  it('should return 0 for non-eulerian graph', () => {
    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);
    graph.addEdges([AB, BC]);

    result = graph.empty().getAllEdges().length;
    expected = 0;

    expect(result).toStrictEqual(expected);
  });

  it('should return 1 for an eulerian path of directed graph', () => {
    graph = new Graph();

    [AB, BC, CD, DE, EF] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
    ]);
    graph.addEdges([AB, BC, CD, DE, EF]);

    result = graph.isEulerian();
    expected = 1;

    expect(result).toStrictEqual(expected);
  });

  it('should return 2 for an eulerian cycle of directed graph', () => {
    graph = new Graph();

    [AB, BC, CD, DE, EF, FA] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
      [F, A],
    ]);

    graph.addEdges([AB, BC, CD, DE, EF, FA]);

    result = graph.isEulerian();
    expected = 2;

    expect(result).toStrictEqual(expected);
  });

  it('should return reverse star representation of a graph', () => {
    graph = new Graph(true);

    [AB, BC, CD, DE, EF, FA] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
      [F, A],
    ]);

    graph.addEdges([AB, BC, CD, DE, EF, FA]);

    result = graph.getAdjacencyList(1);
    expected = { 0: [5], 1: [0], 2: [1], 3: [2], 4: [3], 5: [4] };

    expect(result).toEqual(expected);
  });

  it('should return reverse star representation of a graph and volume of graph', () => {
    graph = new Graph(true);

    [AB, BC, CD, DE, EF, FA] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
      [F, A],
    ]);

    graph.addEdges([AB, BC, CD, DE, EF, FA]);

    const n_vertices = graph.getNumVertices();

    trivia = [
      [
        graph.getInOutDegreeList(0),
        expectToBeEqual,
        { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
      ],
      [
        graph.getInOutDegreeList(1),
        expectToBeEqual,
        { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
      ],
      [graph.volume(_.range(n_vertices), 0), expectToBeEqual, 6],
      [graph.volume(_.range(n_vertices), 1), expectToBeEqual, 6],
      [graph.getForwardDegrees(), expectToBeEqual, ones(6)],
      [graph.getReverseDegrees(), expectToBeEqual, ones(6)],
    ];

    batchAssert(trivia);
  });

  it('should return true for bipartite graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, D],
      [A, E],
      [A, F],
      [B, D],
      [B, E],
      [B, F],
      [C, D],
      [C, E],
      [C, F],
      [D, A],
      [D, B],
      [D, C],
      [E, A],
      [E, B],
      [E, C],
      [F, A],
      [F, B],
      [F, C],
    ];

    graph.addEdges(createEdges(edges_vertices));

    expected = graph.isBipartite();
    result = true;

    expect(expected).toEqual(result);
  });

  it('should return false for non-bipartite graph', () => {
    // A directed graph
    graph = new Graph(false);

    edges_vertices = [
      [A, B],
      [A, C],
      [B, C],
      [B, D],
      [D, E],
      [D, F],
      [F, E],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    expected = graph.isBipartite();
    result = false;

    expect(expected).toEqual(result);
  });

  it('should return true for strongly connected directed graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [D, C],
      [B, D],
      [C, A],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.isStronglyConnected();
    expected = true;

    expect(result).toEqual(expected);
  });

  it('should return false for not strongly connected directed graph', () => {
    graph = new Graph(true);

    graph.addVertices([A, B, C, D]);

    result = graph.isStronglyConnected();
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should return circuits in a directed graph', () => {
    // A directed graph
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.cyclicCircuits();
    expected = [
      [1, 2, 4],
      [1, 2, 5],
    ];

    expect(result).toStrictEqual(expected);
  });

  it('should return strongly connected dictionary in a graph 1', () => {
    // A directed graph
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, A],
      [B, D],
      [D, E],
      [E, F],
      [F, D],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getStronglyConnectedComponentsIndices();
    expected = { 0: [0, 2, 1], 1: [3, 5, 4] };

    expect(result).toStrictEqual(expected);
  });

  it('should return strongly connected dictionary in a graph 2', () => {
    // A directed graph
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, A],
      [B, D],
      [D, E],
      [E, F],
      [F, D],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getMapSCCToBindingPoints();
    expected = { 0: [1], 1: [3] };

    expect(result).toStrictEqual(expected);
  });

  it('should return articulation points in a graph 1', () => {
    // A directed graph
    graph = new Graph(false);

    edges_vertices = [
      [A, B],
      [A, C],
      [B, D],
      [C, D],
      [D, E],
      [E, F],
      [E, G],
      [F, H],
      [G, H],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.articulationPoints();
    expected = [4, 3];

    expect(result).toStrictEqual(expected);
  });

  it('should find articulation points in simple graph 2', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
    ];

    graph.addEdges(createEdges(edges_vertices));

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    trivia = [
      [articulationPointsSet.length, expectToBe, 2],
      [articulationPointsSet[0], expectToBe, vertices_indices[C.getKey()]],
      [articulationPointsSet[1], expectToBe, vertices_indices[B.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should find articulation points in simple graph', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
    ];
    graph.addEdges(createEdges(edges_vertices));

    const ids = graph.convertVerticestoVerticesIndices([A, B, C, D]);

    result = ids;
    expected = [0, 1, 2, 3];

    expect(result).toStrictEqual(expected);
  });

  it('should return vertices indices from edge', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
    ];
    [AB, BC, CD] = createEdges(edges_vertices);
    graph.addEdges([AB, BC, CD]);

    const ids = graph.convertEdgeToVerticesIndices(AB);

    result = _.isEqual(ids, [0, 1]);
    expected = true;

    expect(result).toBe(expected);
  });

  it('should return vertices indices from edges', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
    ];
    graph.addEdges(createEdges(edges_vertices));

    result = graph.convertEdgesToVerticesIndices([AB, BC, CD]);
    expected = [
      [0, 1],
      [1, 2],
      [2, 3],
    ];

    expect(result).toStrictEqual(expected);
  });

  it('should find articulation points in simple graph with back edge', () => {
    graph = new Graph();

    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
        [C, D],
        [A, C],
      ]),
    );

    const articulationPointsSet = graph.articulationPoints();
    const vertices_indices = graph.getVerticesKeystoIndices();

    trivia = [
      [articulationPointsSet.length, expectToBe, 1],
      [articulationPointsSet[0], expectToBe, vertices_indices[C.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should find articulation points in simple graph with back edge #2', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [A, E],
      [C, E],
    ];
    graph.addEdges(createEdges(edges_vertices));

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet).toHaveLength(1);
    expect(articulationPointsSet[0]).toBe(vertices_indices[C.getKey()]);
  });

  it('should find articulation points in graph', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [A, C],
      [C, D],
      [D, E],
      [E, G],
      [E, F],
      [G, F],
      [F, H],
    ];

    graph.addEdges(createEdges(edges_vertices));

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    trivia = [
      [articulationPointsSet.length, expectToBe, 4],
      [articulationPointsSet[0], expectToBe, vertices_indices[F.getKey()]],
      [articulationPointsSet[1], expectToBe, vertices_indices[E.getKey()]],
      [articulationPointsSet[2], expectToBe, vertices_indices[D.getKey()]],
      [articulationPointsSet[3], expectToBe, vertices_indices[C.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should find articulation points in graph starting with articulation root vertex', () => {
    graph = new Graph();

    edges_vertices = [
      [D, E],
      [A, B],
      [B, C],
      [A, C],
      [C, D],
      [E, G],
      [E, F],
      [G, F],
      [F, H],
    ];

    graph.addEdges(createEdges(edges_vertices));

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    trivia = [
      [articulationPointsSet.length, expectToBe, 4],
      [articulationPointsSet[0], expectToBe, vertices_indices[F.getKey()]],
      [articulationPointsSet[1], expectToBe, vertices_indices[E.getKey()]],
      [articulationPointsSet[2], expectToBe, vertices_indices[C.getKey()]],
      [articulationPointsSet[3], expectToBe, vertices_indices[D.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should find articulation points in yet another graph #1', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [A, C],
      [B, C],
      [C, D],
      [D, E],
    ];

    edges = createEdges(edges_vertices);
    graph.addEdges(edges);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    trivia = [
      [articulationPointsSet.length, expectToBe, 2],
      [articulationPointsSet[0], expectToBe, vertices_indices[D.getKey()]],
      [articulationPointsSet[1], expectToBe, vertices_indices[C.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should return edges keys', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [A, C],
      [B, C],
    ];
    graph.addEdges(createEdges(edges_vertices));

    result = graph.getAllEdgesKeys();
    expected = ['A_B', 'A_C', 'B_C'];

    expect(result).toEqual(expected);
  });

  it('should return vertices keys', () => {
    graph = new Graph();

    graph.addVertices([A, B, C]);

    result = graph.getAllVerticesKeys();
    expected = ['A', 'B', 'C'];

    expect(result).toEqual(expected);
  });

  it('should return vertex by key', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [A, C],
      [B, C],
    ];
    graph.addEdges(createEdges(edges_vertices));

    result = graph
      .getVerticesByKeys(['A', 'B'])
      .map((vertex) => vertex.getKey());

    expected = ['A', 'B'];

    expect(result).toEqual(expected);
  });

  it('should return false for a non-connected graph', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [D, E],
    ];
    graph.addEdges(createEdges(edges_vertices));

    result = graph.isConnected();
    expected = false;

    expect(result).toBe(expected);
  });

  it('should find articulation points in yet another graph #2', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [A, C],
      [B, C],
      [C, D],
      [C, E],
      [C, F],
      [E, G],
      [F, G],
    ];

    graph.addEdges(createEdges(edges_vertices));

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    trivia = [
      [articulationPointsSet.length, expectToBe, 1],
      [articulationPointsSet[0], expectToBe, vertices_indices[C.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should return true for strongly connected graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [D, A],
      [E, F],
      [F, G],
      [G, H],
      [H, E],
      [D, E],
    ];

    graph.addEdges(createEdges(edges_vertices));

    const SCComponents = graph.getStronglyConnectedComponents();

    result = SCComponents;
    expected = [
      [0, 3, 2, 1],
      [4, 7, 6, 5],
    ];

    expect(result).toEqual(expected);
  });

  it('should return bridges', () => {
    // A directed graph
    graph = new Graph(false);

    // Add edges
    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
        [B, D],
        [C, E],
        [D, E],
        [E, F],
      ]),
    );

    result = graph.bridges();
    expected = [
      [4, 5],
      [0, 1],
    ];

    expect(result).toEqual(expected);
  });

  it('should return bridges ends', () => {
    // A directed graph
    graph = new Graph(false);

    // Add edges
    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
        [B, D],
        [C, E],
        [D, E],
        [E, F],
      ]),
    );

    const edges = graph.getBridgeEdges();

    trivia = [
      [edges[0].getKey(), expectToBeEqual, 'E_F'],
      [edges[1].getKey(), expectToBeEqual, 'A_B'],
    ];

    batchAssert(trivia);
  });

  it('should return bridges dictionary', () => {
    // A directed graph
    graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    // Add edges
    graph.addEdges([AB, BC]);

    result = graph.getBridgeEndIODict();
    expected = {
      0: { to: [1], from: [] },
      1: { to: [2], from: [0] },
      2: { to: [], from: [1] },
    };

    expect(result).toStrictEqual(expected);
  });

  it('should return vertex by index', () => {
    // A directed graph
    let graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add vertices
    graph.addVertices([A, B, C, D, E, F]);

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.getVertexByIndex(0);
    expected = A;

    expect(result).toStrictEqual(expected);
  });

  it('should return islands properties', () => {
    // A directed graph
    //   C          E
    // A -> B -> D -> F
    graph = new Graph(true);

    // Add edges
    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
        [C, B],
        [B, D],
        [D, E],
        [D, F],
        [E, F],
      ]),
    );

    const islands_graphs = graph.getIslandsSubgraphs();

    trivia = [
      [
        graph.islands(),
        expectToStrictEqual,
        {
          0: { bridge_ends: [3], inner_vertices: [4, 5] },
          1: { bridge_ends: [1], inner_vertices: [0, 2] },
        },
      ],
      [
        graph.islandsHabitants(),
        expectToStrictEqual,
        { 0: [3, 4, 5], 1: [1, 0, 2] },
      ],
      [
        graph.getIslandBridgeEndIODict(),
        expectToStrictEqual,
        { 0: { source: [], target: [3] }, 1: { source: [1], target: [] } },
      ],
      [
        graph.getIslandInnerReachability(),
        expectToStrictEqual,
        {
          0: { 3: [4, 5], 4: [5], 5: [] },
          1: { 0: [1, 2], 1: [], 2: [1] },
        },
      ],
      [
        graph.getIslandIOReachability(),
        expectToStrictEqual,
        { 0: { 3: [] }, 1: {} },
      ],
      [
        graph.getIslandToBridgeEndList(),
        expectToStrictEqual,
        { 0: [3], 1: [1] },
      ],
      [graph.getBridgeEndToIsland(), expectToStrictEqual, { 3: 0, 1: 1 }],
      [graph.getIslandFromBridgeEnd(3), expectToStrictEqual, 0],
      [graph.getIslandFromBridgeEnd(1), expectToStrictEqual, 1],
      [
        graph.getIslandsToFromBridgeEnd(),
        expectToStrictEqual,
        { 0: { from: [1], to: [] }, 1: { from: [], to: [3] } },
      ],
      [
        graph
          .getIslandGraph()
          .getAllEdges()
          .map((edge) => edge.getKey()),
        expectToStrictEqual,
        ['1_0'],
      ],
      [
        graph.getIslandToBridgeEndList(),
        expectToStrictEqual,
        { 0: [3], 1: [1] },
      ],
      [graph.getIslandsAdjacencyList(), expectToStrictEqual, { 0: [], 1: [0] }],
      [
        graph.getIslandsFromToIslands(),
        expectToStrictEqual,
        { 0: { to: [], from: [1] }, 1: { to: [0], from: [] } },
      ],
      [
        islands_graphs[0].getAllVerticesKeys(),
        expectToStrictEqual,
        ['D', 'E', 'F'],
      ],
      [
        islands_graphs[1].getAllVerticesKeys(),
        expectToStrictEqual,
        ['A', 'B', 'C'],
      ],
    ];

    batchAssert(trivia);
  });

  it('Cycles in a finite graph must be finite', () => {
    // A directed graph
    graph = new Graph(true);

    // Add edges
    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
      ]),
    );

    result = graph.cyclicCircuits();
    expected = [];

    expect(result).toEqual(expected);
  });

  it('should find edge by vertices in undirected graph', () => {
    graph = new Graph();
    AB = new GraphEdge(A, B, 10);

    graph.addEdge(AB);

    const graphAB = graph.findEdge(A, B);
    const graphEdgeBA = graph.findEdge(B, A);
    const graphAC = graph.findEdge(A, C);
    const graphCA = graph.findEdge(C, A);

    trivia = [
      [graphAC, expectToBeUndefined],
      [graphCA, expectToBeUndefined],
      [graphAB, expectToBeEqual, AB],
      [graphEdgeBA, expectToBeEqual, AB],
      [graphAB.weight, expectToBe, 10],
    ];

    batchAssert(trivia);
  });

  it('should find edge by vertices in directed graph', () => {
    graph = new Graph(true);

    AB = new GraphEdge(A, B, 10);

    graph.addEdge(AB);

    const graphAB = graph.findEdge(A, B);
    const graphEdgeBA = graph.findEdge(B, A);
    const graphAC = graph.findEdge(A, C);
    const graphCA = graph.findEdge(C, A);

    trivia = [
      [graphAC, expectToBeUndefined],
      [graphCA, expectToBeUndefined],
      [graphEdgeBA, expectToBeUndefined],
      [graphAB, expectToBe, AB],
      [graphAB.weight, expectToBe, 10],
    ];

    batchAssert(trivia);
  });

  it('should return vertex neighbors', () => {
    graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );

    const neighbors = graph.getNeighbors(A);

    trivia = [
      [neighbors.length, expectToBeEqual, 2],
      [neighbors[0], expectToBeEqual, B],
      [neighbors[1], expectToBeEqual, C],
    ];

    batchAssert(trivia);
  });

  it('should return vertex neighbors dictionary', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [A, C],
    ];
    graph.addEdges(createEdges(edges_vertices));

    const neighbors = graph.getVerticesNeighbours([0]);

    trivia = [
      [neighbors[0].length, expectToBe, 2],
      [_.isEqual(neighbors[0], [1, 2]), expectToBe, true],
    ];

    batchAssert(trivia);
  });

  it('should return reachable nodes from from_vertex_key', () => {
    let graph = new Graph(true);

    graph.addVertex(D);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );

    result = graph.reachableNodes('A');
    expected = [2, 3];

    expect(result).toEqual(expected);
  });

  it('should return true for reachable node from_vertex_key to to_vertex_key', () => {
    graph = new Graph(true);

    graph.addVertex(D);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );

    trivia = [
      [graph.isReachable('A', 'C'), expectToBe, true],
      [graph.isReachable('A', 'D'), expectToBe, false],
    ];

    batchAssert(trivia);
  });

  it('should return true for predecessor node', () => {
    let graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
      ]),
    );

    trivia = [
      [graph.isPredecessor('B', 'A'), expectToBe, true],
      [graph.isPredecessor('C', 'A'), expectToBe, false],
    ];

    batchAssert(trivia);

    graph = new Graph(true);

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    trivia = [
      [graph.isPredecessor('B', 'A'), expectToBe, true],
      [graph.isPredecessor('C', 'A'), expectToBe, false],
    ];

    batchAssert(trivia);
  });

  it('should return from-reachability list of all nodes', () => {
    graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );
    graph.addVertex(D);

    result = graph.getReachabilityList(0);
    expected = { 0: [1, 2], 1: [], 2: [], 3: [] };

    expect(result).toEqual(expected);
  });

  it('should return to-reachability list of all nodes', () => {
    graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );
    graph.addVertex(D);

    result = graph.getReachabilityList(1);
    expected = { 0: [], 1: [0], 2: [0], 3: [] };

    expect(result).toEqual(expected);
  });

  it('should return number of non-reachable nodes', () => {
    graph = new Graph(true);

    graph.addVertex(D);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );

    result = graph.countUnreachebleNodes('A');
    expected = 1;

    expect(result).toEqual(expected);
  });

  it('should return graph density', () => {
    graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [A, C],
      ]),
    );

    const { density } = graph;

    result = density;
    expected = 2 / 3;

    expect(result).toEqual(expected);
  });

  it('should throw an error when trying to add edge twice', () => {
    graph = new Graph(true);
    AB = new GraphEdge(A, B);
    graph.addEdges([AB, AB]);

    result = warn;
    expected = 1;

    expect(result).toHaveBeenCalledTimes(expected);
  });

  it('should return the list of all added edges', () => {
    graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
      ]),
    );

    edges = graph.getAllEdges();

    trivia = [
      [edges.length, expectToBe, 2],
      [edges[0], expectToBeEqual, AB],
      [edges[1], expectToBeEqual, BC],
    ];

    batchAssert(trivia);
  });

  it('should calculate total graph weight for default graph', () => {
    graph = new Graph();

    [AB, BC, CD, AD] = createEdges([
      [A, B],
      [B, C],
      [C, D],
      [A, D],
    ]);
    graph.addEdges([AB, BC, CD, AD]);

    result = graph.getWeight();
    expected = 0;

    expect(result).toBe(expected);
  });

  it('should calculate total graph weight for weighted graph', () => {
    graph = new Graph();

    AB = new GraphEdge(A, B, 1);
    BC = new GraphEdge(B, C, 2);
    CD = new GraphEdge(C, D, 3);
    AD = new GraphEdge(A, D, 4);

    graph.addEdges([AB, BC, CD, AD]);

    result = graph.getWeight();
    expected = 10;

    expect(result).toBe(expected);
  });

  it('should get vertices to indexes', () => {
    graph = new Graph();

    graph.addVertices([A, B, C]);

    result = graph.getVerticesKeystoIndices();
    expected = { A: 0, B: 1, C: 2 };

    expect(result).toEqual(expected);
  });

  it('should get indexes to vertices', () => {
    graph = new Graph();

    graph.addVertices([A, B, C]);

    result = graph.getVerticesIndicestoKeys();
    expected = { 0: 'A', 1: 'B', 2: 'C' };

    expect(result).toEqual(expected);
  });

  it('should get vertex index', () => {
    graph = new Graph();

    graph.addVertices([A, B, C]);

    trivia = [
      [graph.getVertexIndex(A), expectToBeEqual, 0],
      [graph.getVertexIndex(B), expectToBeEqual, 1],
      [graph.getVertexIndex(C), expectToBeEqual, 2],
    ];

    batchAssert(trivia);
  });

  it('should prove if a graph is cyclic', () => {
    // A directed graph
    graph_ = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph_.addEdges(createEdges(edges_vertices));

    result = graph_.isCyclic();
    expected = true;

    expect(result).toEqual(expected);
  });

  it('should prove if a graph is acyclic', () => {
    // A directed graph
    graph_ = new Graph(true);

    // Add edges
    graph_.addEdges(
      createEdges([
        [A, B],
        [B, C],
      ]),
    );

    result = graph_.isCyclic();
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should be possible to delete edges from graph', () => {
    graph = new Graph();

    [AB, BC, AC] = createEdges([
      [A, B],
      [B, C],
      [A, C],
    ]);
    graph.addEdges([AB, BC, AC]);

    result = graph.getAllEdges().length;
    expected = 3;

    expect(result).toBe(expected);

    graph.deleteEdge(AB);

    trivia = [
      [graph.getAllEdges().length, expectToBe, 2],
      [graph.getAllEdges()[0].getKey(), expectToBe, BC.getKey()],
      [graph.getAllEdges()[1].getKey(), expectToBe, AC.getKey()],
    ];

    batchAssert(trivia);

    graph.deleteEdges(graph.getAllEdges());

    result = graph.edges;
    expected = {};

    expect(result).toStrictEqual(expected);
  });

  it('should throw an error when trying to delete not existing edge', () => {
    graph = new Graph();

    [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdge(AB);
    graph.deleteEdge(BC);

    result = warn;
    expected = 1;

    expect(result).toHaveBeenCalledTimes(expected);
  });

  it('should return cycles from private property', () => {
    graph = new Graph(true);

    // Vertices
    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.cycles;
    expected = [
      [1, 2, 4],
      [1, 2, 5],
    ];

    expect(result).toEqual(expected);
  });

  it('should return size of smallest cycle', () => {
    graph = new Graph(true);

    graph.addEdges(
      createEdges([
        [A, B],
        [B, C],
        [C, D],
        [C, E],
        [E, B],
        [C, F],
        [F, B],
      ]),
    );

    result = graph.girph();
    expected = 3;

    expect(result).toEqual(expected);
  });

  it('should return false for not-connected graph', () => {
    graph = new Graph(true);

    [AB] = createEdges([[A, B]]);

    graph.addVertices([A, B, C]);
    graph.addEdges([AB]);

    result = graph.isConnected();
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should return true for connected graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
    ];
    [AB, BC] = createEdges(edges_vertices);
    graph.addEdges([AB, BC]);

    result = graph.isConnected();
    expected = true;

    expect(result).toEqual(expected);

    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.isConnected();
    expected = true;

    expect(result).toEqual(expected);
  });

  it('should return false for graph without edges', () => {
    graph = new Graph(true);

    graph.addVertices([A, B, C, D, E, F]);

    result = graph.isConnected();
    expected = false;

    expect(result).toEqual(expected);
  });

  it('should return empty for non-eulerian graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
      [B, E],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getEulerianPath();
    expected = [];

    expect(result).toEqual(expected);
  });

  it('should return paths for eulerian graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getEulerianPath();
    expected = [];

    expect(result).toEqual(expected);
  });

  it('should return acyclic paths', () => {
    graph = new Graph(true);

    // Vertices
    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.acyclicPaths(A, F);
    expected = [[0, 1, 2, 5]];

    expect(result).toEqual(expected);
  });

  it('should return all paths from from_key to to_key', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.allPaths(A, D);
    expected = [
      [0, 1, 2, 3],
      [0, 1, 2, 5, 1, 2, 3],
      [0, 1, 2, 4, 1, 2, 3],
    ];

    expect(result).toStrictEqual(expected);
  });

  it('should find hamiltonian paths in graph', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [A, E],
      [A, C],
      [B, E],
      [B, C],
      [B, D],
      [C, D],
      [D, E],
    ];

    graph.addEdges(createEdges(edges_vertices));

    const keysToIds = graph.getVerticesKeystoIndices();

    const hamiltonianCycleSet = [];

    for (const h_cycle of graph.getHamiltonianCycles()) {
      hamiltonianCycleSet.push(h_cycle);
    }

    trivia = [
      [hamiltonianCycleSet.length, expectToBe, 8],
      [hamiltonianCycleSet[0][0], expectToBe, keysToIds[A.getKey()]],
      [hamiltonianCycleSet[0][1], expectToBe, keysToIds[B.getKey()]],
      [hamiltonianCycleSet[0][2], expectToBe, keysToIds[E.getKey()]],
      [hamiltonianCycleSet[0][3], expectToBe, keysToIds[D.getKey()]],
      [hamiltonianCycleSet[0][4], expectToBe, keysToIds[C.getKey()]],
      [hamiltonianCycleSet[1][0], expectToBe, keysToIds[A.getKey()]],
      [hamiltonianCycleSet[1][1], expectToBe, keysToIds[B.getKey()]],
      [hamiltonianCycleSet[1][2], expectToBe, keysToIds[C.getKey()]],
      [hamiltonianCycleSet[1][3], expectToBe, keysToIds[D.getKey()]],
      [hamiltonianCycleSet[1][4], expectToBe, keysToIds[E.getKey()]],
      [hamiltonianCycleSet[2][0], expectToBe, keysToIds[A.getKey()]],
      [hamiltonianCycleSet[2][1], expectToBe, keysToIds[E.getKey()]],
      [hamiltonianCycleSet[2][2], expectToBe, keysToIds[B.getKey()]],
      [hamiltonianCycleSet[2][3], expectToBe, keysToIds[D.getKey()]],
      [hamiltonianCycleSet[2][4], expectToBe, keysToIds[C.getKey()]],
      [hamiltonianCycleSet[3][0], expectToBe, keysToIds[A.getKey()]],
      [hamiltonianCycleSet[3][1], expectToBe, keysToIds[E.getKey()]],
      [hamiltonianCycleSet[3][2], expectToBe, keysToIds[D.getKey()]],
      [hamiltonianCycleSet[3][3], expectToBe, keysToIds[B.getKey()]],
      [hamiltonianCycleSet[3][4], expectToBe, keysToIds[C.getKey()]],
    ];

    batchAssert(trivia);
  });

  it('should not find hamiltonian paths in graph', () => {
    graph = new Graph();

    AB = new GraphEdge(A, B);

    graph.addEdges([AB]);
    graph.addVertex(C);

    result = graph.isCyclicHamiltonian();
    expected = false;

    expect(result).toBe(expected);
  });

  it('should find hamiltonian cycle on graph', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [A, E],
      [A, C],
      [B, E],
      [B, C],
      [B, D],
      [C, D],
      [D, E],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.isCyclicHamiltonian();
    expected = true;

    expect(result).toBe(expected);

    const assertHamiltonianCycles = [];

    for (const h_cycle of graph.getHamiltonianCycles()) {
      assertHamiltonianCycles.push(h_cycle);
    }

    const hamiltonianCycleSet = graph.allPaths('C');

    trivia = [
      [hamiltonianCycleSet.length, expectToBe, 8],
      [
        isCyclicEqual(
          hamiltonianCycleSet[0].slice(1),
          assertHamiltonianCycles[0],
        ),
        expectToBe,
        true,
      ],
      [
        isCyclicEqual(
          hamiltonianCycleSet[1].slice(1),
          assertHamiltonianCycles[1],
        ),
        expectToBe,
        true,
      ],
      [
        isCyclicEqual(
          hamiltonianCycleSet[2].slice(1),
          assertHamiltonianCycles[2],
        ),
        expectToBe,
        true,
      ],
      [
        isCyclicEqual(
          hamiltonianCycleSet[3].slice(1),
          assertHamiltonianCycles[3],
        ),
        expectToBe,
        true,
      ],
    ];

    batchAssert(trivia);
  });

  it('should return [] for all paths in a non-hamiltonian graph', () => {
    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
    ];

    graph = new Graph();
    graph.addEdges(createEdges(edges_vertices));

    result = graph.allPaths('A');
    expected = [];

    expect(result).toStrictEqual(expected);
  });

  it('should return all eulerian paths for graph', () => {
    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [D, E],
      [E, F],
    ];

    graph = new Graph();

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getEulerianPath();
    expected = [0, 1, 2, 3, 4, 5, 0];

    expect(result).toEqual(expected);
  });

  it('should return acyclic paths on non cyclic graph', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [B, D],
      [C, E],
      [D, E],
      [E, F],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.allPaths(A, F);
    expected = [
      [0, 1, 2, 4, 5],
      [0, 1, 3, 4, 5],
    ];

    expect(result).toStrictEqual(expected);
  });

  it('should return cycles of vertices', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.getCycles();
    expected = {
      0: [],
      1: [
        [1, 2, 4],
        [1, 2, 5],
      ],
      2: [
        [1, 2, 4],
        [1, 2, 5],
      ],
      3: [],
      4: [[1, 2, 4]],
      5: [[1, 2, 5]],
    };

    expect(result).toEqual(expected);
  });

  it('should return cycle indices', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];
    graph.addEdges(createEdges(edges_vertices));

    result = graph.getCycleIndices();
    expected = { 0: [1, 2, 4], 1: [1, 2, 5] };

    expect(result).toEqual(expected);
  });

  it('should return source nodes on graph 1', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [C, E],
      [E, B],
      [C, F],
      [F, B],
    ];

    // Add edges
    graph.addEdges(createEdges(edges_vertices));

    result = graph.sinkNodes();
    expected = [3];

    expect(result).toEqual(expected);
  });

  it('should return source nodes on graph 2', () => {
    graph = new Graph(true);

    edges_vertices = [
      [A, B],
      [B, C],
      [D, B],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.sourceNodes();
    expected = [0, 3];

    expect(result).toEqual(expected);
  });

  it('should be possible to reverse graph', () => {
    edges_vertices = [
      [A, B],
      [A, C],
      [C, D],
    ];

    graph = new Graph(true);
    graph.addEdges(createEdges(edges_vertices));

    trivia = [
      [graph.toString(), 'A_B,A_C,C_D'],
      [graph.getAllEdges().length, 3],
      [graph.getNeighbors(A).length, 2],
      [graph.getNeighbors(A)[0].getKey(), B.getKey()],
      [graph.getNeighbors(A)[1].getKey(), C.getKey()],
      [graph.getNeighbors(B).length, 0],
      [graph.getNeighbors(C).length, 1],
      [graph.getNeighbors(C)[0].getKey(), D.getKey()],
      [graph.getNeighbors(D).length, 0],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }

    graph.reverse();

    trivia = [
      [graph.toString(), 'B_A,C_A,D_C'],
      [graph.getAllEdges().length, 3],
      [graph.getNeighbors(A).length, 0],
      [graph.getNeighbors(B).length, 1],
      [graph.getNeighbors(B)[0].getKey(), A.getKey()],
      [graph.getNeighbors(C).length, 1],
      [graph.getNeighbors(C)[0].getKey(), A.getKey()],
      [graph.getNeighbors(D).length, 1],
      [graph.getNeighbors(D)[0].getKey(), C.getKey()],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }
  });

  it('should warn about reversing a undirected graph', () => {
    graph = new Graph(false);

    graph.addEdges(createEdgesFromVerticesValues([['A', 'B']]));

    graph.reverse();

    expect(warn).toHaveBeenCalledOnce();
  });

  it('should return vertices indices', () => {
    graph = new Graph();
    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [B, D],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getVerticesKeystoIndices();
    expected = { A: 0, B: 1, C: 2, D: 3 };

    expect(result).toEqual(expected);
  });

  it('should generate adjacency matrix for undirected graph', () => {
    graph = new Graph();

    edges_vertices = [
      [A, B],
      [B, C],
      [C, D],
      [B, D],
    ];

    graph.addEdges(createEdges(edges_vertices));

    result = graph.getAdjacencyMatrix();
    expected = [
      [Infinity, 0, Infinity, Infinity],
      [0, Infinity, 0, 0],
      [Infinity, 0, Infinity, 0],
      [Infinity, 0, 0, Infinity],
    ];

    expect(result).toEqual(expected);
  });

  it('should generate adjacency matrix for directed graph', () => {
    AB = new GraphEdge(A, B, 2);
    BC = new GraphEdge(B, C, 1);
    CD = new GraphEdge(C, D, 5);
    BD = new GraphEdge(B, D, 7);

    graph = new Graph(true);
    graph.addEdges([AB, BC, CD, BD]);

    result = graph.getAdjacencyMatrix();
    expected = [
      [Infinity, 2, Infinity, Infinity],
      [Infinity, Infinity, 1, 7],
      [Infinity, Infinity, Infinity, 5],
      [Infinity, Infinity, Infinity, Infinity],
    ];

    expect(result).toEqual(expected);
  });
});
