import Graph from "@dstructures/graph/Graph";

import { createVertices, createEdges } from "@dstructures/graph/utils/graph";

import topologicalSort from "../topologicalSort";

let nodes_labels, edges_vertices;
let graph, edges;
let A, B, C, D, E, F, G, H;
let AC, BC, BD, CE, DF, EF, EH, FG;

describe("topologicalSort", () => {
  it("should do topological sorting on graph", () => {
    graph = new Graph(true);

    nodes_labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
    [A, B, C, D, E, F, G, H] = createVertices(nodes_labels);

    edges_vertices = [
      [A, C],
      [B, C],
      [B, D],
      [C, E],
      [D, F],
      [E, F],
      [E, H],
      [F, G],
    ];
    [AC, BC, BD, CE, DF, EF, EH, FG] = createEdges(edges_vertices);

    edges = [AC, BC, BD, CE, DF, EF, EH, FG];
    graph.addEdges(edges);

    const sortedVertices = topologicalSort(graph);

    expect(sortedVertices).toBeDefined();
    expect(sortedVertices.length).toBe(graph.getAllVertices().length);
    expect(sortedVertices).toEqual([B, D, A, C, E, H, F, G]);
  });
});
