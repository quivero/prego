import GraphVertex from '#dstructures/graph/GraphVertex';
import GraphEdge from '#dstructures/graph/GraphEdge';
import Graph from '#dstructures/graph/Graph';

import floydWarshall from '../floydWarshall';

describe('floydWarshall', () => {
  it('should find minimum paths to all vertices for undirected graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');
    const vertexH = new GraphVertex('H');

    const edgeAB = new GraphEdge(vertexA, vertexB, 4);
    const edgeAE = new GraphEdge(vertexA, vertexE, 7);
    const edgeAC = new GraphEdge(vertexA, vertexC, 3);
    const edgeBC = new GraphEdge(vertexB, vertexC, 6);
    const edgeBD = new GraphEdge(vertexB, vertexD, 5);
    const edgeEC = new GraphEdge(vertexE, vertexC, 8);
    const edgeED = new GraphEdge(vertexE, vertexD, 2);
    const edgeDC = new GraphEdge(vertexD, vertexC, 11);
    const edgeDG = new GraphEdge(vertexD, vertexG, 10);
    const edgeDF = new GraphEdge(vertexD, vertexF, 2);
    const edgeFG = new GraphEdge(vertexF, vertexG, 3);
    const edgeEG = new GraphEdge(vertexE, vertexG, 5);

    const graph = new Graph();

    // Add vertices first just to have them in desired order.
    graph.addVertices([
      vertexA,
      vertexB,
      vertexC,
      vertexD,
      vertexE,
      vertexF,
      vertexG,
      vertexH,
    ]);

    // Now, when vertices are in correct order let's add edges.
    graph.addEdges([
      edgeAB,
      edgeAE,
      edgeAC,
      edgeBC,
      edgeBD,
      edgeEC,
      edgeED,
      edgeDC,
      edgeDG,
      edgeDF,
      edgeFG,
      edgeEG,
    ]);

    const { distances, nextVertices } = floydWarshall(graph);

    const vertices = graph.getAllVertices();

    const vertexAIndex = vertices.indexOf(vertexA);
    const vertexBIndex = vertices.indexOf(vertexB);
    const vertexCIndex = vertices.indexOf(vertexC);
    const vertexDIndex = vertices.indexOf(vertexD);
    const vertexEIndex = vertices.indexOf(vertexE);
    const vertexFIndex = vertices.indexOf(vertexF);
    const vertexGIndex = vertices.indexOf(vertexG);
    const vertexHIndex = vertices.indexOf(vertexH);

    expect(distances[vertexAIndex][vertexHIndex]).toBe(Infinity);
    expect(distances[vertexAIndex][vertexAIndex]).toBe(0);
    expect(distances[vertexAIndex][vertexBIndex]).toBe(4);
    expect(distances[vertexAIndex][vertexEIndex]).toBe(7);
    expect(distances[vertexAIndex][vertexCIndex]).toBe(3);
    expect(distances[vertexAIndex][vertexDIndex]).toBe(9);
    expect(distances[vertexAIndex][vertexGIndex]).toBe(12);
    expect(distances[vertexAIndex][vertexFIndex]).toBe(11);

    expect(nextVertices[vertexAIndex][vertexFIndex]).toBe(vertexD);
    expect(nextVertices[vertexAIndex][vertexDIndex]).toBe(vertexB);
    expect(nextVertices[vertexAIndex][vertexBIndex]).toBe(vertexA);
    expect(nextVertices[vertexAIndex][vertexGIndex]).toBe(vertexE);
    expect(nextVertices[vertexAIndex][vertexCIndex]).toBe(vertexA);
    expect(nextVertices[vertexAIndex][vertexAIndex]).toBeNull();
    expect(nextVertices[vertexAIndex][vertexHIndex]).toBeNull();
  });

  it('should find minimum paths to all vertices for directed graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB, 3);
    const edgeBA = new GraphEdge(vertexB, vertexA, 8);
    const edgeAD = new GraphEdge(vertexA, vertexD, 7);
    const edgeDA = new GraphEdge(vertexD, vertexA, 2);
    const edgeBC = new GraphEdge(vertexB, vertexC, 2);
    const edgeCA = new GraphEdge(vertexC, vertexA, 5);
    const edgeCD = new GraphEdge(vertexC, vertexD, 1);

    const graph = new Graph(true);

    // Add vertices first just to have them in desired order.
    graph.addVertices([vertexA, vertexB, vertexC, vertexD]);

    // Now, when vertices are in correct order let's add edges.
    graph.addEdges([edgeAB, edgeBA, edgeAD, edgeDA, edgeBC, edgeCA, edgeCD]);

    const { distances, nextVertices } = floydWarshall(graph);

    const vertices = graph.getAllVertices();

    const vertexAIndex = vertices.indexOf(vertexA);
    const vertexBIndex = vertices.indexOf(vertexB);
    const vertexCIndex = vertices.indexOf(vertexC);
    const vertexDIndex = vertices.indexOf(vertexD);

    expect(distances[vertexAIndex][vertexAIndex]).toBe(0);
    expect(distances[vertexAIndex][vertexBIndex]).toBe(3);
    expect(distances[vertexAIndex][vertexCIndex]).toBe(5);
    expect(distances[vertexAIndex][vertexDIndex]).toBe(6);

    expect(distances).toEqual([
      [0, 3, 5, 6],
      [5, 0, 2, 3],
      [3, 6, 0, 1],
      [2, 5, 7, 0],
    ]);

    expect(nextVertices[vertexAIndex][vertexDIndex]).toBe(vertexC);
    expect(nextVertices[vertexAIndex][vertexCIndex]).toBe(vertexB);
    expect(nextVertices[vertexBIndex][vertexDIndex]).toBe(vertexC);
    expect(nextVertices[vertexAIndex][vertexAIndex]).toBeNull();
    expect(nextVertices[vertexAIndex][vertexBIndex]).toBe(vertexA);
  });

  it('should find minimum paths to all vertices for directed graph with negative edge weights', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');

    const edgeFE = new GraphEdge(vertexF, vertexE, 8);
    const edgeFA = new GraphEdge(vertexF, vertexA, 10);
    const edgeED = new GraphEdge(vertexE, vertexD, 1);
    const edgeDA = new GraphEdge(vertexD, vertexA, -4);
    const edgeDC = new GraphEdge(vertexD, vertexC, -1);
    const edgeAC = new GraphEdge(vertexA, vertexC, 2);
    const edgeCB = new GraphEdge(vertexC, vertexB, -2);
    const edgeBA = new GraphEdge(vertexB, vertexA, 1);

    const graph = new Graph(true);

    // Add vertices first just to have them in desired order.
    graph.addVertices([
      vertexA,
      vertexB,
      vertexC,
      vertexD,
      vertexE,
      vertexF,
      vertexG,
    ]);

    // Now, when vertices are in correct order let's add edges.
    graph.addEdges([
      edgeFE,
      edgeFA,
      edgeED,
      edgeDA,
      edgeDC,
      edgeAC,
      edgeCB,
      edgeBA,
    ]);

    const { distances, nextVertices } = floydWarshall(graph);

    const vertices = graph.getAllVertices();

    const vertexAIndex = vertices.indexOf(vertexA);
    const vertexBIndex = vertices.indexOf(vertexB);
    const vertexCIndex = vertices.indexOf(vertexC);
    const vertexDIndex = vertices.indexOf(vertexD);
    const vertexEIndex = vertices.indexOf(vertexE);
    const vertexGIndex = vertices.indexOf(vertexG);
    const vertexFIndex = vertices.indexOf(vertexF);

    expect(distances[vertexFIndex][vertexGIndex]).toBe(Infinity);
    expect(distances[vertexFIndex][vertexFIndex]).toBe(0);
    expect(distances[vertexFIndex][vertexAIndex]).toBe(5);
    expect(distances[vertexFIndex][vertexBIndex]).toBe(5);
    expect(distances[vertexFIndex][vertexCIndex]).toBe(7);
    expect(distances[vertexFIndex][vertexDIndex]).toBe(9);
    expect(distances[vertexFIndex][vertexEIndex]).toBe(8);

    expect(nextVertices[vertexFIndex][vertexGIndex]).toBeNull();
    expect(nextVertices[vertexFIndex][vertexFIndex]).toBeNull();
    expect(nextVertices[vertexAIndex][vertexBIndex]).toBe(vertexC);
    expect(nextVertices[vertexAIndex][vertexCIndex]).toBe(vertexA);
    expect(nextVertices[vertexFIndex][vertexBIndex]).toBe(vertexE);
    expect(nextVertices[vertexEIndex][vertexBIndex]).toBe(vertexD);
    expect(nextVertices[vertexDIndex][vertexBIndex]).toBe(vertexC);
    expect(nextVertices[vertexCIndex][vertexBIndex]).toBe(vertexC);
  });
});
