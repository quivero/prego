import GraphVertex from '../../../data-structures/graph/GraphVertex';
import GraphEdge from '../../../data-structures/graph/GraphEdge';
import Graph from '../../../data-structures/graph/Graph';
import eulerianPath from '../eulerianPath';

console.warn = jest.fn();

beforeEach(() => {
  console.warn.mockClear();
});

describe('eulerianPath', () => {
  it('should throw an warning on console when graph is not Eulerian', () => {
    
      const vertexA = new GraphVertex('A');
      const vertexB = new GraphVertex('B');
      const vertexC = new GraphVertex('C');
      const vertexD = new GraphVertex('D');
      const vertexE = new GraphVertex('E');

      const edgeAB = new GraphEdge(vertexA, vertexB);
      const edgeAC = new GraphEdge(vertexA, vertexC);
      const edgeBC = new GraphEdge(vertexB, vertexC);
      const edgeBD = new GraphEdge(vertexB, vertexD);
      const edgeCE = new GraphEdge(vertexC, vertexE);

      const graph = new Graph();
      
      graph
        .addEdges([edgeAB, edgeAC, edgeBC, edgeBD, edgeCE]);

      eulerianPath(graph);
    
      expect(console.warn).toHaveBeenCalledTimes(1);
  });
  
  it('should find Eulerian Circuit in graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAE = new GraphEdge(vertexA, vertexE);
    const edgeAF = new GraphEdge(vertexA, vertexF);
    const edgeAG = new GraphEdge(vertexA, vertexG);
    const edgeGF = new GraphEdge(vertexG, vertexF);
    const edgeBE = new GraphEdge(vertexB, vertexE);
    const edgeEB = new GraphEdge(vertexE, vertexB);
    const edgeBC = new GraphEdge(vertexB, vertexC);
    const edgeED = new GraphEdge(vertexE, vertexD);
    const edgeCD = new GraphEdge(vertexC, vertexD);

    const graph = new Graph();

    graph
      .addEdges([edgeAB, edgeAE, edgeAF, edgeAG, edgeGF, 
                edgeBE, edgeEB, edgeBC, edgeED, edgeCD]);

    const graphEdgesCount = graph.getAllEdges().length;

    const eulerianPathSet = eulerianPath(graph);

    expect(eulerianPathSet.length).toBe(graphEdgesCount + 1);

    expect(eulerianPathSet[0].getKey()).toBe(vertexA.getKey());
    expect(eulerianPathSet[1].getKey()).toBe(vertexB.getKey());
    expect(eulerianPathSet[2].getKey()).toBe(vertexE.getKey());
    expect(eulerianPathSet[3].getKey()).toBe(vertexB.getKey());
    expect(eulerianPathSet[4].getKey()).toBe(vertexC.getKey());
    expect(eulerianPathSet[5].getKey()).toBe(vertexD.getKey());
    expect(eulerianPathSet[6].getKey()).toBe(vertexE.getKey());
    expect(eulerianPathSet[7].getKey()).toBe(vertexA.getKey());
    expect(eulerianPathSet[8].getKey()).toBe(vertexF.getKey());
    expect(eulerianPathSet[9].getKey()).toBe(vertexG.getKey());
    expect(eulerianPathSet[10].getKey()).toBe(vertexA.getKey());
  });

  it('should find Eulerian Path in graph', () => {
    const vertexA = new GraphVertex('A');
    const vertexB = new GraphVertex('B');
    const vertexC = new GraphVertex('C');
    const vertexD = new GraphVertex('D');
    const vertexE = new GraphVertex('E');
    const vertexF = new GraphVertex('F');
    const vertexG = new GraphVertex('G');
    const vertexH = new GraphVertex('H');

    const edgeAB = new GraphEdge(vertexA, vertexB);
    const edgeAC = new GraphEdge(vertexA, vertexC);
    const edgeBD = new GraphEdge(vertexB, vertexD);
    const edgeDC = new GraphEdge(vertexD, vertexC);
    const edgeCE = new GraphEdge(vertexC, vertexE);
    const edgeEF = new GraphEdge(vertexE, vertexF);
    const edgeFH = new GraphEdge(vertexF, vertexH);
    const edgeFG = new GraphEdge(vertexF, vertexG);
    const edgeHG = new GraphEdge(vertexH, vertexG);

    const graph = new Graph();

    graph
      .addEdges([edgeAB, edgeAC, edgeBD, edgeDC, edgeHG,
                 edgeCE, edgeEF, edgeFH, edgeFG]);

    const graphEdgesCount = graph.getAllEdges().length;

    const eulerianPathSet = eulerianPath(graph);

    expect(eulerianPathSet.length).toBe(graphEdgesCount + 1);

    expect(eulerianPathSet[0].getKey()).toBe(vertexC.getKey());
    expect(eulerianPathSet[1].getKey()).toBe(vertexA.getKey());
    expect(eulerianPathSet[2].getKey()).toBe(vertexB.getKey());
    expect(eulerianPathSet[3].getKey()).toBe(vertexD.getKey());
    expect(eulerianPathSet[4].getKey()).toBe(vertexC.getKey());
    expect(eulerianPathSet[5].getKey()).toBe(vertexE.getKey());
    expect(eulerianPathSet[6].getKey()).toBe(vertexF.getKey());
    expect(eulerianPathSet[7].getKey()).toBe(vertexH.getKey());
    expect(eulerianPathSet[8].getKey()).toBe(vertexG.getKey());
    expect(eulerianPathSet[9].getKey()).toBe(vertexF.getKey());
  });
});
