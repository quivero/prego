import GraphVertex from '#dstructures/graph/GraphVertex';
import GraphEdge from '#dstructures/graph/GraphEdge';
import Graph from '#dstructures/graph/Graph';

import stronglyConnectedComponents from '../stronglyConnectedComponents';

describe('stronglyConnectedComponents', () => {
  it('should detect strongly connected components in simple graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCA = new GraphEdge(vertexC, vertexA);
    const edgeCD = new GraphEdge(vertexC, vertexD);

    const graph = new Graph(true);

    graph.addEdges([edgeAB, edgeBC, edgeCA, edgeCD]);

    const components = stronglyConnectedComponents(graph);

    expect(components).toBeDefined();
    expect(components).toHaveLength(2);

    expect(components[0][0].getKey()).toBe(vertexA.getKey());
    expect(components[0][1].getKey()).toBe(vertexC.getKey());
    expect(components[0][2].getKey()).toBe(vertexB.getKey());

    expect(components[1][0].getKey()).toBe(vertexD.getKey());
  });

  it('should detect strongly connected components in graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');
    const vertexH = new GraphVertex('H');
    const vertexI = new GraphVertex('I');
    const vertexJ = new GraphVertex('J');
    const vertexK = new GraphVertex('K');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeCA = new GraphEdge(vertexC, vertexA);
    const edgeBD = new GraphEdge(vertexB, vertexD);
    const edgeDE = new GraphEdge(vertexD, vertexE);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeFD = new GraphEdge(vertexF, vertexD);
    const edgeGF = new GraphEdge(vertexG, vertexF);
    const edgeGH = new GraphEdge(vertexG, vertexH);
    const edgeHI = new GraphEdge(vertexH, vertexI);
    const edgeIJ = new GraphEdge(vertexI, vertexJ);
    const edgeJG = new GraphEdge(vertexJ, vertexG);
    const edgeJK = new GraphEdge(vertexJ, vertexK);

    const graph = new Graph(true);

    graph.addEdges([
      edgeAB,
      edgeBC,
      edgeCA,
      edgeBD,
      edgeDE,
      edgeEF,
      edgeFD,
      edgeGF,
      edgeGH,
      edgeHI,
      edgeIJ,
      edgeJG,
      edgeJK,
    ]);

    const components = stronglyConnectedComponents(graph);

    expect(components).toBeDefined();
    expect(components).toHaveLength(4);

    expect(components[0][0].getKey()).toBe(vertexG.getKey());
    expect(components[0][1].getKey()).toBe(vertexJ.getKey());
    expect(components[0][2].getKey()).toBe(vertexI.getKey());
    expect(components[0][3].getKey()).toBe(vertexH.getKey());

    expect(components[1][0].getKey()).toBe(vertexK.getKey());

    expect(components[2][0].getKey()).toBe(vertexA.getKey());
    expect(components[2][1].getKey()).toBe(vertexC.getKey());
    expect(components[2][2].getKey()).toBe(vertexB.getKey());

    expect(components[3][0].getKey()).toBe(vertexD.getKey());
    expect(components[3][1].getKey()).toBe(vertexF.getKey());
    expect(components[3][2].getKey()).toBe(vertexE.getKey());
  });
});
