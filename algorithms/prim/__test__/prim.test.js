import GraphVertex from "../../../data-structures/graph/GraphVertex";
import GraphEdge from "../../../data-structures/graph/GraphEdge";
import Graph from "../../../data-structures/graph/Graph";
import prim from "../prim";

jest.mock("../../../utils/sys/sys");

describe("prim", () => {
  it("should fire an error for directed graph", () => {
    function undirectedGraphThrowError() {
      const graph = new Graph(true);
      prim(graph);
    }

    expect(undirectedGraphThrowError).toThrow();
  });

  it("should find minimum spanning tree", () => {
    const vertexA = new GraphVertex("A");
    const vertexB = new GraphVertex("B");
    const vertexC = new GraphVertex("C");
    const vertexD = new GraphVertex("D");
    const vertexE = new GraphVertex("E");
    const vertexF = new GraphVertex("F");
    const vertexG = new GraphVertex("G");

    const edgeAB = new GraphEdge(vertexA, vertexB, 2);
    const edgeAD = new GraphEdge(vertexA, vertexD, 3);
    const edgeAC = new GraphEdge(vertexA, vertexC, 3);
    const edgeBC = new GraphEdge(vertexB, vertexC, 4);
    const edgeBE = new GraphEdge(vertexB, vertexE, 3);
    const edgeDF = new GraphEdge(vertexD, vertexF, 7);
    const edgeEC = new GraphEdge(vertexE, vertexC, 1);
    const edgeEF = new GraphEdge(vertexE, vertexF, 8);
    const edgeFG = new GraphEdge(vertexF, vertexG, 9);
    const edgeFC = new GraphEdge(vertexF, vertexC, 6);

    const graph = new Graph();

    graph.addEdges([
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
    ]);

    expect(graph.getWeight()).toEqual(46);

    const minimumSpanningTree = prim(graph);

    expect(minimumSpanningTree.getWeight()).toBe(24);
    expect(minimumSpanningTree.getAllVertices().length).toBe(
      graph.getAllVertices().length
    );
    expect(minimumSpanningTree.getAllEdges().length).toBe(
      graph.getAllVertices().length - 1
    );
    expect(minimumSpanningTree.toString()).toBe("A_B,A_C,E_C,A_D,F_C,F_G");
  });

  it("should find minimum spanning tree for simple graph", () => {
    const vertexA = new GraphVertex("A");
    const vertexB = new GraphVertex("B");
    const vertexC = new GraphVertex("C");
    const vertexD = new GraphVertex("D");

    const edgeAB = new GraphEdge(vertexA, vertexB, 1);
    const edgeAD = new GraphEdge(vertexA, vertexD, 3);
    const edgeBC = new GraphEdge(vertexB, vertexC, 1);
    const edgeBD = new GraphEdge(vertexB, vertexD, 3);
    const edgeCD = new GraphEdge(vertexC, vertexD, 1);

    const graph = new Graph();

    graph.addEdges([edgeAB, edgeAD, edgeBC, edgeBD, edgeCD]);

    expect(graph.getWeight()).toEqual(9);

    const minimumSpanningTree = prim(graph);

    expect(minimumSpanningTree.getWeight()).toBe(3);
    expect(minimumSpanningTree.getAllVertices().length).toBe(
      graph.getAllVertices().length
    );
    expect(minimumSpanningTree.getAllEdges().length).toBe(
      graph.getAllVertices().length - 1
    );
    expect(minimumSpanningTree.toString()).toBe("A_B,B_C,C_D");
  });
});
