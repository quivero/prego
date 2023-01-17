import GraphVertex from "@dstructures/graph/GraphVertex";
import GraphEdge from "@dstructures/graph/GraphEdge";
import Graph from "@dstructures/graph/Graph";
import { createVertices } from "@gutils/graph";

import bfTravellingSalesman from "../bfTravellingSalesman";

let A, B, C, D;
let AB, BD, DC, CA, BA, DB, CD, AC, AD, DA, BC, CB;

let edges;
let trivia, result, expected;

describe("bfTravellingSalesman", () => {
  it("should solve problem for simple graph", () => {
    const graph = new Graph(true);

    [A, B, C, D] = createVertices(["A", "B", "C", "D"]);

    AB = new GraphEdge(A, B, 1);
    BD = new GraphEdge(B, D, 1);
    DC = new GraphEdge(D, C, 1);
    CA = new GraphEdge(C, A, 1);
    BA = new GraphEdge(B, A, 5);
    DB = new GraphEdge(D, B, 8);
    CD = new GraphEdge(C, D, 7);
    AC = new GraphEdge(A, C, 4);
    AD = new GraphEdge(A, D, 2);
    DA = new GraphEdge(D, A, 3);
    BC = new GraphEdge(B, C, 3);
    CB = new GraphEdge(C, B, 9);

    edges = [AB, BD, DC, CA, BA, DB, CD, AC, AD, DA, BC, CB];

    graph.addEdges(edges);

    const salesmanPath = bfTravellingSalesman(graph);

    trivia = [
      [salesmanPath.length, 4],
      [salesmanPath[0].getKey(), A.getKey()],
      [salesmanPath[1].getKey(), B.getKey()],
      [salesmanPath[2].getKey(), D.getKey()],
      [salesmanPath[3].getKey(), C.getKey()],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });
});
