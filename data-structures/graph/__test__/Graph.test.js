import _ from "lodash";
import Graph from "../Graph";
import GraphVertex from "../GraphVertex";
import GraphEdge from "../GraphEdge";

import {
  createVertices,
  createEdges,
  createEdgesFromVerticesValues,
} from "../utils/graph.js";

import { ones, isCyclicEqual } from "../../../utils/arrays/arrays";

import { throwError, warn } from "../../../utils/sys/sys.js";

jest.mock("../../../utils/sys/sys.js");

const A = new GraphVertex("A");
const B = new GraphVertex("B");
const C = new GraphVertex("C");
const D = new GraphVertex("D");
const E = new GraphVertex("E");
const F = new GraphVertex("F");
const G = new GraphVertex("G");
const H = new GraphVertex("H");

let AB, AC, AD, AE, BC, BD,BE, CA, CB, CD, CE, CF, DA,DB, 
    DC, DE, DF, EB, EF, EG, FA, FB, FD, FG, FH, GF, GH;

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

beforeEach(() => {
  // restore the spy created with spyOn
  A.deleteAllEdges();
  B.deleteAllEdges();
  C.deleteAllEdges();
  D.deleteAllEdges();
  E.deleteAllEdges();
  F.deleteAllEdges();
  G.deleteAllEdges();
  H.deleteAllEdges();
});

