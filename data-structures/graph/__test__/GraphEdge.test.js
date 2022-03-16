import GraphEdge from '../GraphEdge';

import {
  createVertices,
  createEdgesFromVerticesValues,
  createCompleteUndirectedGraph
} from '../utils/graph.js';

describe('GraphEdge', () => {
  it('should create graph edge with default weight', () => {
    const [startVertex, endVertex] = createVertices(['A', 'B']);
    const edge = new GraphEdge(startVertex, endVertex);

    expect(edge.getKey()).toBe('A_B');
    expect(edge.toString()).toBe('A_B');
    expect(edge.startVertex).toEqual(startVertex);
    expect(edge.endVertex).toEqual(endVertex);
    expect(edge.weight).toEqual(0);
  });

  it('should create graph edge with predefined weight', () => {
    const [startVertex, endVertex] = createVertices(['A', 'B']);
    const edge = new GraphEdge(startVertex, endVertex, 10);

    expect(edge.startVertex).toEqual(startVertex);
    expect(edge.endVertex).toEqual(endVertex);
    expect(edge.weight).toEqual(10);
  });

  it('should be possible to do edge reverse', () => {
    const [vertexA, vertexB] = createVertices(['A', 'B']);
    const edge = new GraphEdge(vertexA, vertexB, 10);

    expect(edge.startVertex).toEqual(vertexA);
    expect(edge.endVertex).toEqual(vertexB);
    expect(edge.weight).toEqual(10);

    edge.reverse();

    expect(edge.startVertex).toEqual(vertexB);
    expect(edge.endVertex).toEqual(vertexA);
    expect(edge.weight).toEqual(10);
  });

  it('should be possible to do edge reverse', () => {
    const [edgeAB] = createEdgesFromVerticesValues([['A', 'B']]);
    
    expect(edgeAB.startVertex.getKey()).toEqual('A');
    expect(edgeAB.endVertex.getKey()).toEqual('B');
    expect(edgeAB.weight).toEqual(0);
  });

  it('should be possible to do edge reverse', () => {
    const graph = createCompleteUndirectedGraph(['A', 'B', 'C']);
    
    expect(Object.keys(graph.edges).length).toEqual(3);
  });
});
