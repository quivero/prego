import GraphEdge from '#dstructures/graph/GraphEdge';
import Graph from '#dstructures/graph/Graph';

import prim from '../prim';
import { createVertices, resetVertices } from '#gutils/graph';

jest.mock('#utils/sys/sys');

let A, B, C, D, E, F, G;

[A, B, C, D, E, F, G] = createVertices(['A', 'B', 'C', 'D', 'E', 'F', 'G']);

let AB, AD, AC, BC, BE, BD, CD, DF, EC, EF, FG, FC;

let graph;
let edges;
let minimumSpanningTree;

let trivia, result, expected;

beforeEach(() => {
  // restore the spy created with spyOn
  [A, B, C, D, E, F, G] = resetVertices([A, B, C, D, E, F, G]);
});

describe('prim', () => {
  it('should fire an error for directed graph', () => {
    const undirectedGraphThrowError = () => prim(new Graph(true));

    expect(undirectedGraphThrowError).toThrow();
  });

  it('should find minimum spanning tree', () => {
    AB = new GraphEdge(A, B, 2);
    AD = new GraphEdge(A, D, 3);
    AC = new GraphEdge(A, C, 3);
    BC = new GraphEdge(B, C, 4);
    BE = new GraphEdge(B, E, 3);
    DF = new GraphEdge(D, F, 7);
    EC = new GraphEdge(E, C, 1);
    EF = new GraphEdge(E, F, 8);
    FG = new GraphEdge(F, G, 9);
    FC = new GraphEdge(F, C, 6);

    graph = new Graph();

    edges = [AB, AD, AC, BC, BE, DF, EC, EF, FC, FG];

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
      [minimumSpanningTree.toString(), 'A_B,A_C,E_C,A_D,F_C,F_G'],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }
  });

  it('should find minimum spanning tree for simple graph', () => {
    AB = new GraphEdge(A, B, 1);
    AD = new GraphEdge(A, D, 3);
    BC = new GraphEdge(B, C, 1);
    BD = new GraphEdge(B, D, 3);
    CD = new GraphEdge(C, D, 1);

    graph = new Graph();

    edges = [AB, AD, BC, BD, CD];

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
      [minimumSpanningTree.toString(), 'A_B,B_C,C_D'],
    ];

    for (let index in trivia) {
      result = trivia[index][0];
      expected = trivia[index][1];

      expect(result).toBe(expected);
    }
  });
});
