import GraphVertex from "@dstructures/graph/GraphVertex";
import GraphEdge from "@dstructures/graph/GraphEdge";
import Graph from "@dstructures/graph/Graph";

import detectDirectedCycle from "../detectDirectedCycle";

describe("detectDirectedCycle", () => {
  it("should detect directed cycle", () => {
    const vertexA = new GraphVertex("A");
    const vertexB = new GraphVertex("B");
    const vertexC = new GraphVertex("C");
    const vertexD = new GraphVertex("D");
    const vertexE = new GraphVertex("E");
    const vertexF = new GraphVertex("F");

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeDA = new GraphEdge(vertexD, vertexA);
    const edgeDE = new GraphEdge(vertexD, vertexE);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeFD = new GraphEdge(vertexF, vertexD);

    const graph = new Graph(true);
    graph.addEdges([edgeAB, edgeBC, edgeAC, edgeDA, edgeDE, edgeEF]);

    expect(detectDirectedCycle(graph)).toBeNull();

    graph.addEdge(edgeFD);

    expect(detectDirectedCycle(graph)).toEqual({
      D: vertexF,
      F: vertexE,
      E: vertexD,
    });
  });
});