describe("Graph", () => {
  it("should add vertices to graph", () => {
    const graph = new Graph();

    const [A, B] = createVertices(["A", "B"]);

    graph.addVertices([A, B]);

    expect(graph.toString()).toBe("");
    expect(graph.getVertexByKey(A.getKey())).toEqual(A);
    expect(graph.getVertexByKey(B.getKey())).toEqual(B);
  });

  it("should get vertex by its index", () => {
    const graph = new Graph();

    const [A, B] = createVertices(["A", "B"]);

    graph.addVertices([A, B]);

    const vertex = graph.getVertexByIndex(0);

    expect(vertex.getKey()).toEqual("A");
  });

  it("should serialize and deserialize graph", () => {
    const graph = new Graph(true);
    const graph_ = new Graph(true);

    const [AB, BC, CD] = createEdgesFromVerticesValues([
      ["A", "B"],
      ["B", "C"],
      ["C", "D"],
    ]);

    graph.addEdges([AB, BC]);

    const graph_serialization_ = graph.serialize();
    let graph_serialization = graph.serialize();

    expect(graph_serialization).toEqual({
      isDirected: true,
      nodes: [
        { id: "A", value: 0 },
        { id: "B", value: 0 },
        { id: "C", value: 0 },
      ],
      edges: [
        { source: "A", target: "B", weight: 0 },
        { source: "B", target: "C", weight: 0 },
      ],
    });

    // Deserialize graph serialization with its json representation
    graph.addEdge(CD);
    graph_serialization = graph.serialize();
    graph.empty();
    graph.addEdges([AB, BC]);
    graph.deserialize(graph_serialization);

    expect(graph.getNumVertices()).toBe(4);

    graph_.deserialize(graph_serialization_);
    const edges = graph_.getAllEdges();

    expect(graph_.getNumVertices()).toBe(3);
    expect(edges.length).toBe(2);

    expect(edges[0].toString()).toBe("A_B");
    expect(edges[1].toString()).toBe("B_C");
    expect(edges[2]).toBeUndefined();
  });

  it("should throw error for graph in other direction than serialization", () => {
    const graph = new Graph(true);

    const [AB, BC] = createEdgesFromVerticesValues([
      ["A", "B"],
      ["B", "C"],
    ]);

    graph.addEdges([AB, BC]);

    const mock_graph = { isDirected: false };
    graph.deserialize(mock_graph);

    expect(throwError).toHaveBeenCalledTimes(1);
  });

  it("should return edges from index chain", () => {
    const graph = new Graph(true);
    const [AB, BC] = createEdgesFromVerticesValues([
      ["A", "B"],
      ["B", "C"],
    ]);

    graph.addEdges([AB, BC]);

    expect(graph.getEdgesFromChain([0, 1, 2]).length).toBe(2);
  });

  it("should return edges from index chain", () => {
    const graph = new Graph(true);
    const [AB, BC] = createEdgesFromVerticesValues([
      ["A", "B"],
      ["B", "C"],
    ]);

    graph.addEdges([AB, BC]);

    graph.getEdgesFromChain([0, 2]);

    expect(throwError).toHaveBeenCalled();
  });

  it("should get vertices by indexes", () => {
    const graph = new Graph();

    const [A, B] = createVertices(["A", "B"]);

    graph.addVertices([A, B]);

    const vertices_index = graph
      .getVerticesByIndexes([0, 1])
      .map((vertex) => vertex.getKey());

    expect(vertices_index).toEqual(["A", "B"]);
  });

  it("should get vertices keys", () => {
    const graph = new Graph();

    const [A, B] = createVertices(["A", "B"]);

    graph.addVertices([A, B]);

    expect(graph.getVerticesKeys()).toEqual(["A", "B"]);
  });

  it("should throw a warning for added repeated vertices", () => {
    const graph = new Graph();

    const [A] = createVertices(["A"]);
    graph.addVertex(A);
    graph.addVertex(A);

    expect(throwError).toHaveBeenCalledTimes(1);
  });

  it("should return true for a valid chain", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Edges
    const [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B], [B, C], [C, D], [C, E], [E, B], [C, F], [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.isChain([0, 1, 2, 3])).toBe(true);
  });

  it("should return false for a invalid chain", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Edges
    const [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B], [B, C], [C, D], [C, E], [E, B], [C, F], [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.isChain([0, 1, 2, 1])).toEqual(false);
  });

  it("should return true for a empty graph", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C] = createVertices(["A", "B", "C"]);

    // Add vertices
    graph.addVertices([A, B, C]);

    expect(graph.isEmpty()).toEqual(true);
  });

  it("should return the graph description", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C] = createVertices(["A", "B", "C"]);
    const [AB, BC] = createEdges([ [A, B], [B, C], ]);

    // Add vertices
    graph.addEdges([AB, BC]);

    expect(
      _.isEqual(graph.describe(), {
        vertices: "A,B,C",
        edges: "A_B,B_C",
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
      })
    ).toEqual(true);
  });

  it("should return false for a non-empty graph", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C] = createVertices(["A", "B", "C"]);

    // Add vertices
    graph.addVertices([A, B, C]);

    // Edges
    const [AB] = createEdges([[A, B]]);

    // Add edges
    graph.addEdges([AB]);

    expect(graph.isEmpty()).toEqual(false);
  });

  it("should get edges by vertex keys", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([ [A, B], [B, C], ]);

    graph.addEdges([AB, BC]);

    let edges = graph.getEdgesByVertexKeys(["A", "B"], false);

    let edge_keys = [];
    edges.forEach((edge) => {
      edge_keys.push(edge.getKey());
    });

    const expected = [ "A_B", "B_C", ] 

    expect(edge_keys).toEqual(["A_B", "B_C"]);
    expect(graph.getEdgesKeysByVertexKeys(["A", "B"], false)).toEqual(expected);

    edges = graph.getEdgesByVertexKeys(["A", "B"], true);

    edge_keys = [];
    edges.forEach((edge) => {
      edge_keys.push(edge.getKey());
    });

    expect(edge_keys).toEqual(["A_B"]);
    expect(graph.getEdgesKeysByVertexKeys(["A", "B"], true)).toEqual(["A_B"]);
  });

  it("should get edges by vertex keys", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edge = graph.findEdgeByVertexIndices(0, 1);

    expect(edge.getKey()).toEqual("A_B");
  });

  it("should get edges by vertex keys", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edge = graph.findEdgeByVertexIndices(0, 3);

    expect(edge).toBe(undefined);
  });

  it("should get edges by vertex keys", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edges = graph.findEdgesByVertexIndicesTuples([
      [0, 1],
      [1, 2],
    ]);

    expect(edges[0].getKey()).toEqual("A_B");
    expect(edges[1].getKey()).toEqual("B_C");
  });

  it("should get undefined for undefined start vertex index", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edges = graph.findEdgesByVertexIndicesTuples([[3, 4]]);

    expect(edges[0]).toBe(undefined);
  });

  it("should get undefined for undefined start vertex index", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edges = graph.findEdgesByVertexIndicesTuples([[3, 4]]);

    expect(edges[0]).toBe(undefined);
  });

  it("should add edge to the same vertex", () => {
    const graph = new Graph();
    const keys = ["A"];

    const [A] = createVertices(keys);
    const [AA] = createEdges([[A, A]]);

    graph.addEdges([AA]);

    expect(Object.keys(graph.edges)).toEqual(["A_A"]);
  });

  it("should get edges by vertex keys", () => {
    const graph = new Graph();
    const keys = ["A", "B", "C"];
    const vertexKeys = ["A", "B"];

    const [A, B, C] = createVertices(keys);
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    graph.addEdges([AB, BC]);

    const edge_keys = graph.getEdgesKeysByVertexKeys(vertexKeys, true);

    expect(edge_keys).toEqual(["A_B"]);
  });

  it("should add edges to undirected graph", () => {
    const graph = new Graph();

    const [A, B] = createVertices(["A", "B"]);

    const AB = new GraphEdge(A, B);

    graph.addEdge(AB);

    expect(graph.getAllVertices().length).toBe(2);
    expect(graph.getAllVertices()[0]).toEqual(A);
    expect(graph.getAllVertices()[1]).toEqual(B);

    const graphA = graph.getVertexByKey(A.getKey());
    const graphB = graph.getVertexByKey(B.getKey());

    expect(graph.toString()).toBe("A_B");
    expect(graphA).toBeDefined();
    expect(graphB).toBeDefined();

    expect(graph.getVertexByKey("not existing vertex")).toBeUndefined();

    expect(graphA.getNeighbors().length).toBe(1);
    expect(graphA.getNeighbors()[0]).toEqual(B);
    expect(graphA.getNeighbors()[0]).toEqual(graphB);

    expect(graphB.getNeighbors().length).toBe(1);
    expect(graphB.getNeighbors()[0]).toEqual(A);
    expect(graphB.getNeighbors()[0]).toEqual(graphA);
  });

  it("should add edges to directed graph", () => {
    const graph = new Graph(true);

    const [A, B] = createVertices(["A", "B"]);

    const AB = new GraphEdge(A, B);

    graph.addEdge(AB);

    const graphA = graph.getVertexByKey(A.getKey());
    const graphB = graph.getVertexByKey(B.getKey());

    expect(graph.toString()).toBe("A_B");
    expect(graphA).toBeDefined();
    expect(graphB).toBeDefined();

    expect(graphA.getNeighbors().length).toBe(1);
    expect(graphA.getNeighbors()[0]).toEqual(B);
    expect(graphA.getNeighbors()[0]).toEqual(graphB);

    expect(graphB.getNeighbors().length).toBe(0);
  });

  it("should check if vertex and edge exist", () => {
    const graph = new Graph();

    const [A, B] = createVertices(["A", "B"]);

    graph.addVertices([A, B]);

    // Edges
    const [AB] = createEdges([[A, B]]);
    graph.addEdge(AB);

    expect(graph.hasVertex(A.getKey())).toBe(true);
    expect(graph.hasEdge(AB.getKey())).toBe(true);
  });

  it("should copy directed graph but undirected", () => {
    // A directed graph
    const graph_ = new Graph(true);

    // Nodes
    const [A, B] = createVertices(["A", "B"]);

    // Vertices
    const AB = new GraphEdge(A, B);

    graph_.addEdge(AB);

    // Add edges
    const graph_undirected = graph_.retrieveUndirected();

    expect(graph_undirected.isDirected).toEqual(false);
  });

  it("should copy undirected graph", () => {
    // A directed graph
    const graph_ = new Graph(false);

    // Nodes
    const [A, B] = createVertices(["A", "B"]);

    // Vertices
    const AB = new GraphEdge(A, B);

    graph_.addEdge(AB);

    // Add edges
    const graph_undirected = graph_.retrieveUndirected();

    expect(graph_undirected.isDirected).toEqual(false);
  });

  it("Cycles in a finite graph must be finite", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Edges
    const [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B], [B, C], [C, D], [C, E], [E, B], [C, F], [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.cyclicCircuits()).toStrictEqual([
      [1, 2, 4], [1, 2, 5],
    ]);
  });

  it("should return self-cycles", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A] = createVertices(["A"]);

    // Edges
    const [AA] = createEdges([[A, A]]);

    // Add edges
    graph.addEdges([AA]);

    expect(graph.cyclicCircuits()).toStrictEqual([[0]]);
  });

  it("Cycles in a finite graph must be finite", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Edges
    const [AB, BC, CD, CE, EB, CF, FB] = createEdges([
      [A, B], [B, C], [C, D], [C, E], [E, B], [C, F], [F, B],
    ]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.cyclicCircuits()).toStrictEqual([
      [1, 2, 4], [1, 2, 5],
    ]);
  });

  it("should find Eulerian Circuit in graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD, DE, EF]);

    expect(graph.getEulerianPath()).toStrictEqual([0, 1, 2, 3, 4, 5, 0]);
  });

  it("should find Eulerian Circuit in graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const BE = new GraphEdge(B, E);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD, DE, EF, BE]);

    expect(graph.isEulerian()).toStrictEqual(false);
  });

  it("should return false for a non-eulerian directed graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(B, D);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD]);

    expect(graph.isEulerian()).toStrictEqual(false);
    expect(graph.isEulerianCycle()).toStrictEqual(false);
  });

  it("should return true for an eulerian directed graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DA = new GraphEdge(D, A);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD, DA]);

    expect(graph.isEulerian()).toStrictEqual(true);
    expect(graph.isEulerianCycle()).toStrictEqual(true);
  });

  it("should return false for an directed graph with different in and out edge flow", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD]);

    expect(graph.isEulerian()).toStrictEqual(false);
  });

  it("should return 0 for an eulerian undirected graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(B, D);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD]);

    expect(graph.isEulerian()).toStrictEqual(0);
  });

  it("should return 0 for an eulerian undirected graph", () => {
    const graph = new Graph();

    graph.addVertices([A, B, C]);

    expect(graph.isEulerian()).toStrictEqual(0);
  });

  it("should return 0 for non-eulerian graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(B, D);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD]);

    expect(graph.isEulerian()).toStrictEqual(0);
  });

  it("should return 0 for non-eulerian graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    const graph = new Graph();

    graph.addEdges([AB, BC]);

    expect(graph.empty().getAllEdges().length).toStrictEqual(0);
  });

  it("should return 1 for an eulerian path of directed graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD, DE, EF]);

    expect(graph.isEulerian()).toStrictEqual(1);
  });

  it("should return 2 for an eulerian cycle of directed graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const FA = new GraphEdge(F, A);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD, DE, EF, FA]);

    expect(graph.isEulerian()).toStrictEqual(2);
  });

  it("should return reverse star representation of a graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const FA = new GraphEdge(F, A);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD, DE, EF, FA]);

    expect(graph.getAdjacencyList(1)).toEqual({
      0: [5],
      1: [0],
      2: [1],
      3: [2],
      4: [3],
      5: [4],
    });
  });

  it("should return reverse star representation of a graph and volume of graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const FA = new GraphEdge(F, A);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD, DE, EF, FA]);

    expect(graph.getInOutDegreeList(0)).toEqual({
      0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1,
    });

    expect(graph.getInOutDegreeList(1)).toEqual({
      0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 
    });

    const n_vertices = graph.getNumVertices();

    expect(graph.volume(_.range(n_vertices), 0)).toEqual(6);
    expect(graph.volume(_.range(n_vertices), 1)).toEqual(6);

    expect(graph.getForwardDegrees()).toEqual(ones(6));
    expect(graph.getReverseDegrees()).toEqual(ones(6));
  });

  it("should return true for bipartite graph", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Edges
    const [
      AD, AE, AF, BD, BE, BF, CD, CE, CF, DA, DB, DC, EA, EB, EC, FA, FB, FC,
    ] = createEdges([
      [A, D], [A, E], [A, F], [B, D], [B, E], [B, F], [C, D], [C, E], [C, F], 
      [D, A], [D, B], [D, C], [E, A], [E, B], [E, C], [F, A], [F, B], [F, C],
    ]);

    // Add edges
    graph.addEdges([
      AD, AE, AF, BD, BE, BF, CD, CE, CF, DA, DB, DC, EA, EB, EC, FA, FB, FC,
    ]);

    expect(graph.isBipartite()).toEqual(true);
  });

  it("should return false for non-bipartite graph", () => {
    // A directed graph
    const graph = new Graph(false);

    // Vertices
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Edges
    const [AB, AC, BC, BD, DE, DF, FE] = createEdges([
      [A, B], [A, C], [B, C], [B, D], [D, E], [D, F], [F, E],
    ]);

    // Add edges
    graph.addEdges([AB, AC, BC, BD, DE, DF, FE]);

    expect(graph.isBipartite()).toEqual(false);
  });

  it("should return true for strongly connected graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DC = new GraphEdge(D, C);
    const BD = new GraphEdge(B, D);
    const CA = new GraphEdge(C, A);

    const graph = new Graph(true);

    graph.addEdges([AB, BC, CD, DC, BD, CA]);

    expect(graph.isStronglyConnected()).toEqual(true);
  });

  it("should return circuits in a graph", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add vertices
    graph.addVertices([A, B, C, D, E, F]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.cyclicCircuits()).toStrictEqual([
      [1, 2, 4],
      [1, 2, 5],
    ]);
  });

  it("should return strongly connected dictionary in a graph", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CA = new GraphEdge(C, A);
    const BD = new GraphEdge(B, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const FD = new GraphEdge(F, D);

    // Add edges
    graph.addEdges([AB, BC, CA, BD, DE, EF, FD]);

    const str1 = JSON.stringify(graph.getStronglyConnectedComponentsIndices());
    const str2 = JSON.stringify({
      0: [0, 2, 1],
      1: [3, 5, 4],
    });

    expect(str1 === str2).toEqual(true);
  });

  it("should return strongly connected dictionary in a graph", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CA = new GraphEdge(C, A);
    const BD = new GraphEdge(B, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const FD = new GraphEdge(F, D);

    // Add edges
    graph.addEdges([AB, BC, CA, BD, DE, EF, FD]);

    const str1 = JSON.stringify(graph.getMapSCCToBindingPoints());
    const str2 = JSON.stringify({
      0: [1],
      1: [3],
    });

    expect(str1 === str2).toBe(true);
  });

  it("should return articulation points in a graph", () => {
    // A directed graph
    const graph = new Graph(false);

    // Vertices
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);
    const BD = new GraphEdge(B, D);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const EG = new GraphEdge(E, G);
    const FH = new GraphEdge(F, H);
    const GH = new GraphEdge(G, H);

    // Add edges
    graph.addEdges([AB, AC, BD, CD, DE, EF, EG, FH, GH]);

    expect(graph.articulationPoints()).toStrictEqual([4, 3]);
  });

  it("should find articulation points in simple graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD]);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(2);
    expect(articulationPointsSet[0]).toBe(vertices_indices[C.getKey()]);
    expect(articulationPointsSet[1]).toBe(vertices_indices[B.getKey()]);
  });

  it("should find articulation points in simple graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD]);

    const ids = graph.convertVerticestoVerticesIndices([ A, B, C, D, ]);

    expect(_.isEqual(ids, [0, 1, 2, 3])).toBe(true);
  });

  it("should return vertices indices from edge", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD]);

    const ids = graph.convertEdgeToVerticesIndices(AB);

    expect(_.isEqual(ids, [0, 1])).toBe(true);
  });

  it("should return vertices indices from edges", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD]);

    const ids = graph.convertEdgesToVerticesIndices([AB, BC, CD]);

    expect(
      _.isEqual(ids, [
        [0, 1],
        [1, 2],
        [2, 3],
      ])
    ).toBe(true);
  });

  it("should find articulation points in simple graph with back edge", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const AC = new GraphEdge(A, C);

    const graph = new Graph();

    graph.addEdges([AB, AC, BC, CD]);

    const articulationPointsSet = graph.articulationPoints();
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(1);
    expect(articulationPointsSet[0]).toBe(vertices_indices[C.getKey()]);
  });

  it("should find articulation points in simple graph with back edge #2", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const AE = new GraphEdge(A, E);
    const CE = new GraphEdge(C, E);

    const graph = new Graph();

    graph.addEdges([AB, AE, CE, BC, CD]);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(1);
    expect(articulationPointsSet[0]).toBe(vertices_indices[C.getKey()]);
  });

  it("should find articulation points in graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const AC = new GraphEdge(A, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EG = new GraphEdge(E, G);
    const EF = new GraphEdge(E, F);
    const GF = new GraphEdge(G, F);
    const FH = new GraphEdge(F, H);

    const graph = new Graph();

    graph.addEdges([
      AB, BC, AC, CD, DE, EG, EF, GF, FH,
    ]);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(4);
    expect(articulationPointsSet[0]).toBe(vertices_indices[F.getKey()]);
    expect(articulationPointsSet[1]).toBe(vertices_indices[E.getKey()]);
    expect(articulationPointsSet[2]).toBe(vertices_indices[D.getKey()]);
    expect(articulationPointsSet[3]).toBe(vertices_indices[C.getKey()]);
  });

  it("should find articulation points in graph starting with articulation root vertex", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const AC = new GraphEdge(A, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EG = new GraphEdge(E, G);
    const EF = new GraphEdge(E, F);
    const GF = new GraphEdge(G, F);
    const FH = new GraphEdge(F, H);

    const graph = new Graph();

    graph.addEdges([
      DE, AB, BC, AC, CD, EG, EF, GF, FH,
    ]);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(4);
    expect(articulationPointsSet[0]).toBe(vertices_indices[F.getKey()]);
    expect(articulationPointsSet[1]).toBe(vertices_indices[E.getKey()]);
    expect(articulationPointsSet[2]).toBe(vertices_indices[C.getKey()]);
    expect(articulationPointsSet[3]).toBe(vertices_indices[D.getKey()]);
  });

  it("should find articulation points in yet another graph #1", () => {
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);

    const graph = new Graph();

    graph.addEdges([AB, AC, BC, CD, DE]);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(2);
    expect(articulationPointsSet[0]).toBe(vertices_indices[D.getKey()]);
    expect(articulationPointsSet[1]).toBe(vertices_indices[C.getKey()]);
  });

  it("should return edges keys", () => {
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(B, C);
    const BC = new GraphEdge(C, D);

    const graph = new Graph();

    graph.addEdges([AB, AC, BC]);

    expect(graph.getAllEdgesKeys()).toEqual(["A_B", "B_C", "C_D"]);
  });

  it("should return vertices keys", () => {
    const graph = new Graph();

    graph.addVertices([A, B, C]);

    expect(graph.getAllVerticesKeys()).toEqual(["A", "B", "C"]);
  });

  it("should return vertex by key", () => {
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(B, C);
    const BC = new GraphEdge(C, D);

    const graph = new Graph();

    graph.addEdges([AB, AC, BC]);

    const vertices = graph
      .getVerticesByKeys(["A", "B"])
      .map((vertex) => vertex.getKey());

    expect(vertices).toEqual(["A", "B"]);
  });

  it("should return false for a non-connected graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const DE = new GraphEdge(D, E);

    const graph = new Graph();

    graph.addEdges([AB, BC, DE]);

    expect(graph.isConnected()).toBe(false);
  });

  it("should find articulation points in yet another graph #2", () => {
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const CF = new GraphEdge(C, F);
    const EG = new GraphEdge(E, G);
    const FG = new GraphEdge(F, G);

    const graph = new Graph();

    graph.addEdges([
      AB, AC, BC, CD, CE, CF, EG, FG,
    ]);

    const articulationPointsSet = Object.values(graph.articulationPoints());
    const vertices_indices = graph.getVerticesKeystoIndices();

    expect(articulationPointsSet.length).toBe(1);
    expect(articulationPointsSet[0]).toBe(vertices_indices[C.getKey()]);
  });

  it("should return true for strongly connected graph", () => {
    const vertex_keys = ["A", "B", "C", "D", "E", "F", "G", "H"];

    const [A, B, C, D, E, F, G, H] = createVertices(vertex_keys);

    const [AB, AC, CD, BD, EF, EG, FH, GH, DE] = createEdges([
      [A, B], [B, C], [C, D], [D, A], [E, F],  [F, G], [G, H], [H, E], [D, E],
    ]);

    const graph = new Graph(true);

    graph.addEdges([AB, AC, CD, BD, EF, EG, FH, GH, DE]);

    const SCComponents = graph.getStronglyConnectedComponents();

    expect(SCComponents).toEqual([
      [0, 3, 2, 1],
      [4, 7, 6, 5],
    ]);
  });

  it("should return bridges", () => {
    // A directed graph
    const graph = new Graph(false);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const BD = new GraphEdge(B, D);
    const CE = new GraphEdge(C, E);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);

    // Add edges
    graph.addEdges([AB, BC, BD, CE, DE, EF]);

    expect(graph.bridges()).toEqual([
      [4, 5],
      [0, 1],
    ]);
  });

  it("should return bridges ends", () => {
    // A directed graph
    const graph = new Graph(false);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const BD = new GraphEdge(B, D);
    const CE = new GraphEdge(C, E);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);

    // Add edges
    graph.addEdges([AB, BC, BD, CE, DE, EF]);

    const edges = graph.getBridgeEdges();

    expect(edges[0].getKey()).toEqual("E_F");
    expect(edges[1].getKey()).toEqual("A_B");
  });

  it("should return bridges dictionary", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    // Add edges
    graph.addEdges([AB, BC]);

    expect(JSON.stringify(graph.getBridgeEndIODict())).toEqual(
      JSON.stringify({
        0: { to: [1], from: [] },
        1: { to: [2], from: [0] },
        2: { to: [], from: [1] },
      })
    );
  });

  it("should return vertex by index", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add vertices
    graph.addVertices([A, B, C, D, E, F]);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.getVertexByIndex(0)).toStrictEqual(A);
  });

  it("should return islands properties", () => {
    // A directed graph
    //   C          E
    // A -> B -> D -> F
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);
    const CB = new GraphEdge(C, B);
    const BD = new GraphEdge(B, D);
    const DE = new GraphEdge(D, E);
    const DF = new GraphEdge(D, F);
    const EF = new GraphEdge(E, F);

    // Add edges
    graph.addEdges([AB, AC, CB, BD, DE, DF, EF]);

    expect(JSON.stringify(graph.islands())).toBe(
      JSON.stringify({
        0: {
          bridge_ends: [3],
          inner_vertices: [4, 5],
        },
        1: {
          bridge_ends: [1],
          inner_vertices: [0, 2],
        },
      })
    );

    expect(graph.islandsHabitants()).toEqual({
      0: [3, 4, 5],
      1: [1, 0, 2],
    });

    expect(graph.getIslandBridgeEndIODict()).toEqual({
      0: {
        source: [],
        target: [3],
      },
      1: {
        source: [1],
        target: [],
      },
    });

    expect(graph.getIslandInnerReachability()).toEqual({
      0: {
        3: [4, 5],
        4: [5],
        5: [],
      },
      1: {
        0: [1, 2],
        1: [],
        2: [1],
      },
    });

    expect(graph.getIslandIOReachability()).toEqual({
      0: {
        3: [],
      },
      1: {},
    });

    expect(JSON.stringify(graph.getIslandToBridgeEndList())).toBe(
      JSON.stringify({
        0: [3],
        1: [1],
      })
    );

    expect(JSON.stringify(graph.getBridgeEndToIsland())).toBe(
      JSON.stringify({
        3: 0,
        1: 1,
      })
    );

    expect(graph.getIslandFromBridgeEnd(3)).toBe(0);
    expect(graph.getIslandFromBridgeEnd(1)).toBe(1);

    expect(JSON.stringify(graph.getIslandsToFromBridgeEnd())).toBe(
      JSON.stringify({
        0: {
          from: [1],
          to: [],
        },
        1: {
          from: [],
          to: [3],
        },
      })
    );

    expect(JSON.stringify(graph.getIslandsAdjacencyList())).toBe(
      JSON.stringify({
        0: [],
        1: [0],
      })
    );

    expect(JSON.stringify(graph.getIslandsFromToIslands())).toBe(
      JSON.stringify({
        0: {
          to: [],
          from: [1],
        },
        1: {
          to: [0],
          from: [],
        },
      })
    );

    expect(
      graph
        .getIslandGraph()
        .getAllEdges()
        .map((edge) => edge.getKey())
    ).toStrictEqual(["1_0"]);

    const islands_graphs = graph.getIslandsSubgraphs();

    expect(islands_graphs[0].getAllVerticesKeys()).toEqual(["D", "E", "F"]);

    expect(islands_graphs[1].getAllVerticesKeys()).toEqual(["A", "B", "C"]);
  });

  it("should return islands properties", () => {
    // A directed graph
    //   ,C,       ,E,
    // A -> B -> D -> F
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);

    // Add edges
    graph.addEdges([AB]);

    expect(graph.getIslandInnerReachability()).toEqual({
      0: {
        1: [1],
      },
      1: {
        0: [0],
      },
    });
  });

  it("Cycles in a finite graph must be finite", () => {
    // A directed graph
    const graph = new Graph(true);

    // Vertices
    const [A, B, C] = createVertices(["A", "B", "C"]);

    // Edges
    const [AB, BC] = createEdges([
      [A, B],
      [B, C],
    ]);

    // Add edges
    graph.addEdges([AB, BC]);

    expect(graph.cyclicCircuits()).toEqual([]);
  });

  it("should find edge by vertices in undirected graph", () => {
    const graph = new Graph();

    const AB = new GraphEdge(A, B, 10);

    graph.addEdge(AB);

    const graphAB = graph.findEdge(A, B);
    const graphEdgeBA = graph.findEdge(B, A);
    const graphAC = graph.findEdge(A, C);
    const graphCA = graph.findEdge(C, A);

    expect(graphAC).toBeUndefined();
    expect(graphCA).toBeUndefined();
    expect(graphAB).toEqual(AB);
    expect(graphEdgeBA).toEqual(AB);
    expect(graphAB.weight).toBe(10);
  });

  it("should find edge by vertices in directed graph", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B, 10);

    graph.addEdge(AB);

    const graphAB = graph.findEdge(A, B);
    const graphEdgeBA = graph.findEdge(B, A);
    const graphAC = graph.findEdge(A, C);
    const graphCA = graph.findEdge(C, A);

    expect(graphAC).toBeUndefined();
    expect(graphCA).toBeUndefined();
    expect(graphEdgeBA).toBeUndefined();
    expect(graphAB).toEqual(AB);
    expect(graphAB.weight).toBe(10);
  });

  it("should return vertex neighbors", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    const neighbors = graph.getNeighbors(A);

    expect(neighbors.length).toBe(2);
    expect(neighbors[0]).toEqual(B);
    expect(neighbors[1]).toEqual(C);
  });

  it("should return vertex neighbors dictionary", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    const neighbors = graph.getVerticesNeighbours([0]);

    expect(neighbors[0].length).toBe(2);
    expect(_.isEqual(neighbors[0], [1, 2])).toBe(true);
  });

  it("should return reachable nodes from from_vertex_key", () => {
    const graph = new Graph(true);

    graph.addVertex(D);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    expect(graph.reachableNodes("A")).toEqual([2, 3]);
  });

  it("should return true for reachable node from_vertex_key to to_vertex_key", () => {
    const graph = new Graph(true);

    graph.addVertex(D);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    expect(graph.isReachable("A", "C")).toBe(true);
    expect(graph.isReachable("A", "D")).toBe(false);
  });

  it("should return true for predecessor node", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(B, C);

    graph.addEdges([AB, AC]);

    expect(graph.isPredecessor("B", "A")).toBe(true);
    expect(graph.isPredecessor("C", "A")).toBe(false);
  });

  it("should return true for predecessor node", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(B, C);

    graph.addEdges([AB, AC]);

    expect(graph.isPredecessor("B", "A")).toBe(true);
    expect(graph.isPredecessor("C", "A")).toBe(false);
  });

  it("should return from-reachability list of all nodes", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    graph.addVertex(D);

    expect(graph.getReachabilityList(0)).toEqual({
      0: [1, 2],
      1: [],
      2: [],
      3: [],
    });
  });

  it("should return from-reachability list of all nodes", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);
    graph.addVertex(D);

    expect(graph.getReachabilityList(0)).toEqual({
      0: [1, 2],
      1: [],
      2: [],
      3: [],
    });
  });

  it("should return to-reachability list of all nodes", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    graph.addVertex(D);

    expect(graph.getReachabilityList(1)).toEqual({
      0: [],
      1: [0],
      2: [0],
      3: [],
    });
  });

  it("should return number of non-reachable nodes", () => {
    const graph = new Graph(true);

    graph.addVertex(D);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    expect(graph.countUnreachebleNodes("A")).toEqual(1);
  });

  it("should return graph density", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, AC]);

    const { density } = graph;

    expect(density).toEqual(2 / 3);
  });

  it("should throw an error when trying to add edge twice", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);

    graph.addEdges([AB, AB]);

    expect(warn).toBeCalledTimes(1);
  });

  it("should return the list of all added edges", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    graph.addEdges([AB, BC]);

    const edges = graph.getAllEdges();

    expect(edges.length).toBe(2);
    expect(edges[0]).toEqual(AB);
    expect(edges[1]).toEqual(BC);
  });

  it("should calculate total graph weight for default graph", () => {
    const graph = new Graph();

    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const AD = new GraphEdge(A, D);

    graph.addEdges([AB, BC, CD, AD]);

    expect(graph.getWeight()).toBe(0);
  });

  it("should calculate total graph weight for weighted graph", () => {
    const graph = new Graph();

    const AB = new GraphEdge(A, B, 1);
    const BC = new GraphEdge(B, C, 2);
    const CD = new GraphEdge(C, D, 3);
    const AD = new GraphEdge(A, D, 4);

    graph.addEdges([AB, BC, CD, AD]);

    expect(graph.getWeight()).toBe(10);
  });

  it("should get vertices to indexes", () => {
    const graph = new Graph();

    graph.addVertices([A, B, C]);

    expect(graph.getVerticesKeystoIndices()).toEqual({
      A: 0,
      B: 1,
      C: 2,
    });
  });

  it("should get indexes to vertices", () => {
    const graph = new Graph();

    graph.addVertices([A, B, C]);

    expect(graph.getVerticesIndicestoKeys()).toEqual({
      0: "A",
      1: "B",
      2: "C",
    });
  });

  it("should get vertex index", () => {
    const graph = new Graph();

    graph.addVertices([A, B, C]);

    expect(graph.getVertexIndex(A)).toEqual(0);
    expect(graph.getVertexIndex(C)).toEqual(2);
    expect(graph.getVertexIndex(B)).toEqual(1);
  });

  it("should prove if a graph is cyclic", () => {
    // A directed graph
    const graph_ = new Graph(true);

    // Nodes
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Vertices
    const [AB, BC, CD, CE, EB, CF, FB] = new createEdges([
      [A, B], [B, C], [C, D], [C, E], [E, B], [C, F], [F, B],
    ]);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.isCyclic()).toEqual(true);
  });

  it("should prove if a graph is acyclic", () => {
    // A directed graph
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    // Add edges
    graph_.addEdges([AB, BC]);

    expect(graph_.isCyclic()).toEqual(false);
  });

  it("should be possible to delete edges from graph", () => {
    const graph = new Graph();

    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const AC = new GraphEdge(A, C);

    graph.addEdges([AB, BC, AC]);

    expect(graph.getAllEdges().length).toBe(3);

    graph.deleteEdge(AB);

    expect(graph.getAllEdges().length).toBe(2);
    expect(graph.getAllEdges()[0].getKey()).toBe(BC.getKey());
    expect(graph.getAllEdges()[1].getKey()).toBe(AC.getKey());

    graph.deleteEdges(graph.getAllEdges());
    expect(JSON.stringify(graph.edges)).toBe("{}");
  });

  it("should throw an error when trying to delete not existing edge", () => {
    const graph = new Graph();

    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    graph.addEdge(AB);
    graph.deleteEdge(BC);

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("should return cycles from private property", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.cycles).toEqual([
      [1, 2, 4],
      [1, 2, 5],
    ]);
  });

  it("should return size of smallest cycle", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.girph()).toEqual(3);
  });

  it("should return true for connected graph", () => {
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);

    // Add edges
    graph.addEdges([AB, BC]);

    expect(graph.isConnected()).toEqual(true);
  });

  it("should return false for not-connected graph", () => {
    const graph = new Graph(true);

    // Nodes
    const [A, B, C] = createVertices(["A", "B", "C"]);
    const [AB] = createEdges([[A, B]]);

    // Add edges
    graph.addVertices([A, B, C]);
    graph.addEdges([AB]);

    expect(graph.isConnected()).toEqual(false);
  });

  it("should return true for connected graph", () => {
    const graph = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph.isConnected()).toEqual(true);
  });

  it("should return false for graph without edges", () => {
    const graph = new Graph(true);

    graph.addVertices([A, B, C, D, E, F]);

    expect(graph.isConnected()).toEqual(false);
  });

  it("should return empty for non-eulerian graph", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);
    const BE = new GraphEdge(B, E);

    graph.addEdges([AB, BC, CD, DE, EF, BE]);

    expect(graph.getEulerianPath()).toEqual([]);
  });

  it("should return paths for eulerian graph", () => {
    const graph = new Graph(true);

    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);

    graph.addEdges([AB, BC, CD, DE, EF]);

    expect(graph.getEulerianPath()).toEqual([]);
  });

  it("should return acyclic paths", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.acyclicPaths(A, F)).toEqual([[0, 1, 2, 5]]);
  });

  it("should return all paths from from_key to to_key", () => {
    // A directed graph
    const graph_ = new Graph(true);

    // Nodes
    const node_labels = ["A", "B", "C", "D", "E", "F"];
    const [A, B, C, D, E, F] = createVertices(node_labels);

    // Vertices
    const edge_vertices = [
      [A, B], [B, C], [C, D], [C, E], [E, B], [C, F], [F, B],
    ];

    // Add edges
    graph_.addEdges(createEdges(edge_vertices));

    expect(graph_.allPaths(A, D)).toStrictEqual([
      [0, 1, 2, 3],
      [0, 1, 2, 5, 1, 2, 3],
      [0, 1, 2, 4, 1, 2, 3],
    ]);
  });

  it("should find hamiltonian paths in graph", () => {
    const AB = new GraphEdge(A, B);
    const AE = new GraphEdge(A, E);
    const AC = new GraphEdge(A, C);
    const BE = new GraphEdge(B, E);
    const BC = new GraphEdge(B, C);
    const BD = new GraphEdge(B, D);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);

    const graph = new Graph();
    graph.addEdges([ AB, AE, AC, BE, BC, BD, CD, DE, ]);

    const keysToIds = graph.getVerticesKeystoIndices();

    const hamiltonianCycleSet = [];

    for (const h_cycle of graph.getHamiltonianCycles()) {
      hamiltonianCycleSet.push(h_cycle);
    }

    expect(hamiltonianCycleSet.length).toBe(8);

    expect(hamiltonianCycleSet[0][0]).toBe(keysToIds[A.getKey()]);
    expect(hamiltonianCycleSet[0][1]).toBe(keysToIds[B.getKey()]);
    expect(hamiltonianCycleSet[0][2]).toBe(keysToIds[E.getKey()]);
    expect(hamiltonianCycleSet[0][3]).toBe(keysToIds[D.getKey()]);
    expect(hamiltonianCycleSet[0][4]).toBe(keysToIds[C.getKey()]);

    expect(hamiltonianCycleSet[1][0]).toBe(keysToIds[A.getKey()]);
    expect(hamiltonianCycleSet[1][1]).toBe(keysToIds[B.getKey()]);
    expect(hamiltonianCycleSet[1][2]).toBe(keysToIds[C.getKey()]);
    expect(hamiltonianCycleSet[1][3]).toBe(keysToIds[D.getKey()]);
    expect(hamiltonianCycleSet[1][4]).toBe(keysToIds[E.getKey()]);

    expect(hamiltonianCycleSet[2][0]).toBe(keysToIds[A.getKey()]);
    expect(hamiltonianCycleSet[2][1]).toBe(keysToIds[E.getKey()]);
    expect(hamiltonianCycleSet[2][2]).toBe(keysToIds[B.getKey()]);
    expect(hamiltonianCycleSet[2][3]).toBe(keysToIds[D.getKey()]);
    expect(hamiltonianCycleSet[2][4]).toBe(keysToIds[C.getKey()]);

    expect(hamiltonianCycleSet[3][0]).toBe(keysToIds[A.getKey()]);
    expect(hamiltonianCycleSet[3][1]).toBe(keysToIds[E.getKey()]);
    expect(hamiltonianCycleSet[3][2]).toBe(keysToIds[D.getKey()]);
    expect(hamiltonianCycleSet[3][3]).toBe(keysToIds[B.getKey()]);
    expect(hamiltonianCycleSet[3][4]).toBe(keysToIds[C.getKey()]);
  });

  it("should return true for hamiltonian graph", () => {
    const AB = new GraphEdge(A, B);
    const AE = new GraphEdge(A, E);
    const AC = new GraphEdge(A, C);
    const BE = new GraphEdge(B, E);
    const BC = new GraphEdge(B, C);
    const BD = new GraphEdge(B, D);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);

    const graph = new Graph();
    graph.addEdges([
      AB, AE, AC, BE, BC, BD, CD, DE,
    ]);

    expect(graph.isCyclicHamiltonian()).toBe(true);
  });

  it("should find hamiltonian paths in graph", () => {
    const AB = new GraphEdge(A, B);

    const graph = new Graph();
    graph.addEdges([AB]);
    graph.addVertex(C);

    expect(graph.isCyclicHamiltonian()).toBe(false);
  });

  it("should find hamiltonian paths in graph", () => {
    const AB = new GraphEdge(A, B);
    const AE = new GraphEdge(A, E);
    const AC = new GraphEdge(A, C);
    const BE = new GraphEdge(B, E);
    const BC = new GraphEdge(B, C);
    const BD = new GraphEdge(B, D);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);

    const graph = new Graph();
    graph.addEdges([
      AB, AE, AC, BE, BC, BD, CD, DE,
    ]);

    const assertHamiltonianCycles = [];

    for (const h_cycle of graph.getHamiltonianCycles()) {
      assertHamiltonianCycles.push(h_cycle);
    }

    const hamiltonianCycleSet = graph.allPaths("C");

    expect(hamiltonianCycleSet.length).toBe(8);

    expect(
      isCyclicEqual(hamiltonianCycleSet[0].slice(1), assertHamiltonianCycles[0])
    ).toBe(true);
    expect(
      isCyclicEqual(hamiltonianCycleSet[1].slice(1), assertHamiltonianCycles[1])
    ).toBe(true);
    expect(
      isCyclicEqual(hamiltonianCycleSet[2].slice(1), assertHamiltonianCycles[2])
    ).toBe(true);
    expect(
      isCyclicEqual(hamiltonianCycleSet[3].slice(1), assertHamiltonianCycles[3])
    ).toBe(true);
  });

  it("should return [] for all paths in a non-hamiltonian graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph();
    graph.addEdges([AB, BC, CD]);

    expect(_.isEqual(graph.allPaths("A"), [])).toBe(true);
  });

  it("should return all eulerian paths for graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const DE = new GraphEdge(D, E);
    const EF = new GraphEdge(E, F);

    const graph = new Graph();

    graph.addEdges([AB, BC, CD, DE, EF]);

    expect(graph.getEulerianPath()).toEqual([0, 1, 2, 3, 4, 5, 0]);
  });

  it("should return acyclic paths on non cyclic graph", () => {
    // A directed graph
    const graph_ = new Graph(true);

    // Nodes
    const [A, B, C, D, E, F] = createVertices(["A", "B", "C", "D", "E", "F"]);

    // Vertices
    const edge_vertices = [
      [A, B], [B, C], [B, D], [C, E], [D, E], [E, F],
    ];

    // Add edges
    graph_.addEdges(createEdges(edge_vertices));

    expect(graph_.allPaths(A, F)).toStrictEqual([
      [0, 1, 2, 4, 5],
      [0, 1, 3, 4, 5],
    ]);
  });

  it("should return cycles of vertices", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.getCycles()).toEqual({
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
    });
  });

  it("should return cycle indices", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.getCycleIndices()).toEqual({
      0: [1, 2, 4],
      1: [1, 2, 5],
    });
  });

  it("should return source nodes", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const CE = new GraphEdge(C, E);
    const EB = new GraphEdge(E, B);
    const CF = new GraphEdge(C, F);
    const FB = new GraphEdge(F, B);

    // Add edges
    graph_.addEdges([AB, BC, CD, CE, EB, CF, FB]);

    expect(graph_.sinkNodes()).toEqual([3]);
  });

  it("should return source nodes", () => {
    const graph_ = new Graph(true);

    // Vertices
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const DB = new GraphEdge(D, B);

    // Add edges
    graph_.addEdges([AB, BC, DB]);

    expect(graph_.sourceNodes()).toEqual([0, 3]);
  });

  it("should be possible to reverse graph", () => {
    const AB = new GraphEdge(A, B);
    const AC = new GraphEdge(A, C);
    const CD = new GraphEdge(C, D);

    const graph = new Graph(true);
    graph.addEdges([AB, AC, CD]);

    expect(graph.toString()).toBe("A_B,A_C,C_D");
    expect(graph.getAllEdges().length).toBe(3);
    expect(graph.getNeighbors(A).length).toBe(2);
    expect(graph.getNeighbors(A)[0].getKey()).toBe(B.getKey());
    expect(graph.getNeighbors(A)[1].getKey()).toBe(C.getKey());
    expect(graph.getNeighbors(B).length).toBe(0);
    expect(graph.getNeighbors(C).length).toBe(1);
    expect(graph.getNeighbors(C)[0].getKey()).toBe(D.getKey());
    expect(graph.getNeighbors(D).length).toBe(0);

    graph.reverse();

    expect(graph.toString()).toBe("B_A,C_A,D_C");
    expect(graph.getAllEdges().length).toBe(3);
    expect(graph.getNeighbors(A).length).toBe(0);
    expect(graph.getNeighbors(B).length).toBe(1);
    expect(graph.getNeighbors(B)[0].getKey()).toBe(A.getKey());
    expect(graph.getNeighbors(C).length).toBe(1);
    expect(graph.getNeighbors(C)[0].getKey()).toBe(A.getKey());
    expect(graph.getNeighbors(D).length).toBe(1);
    expect(graph.getNeighbors(D)[0].getKey()).toBe(C.getKey());
  });

  it("should warn about reversing a undirected graph", () => {
    const graph = new Graph(false);

    graph.addEdges(createEdgesFromVerticesValues([["A", "B"]]));

    graph.reverse();

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("should return vertices indices", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const BD = new GraphEdge(B, D);

    const graph = new Graph();
    graph.addEdges([AB, BC, CD, BD]);

    const verticesIndices = graph.getVerticesKeystoIndices();
    expect(verticesIndices).toEqual({
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    });
  });

  it("should generate adjacency matrix for undirected graph", () => {
    const AB = new GraphEdge(A, B);
    const BC = new GraphEdge(B, C);
    const CD = new GraphEdge(C, D);
    const BD = new GraphEdge(B, D);

    const graph = new Graph();
    graph.addEdges([AB, BC, CD, BD]);

    const adjacencyMatrix = graph.getAdjacencyMatrix();
    expect(adjacencyMatrix).toEqual([
      [Infinity, 0, Infinity, Infinity],
      [0, Infinity, 0, 0],
      [Infinity, 0, Infinity, 0],
      [Infinity, 0, 0, Infinity],
    ]);
  });

  it("should generate adjacency matrix for directed graph", () => {
    const AB = new GraphEdge(A, B, 2);
    const BC = new GraphEdge(B, C, 1);
    const CD = new GraphEdge(C, D, 5);
    const BD = new GraphEdge(B, D, 7);

    const graph = new Graph(true);
    graph.addEdges([AB, BC, CD, BD]);

    const adjacencyMatrix = graph.getAdjacencyMatrix();
    expect(adjacencyMatrix).toEqual([
      [Infinity, 2, Infinity, Infinity],
      [Infinity, Infinity, 1, 7],
      [Infinity, Infinity, Infinity, 5],
      [Infinity, Infinity, Infinity, Infinity],
    ]);
  });
});
