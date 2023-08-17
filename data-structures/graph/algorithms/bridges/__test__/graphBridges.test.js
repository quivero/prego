import GraphVertex from '#dstructures/graph/GraphVertex';
import GraphEdge from '#dstructures/graph/GraphEdge';
import Graph from '#dstructures/graph/Graph';

import graphBridges from '../graphBridges';

describe('graphBridges', () => {
  it('should find bridges in simple graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);

    const graph = new Graph();

    graph.addEdges([edgeAB, edgeBC, edgeCD]);

    const bridges = Object.values(graphBridges(graph));

    expect(bridges).toHaveLength(3);

    expect(bridges[0].getKey()).toBe(edgeCD.getKey());
    expect(bridges[1].getKey()).toBe(edgeBC.getKey());
    expect(bridges[2].getKey()).toBe(edgeAB.getKey());
  });

  it('should find bridges in simple graph with back edge', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeAC = new GraphEdge(vertexA, vertexC);

    const graph = new Graph();

    graph.addEdges([edgeAB, edgeAC, edgeBC, edgeCD]);

    const bridges = Object.values(graphBridges(graph));

    expect(bridges).toHaveLength(1);
    expect(bridges[0].getKey()).toBe(edgeCD.getKey());
  });

  it('should find bridges in graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');
    const vertexH = new GraphVertex('H');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeDE = new GraphEdge(vertexD, vertexE);
    const edgeEG = new GraphEdge(vertexE, vertexG);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeGF = new GraphEdge(vertexG, vertexF);
    const edgeFH = new GraphEdge(vertexF, vertexH);

    const graph = new Graph();

    graph.addEdges([
      edgeAB,
      edgeBC,
      edgeAC,
      edgeCD,
      edgeFH,
      edgeDE,
      edgeEG,
      edgeEF,
      edgeGF,
    ]);

    const bridges = Object.values(graphBridges(graph));

    expect(bridges).toHaveLength(3);
    expect(bridges[0].getKey()).toBe(edgeFH.getKey());
    expect(bridges[1].getKey()).toBe(edgeDE.getKey());
    expect(bridges[2].getKey()).toBe(edgeCD.getKey());
  });

  it('should find bridges in graph starting with different root vertex', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');
    const vertexH = new GraphVertex('H');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeDE = new GraphEdge(vertexD, vertexE);
    const edgeEG = new GraphEdge(vertexE, vertexG);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeGF = new GraphEdge(vertexG, vertexF);
    const edgeFH = new GraphEdge(vertexF, vertexH);

    const graph = new Graph();

    graph.addEdges([
      edgeDE,
      edgeAB,
      edgeBC,
      edgeAC,
      edgeCD,
      edgeEG,
      edgeEF,
      edgeGF,
      edgeFH,
    ]);

    const bridges = Object.values(graphBridges(graph));

    expect(bridges).toHaveLength(3);
    expect(bridges[0].getKey()).toBe(edgeFH.getKey());
    expect(bridges[1].getKey()).toBe(edgeDE.getKey());
    expect(bridges[2].getKey()).toBe(edgeCD.getKey());
  });

  it('should find bridges in yet another graph #1', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeDE = new GraphEdge(vertexD, vertexE);

    const graph = new Graph();

    graph.addEdges([edgeAB, edgeAC, edgeBC, edgeCD, edgeDE]);

    const bridges = Object.values(graphBridges(graph));

    expect(bridges).toHaveLength(2);
    expect(bridges[0].getKey()).toBe(edgeDE.getKey());
    expect(bridges[1].getKey()).toBe(edgeCD.getKey());
  });

  it('should find bridges in yet another graph #2', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCD = new GraphEdge(vertexC, vertexD);
    const edgeCE = new GraphEdge(vertexC, vertexE);
    const edgeCF = new GraphEdge(vertexC, vertexF);
    const edgeEG = new GraphEdge(vertexE, vertexG);
    const edgeFG = new GraphEdge(vertexF, vertexG);

    const graph = new Graph();

    graph.addEdges([
      edgeAB,
      edgeAC,
      edgeBC,
      edgeCD,
      edgeCE,
      edgeCF,
      edgeEG,
      edgeFG,
    ]);

    const bridges = Object.values(graphBridges(graph));

    expect(bridges).toHaveLength(1);
    expect(bridges[0].getKey()).toBe(edgeCD.getKey());
  });
});
