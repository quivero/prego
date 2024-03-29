import GraphEdge from '../GraphEdge';

import {
  createVertices,
  createEdgesFromVerticesValues,
  createCompleteUndirectedGraph,
} from '../utils/graph.js';

describe('GraphEdge', () => {
  it('should create graph edge with default weight', () => {
    const [startVertex, endVertex] = createVertices(['A', 'B']);
    const edge = new GraphEdge(startVertex, endVertex);

    expect(edge.getKey()).toBe('A_B');
    expect(edge.toString()).toBe('A_B');
    expect(edge.getKeyTuple()).toEqual(['A', 'B']);

    expect(edge.startVertex).toEqual(startVertex);
    expect(edge.endVertex).toEqual(endVertex);
    expect(edge.weight).toBe(0);
  });

  it('should create graph edge with predefined weight', () => {
    const [startVertex, endVertex] = createVertices(['A', 'B']);
    const edge = new GraphEdge(startVertex, endVertex, 10);

    expect(edge.startVertex).toEqual(startVertex);
    expect(edge.endVertex).toEqual(endVertex);
    expect(edge.weight).toBe(10);
  });

  it('should be possible to do edge reverse', () => {
    const [vertexA, vertexB] = createVertices(['A', 'B']);
    const edge = new GraphEdge(vertexA, vertexB, 10);

    expect(edge.startVertex).toEqual(vertexA);
    expect(edge.endVertex).toEqual(vertexB);
    expect(edge.weight).toBe(10);

    edge.reverse();

    expect(edge.startVertex).toEqual(vertexB);
    expect(edge.endVertex).toEqual(vertexA);
    expect(edge.weight).toBe(10);
  });

  it('should be possible to create edge from vertex', () => {
    const [edgeAB] = createEdgesFromVerticesValues([['A', 'B']]);

    expect(edgeAB.startVertex.getKey()).toBe('A');
    expect(edgeAB.endVertex.getKey()).toBe('B');
    expect(edgeAB.weight).toBe(0);
  });

  it('should be possible to create complete undirected graph from vertices', () => {
    const graph = createCompleteUndirectedGraph(['A', 'B', 'C']);

    expect(Object.keys(graph.edges)).toHaveLength(3);
  });
});
