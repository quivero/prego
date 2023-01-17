import GraphVertex from "@dstructures/graph/GraphVertex";
import GraphEdge from "@dstructures/graph/GraphEdge";
import Graph from "@dstructures/graph/Graph";

import prim from "../prim";

jest.mock("@utils/sys/sys");

let A = new GraphVertex("A");
let B = new GraphVertex("B");
let C = new GraphVertex("C");
let D = new GraphVertex("D");
let E = new GraphVertex("E");
let F = new GraphVertex("F");
let G = new GraphVertex("G");

let edgeAB,
  edgeAD,
  edgeAC,
  edgeBC,
  edgeBE,
  edgeBD,
  edgeCD,
  edgeDF,
  edgeEC,
  edgeEF,
  edgeFG,
  edgeFC;

let graph;
let edges;
let minimumSpanningTree;

let trivia, result, expected;

beforeEach(() => {
  // restore the spy created with spyOn
  A.deleteAllEdges();
  B.deleteAllEdges();
  C.deleteAllEdges();
  D.deleteAllEdges();
  E.deleteAllEdges();
  F.deleteAllEdges();
  G.deleteAllEdges();
});

describe("prim", () => {
  it("should fire an error for directed graph", () => {
    function undirectedGraphThrowError() {
      graph = new Graph(true);
      prim(graph);
    }

    expect(undirectedGraphThrowError).toThrow();
  });

  it("should find minimum spanning tree", () => {
    edgeAB = new GraphEdge(A, B, 2);
    edgeAD = new GraphEdge(A, D, 3);
    edgeAC = new GraphEdge(A, C, 3);
    edgeBC = new GraphEdge(B, C, 4);
    edgeBE = new GraphEdge(B, E, 3);
    edgeDF = new GraphEdge(D, F, 7);
    edgeEC = new GraphEdge(E, C, 1);
    edgeEF = new GraphEdge(E, F, 8);
    edgeFG = new GraphEdge(F, G, 9);
    edgeFC = new GraphEdge(F, C, 6);

    graph = new Graph();

    edges = [
      edgeAB,
      edgeAD,
      edgeAC,
      edgeBC,
      edgeBE,
      edgeDF,
      edgeEC,
      edgeEF,
      edgeFC,
      edgeFG,
    ];

    graph.addEdges(edges);

    minimumSpanningTree = prim(graph);

    trivia = [
      [graph.getWeight(), 46],
      [minimumSpanningTree.getWeight(), 24],
      [
        minimumSpanningTree.getAllVertices().length,
        graph.getAllVertices().length,
      ],
      [
        minimumSpanningTree.getAllEdges().length,
        graph.getAllVertices().length - 1,
      ],
      [minimumSpanningTree.toString(), "A_B,A_C,E_C,A_D,F_C,F_G"],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }
  });

  it("should find minimum spanning tree for simple graph", () => {
    edgeAB = new GraphEdge(A, B, 1);
    edgeAD = new GraphEdge(A, D, 3);
    edgeBC = new GraphEdge(B, C, 1);
    edgeBD = new GraphEdge(B, D, 3);
    edgeCD = new GraphEdge(C, D, 1);

    graph = new Graph();

    edges = [edgeAB, edgeAD, edgeBC, edgeBD, edgeCD];

    graph.addEdges(edges);

    minimumSpanningTree = prim(graph);

    trivia = [
      [graph.getWeight(), 9],
      [minimumSpanningTree.getWeight(), 3],
      [
        minimumSpanningTree.getAllVertices().length,
        graph.getAllVertices().length,
      ],
      [
        minimumSpanningTree.getAllEdges().length,
        graph.getAllVertices().length - 1,
      ],
      [minimumSpanningTree.toString(), "A_B,B_C,C_D"],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }
  });
});
