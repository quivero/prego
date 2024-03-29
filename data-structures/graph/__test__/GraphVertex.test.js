import { createVertices, createEdges } from '../utils/graph.js';

import GraphVertex from '../GraphVertex';
import GraphEdge from '../GraphEdge';

import { throwError } from '#algorithms/sys/sys.js';

jest.mock('#algorithms/sys/sys.js');

let result, expected;

describe('GraphVertex', () => {
  it('should throw an error when trying to create vertex without value', () => {
    new GraphVertex();

    result = throwError;
    expected = 1;

    expect(result).toHaveBeenCalledTimes(expected);
  });

  it('should create graph vertex', () => {
    const vertex = new GraphVertex('A');

    expect(vertex).toBeDefined();
    expect(vertex.label).toBe('A');
    expect(vertex.toString()).toBe('A');
    expect(vertex.getKey()).toBe('A');
    expect(vertex.edges.toString()).toBe('');
    expect(vertex.getEdges()).toEqual([]);
  });

  it('should add edges to vertex and check if it exists', () => {
    const [A, B] = createVertices(['A', 'B']);
    const edgeAB = new GraphEdge(A, B);

    A.addEdge(edgeAB);

    expect(A.hasEdge(edgeAB)).toBeTrue();
    expect(B.hasEdge(edgeAB)).toBeFalse();

    expect(A.getEdges()).toHaveLength(1);
    expect(A.getEdges()[0].toString()).toBe('A_B');
  });

  it('should delete edges from vertex', () => {
    const [A, B, C] = createVertices(['A', 'B', 'C']);
    const [AB, AC] = createEdges([
      [A, B],
      [A, C],
    ]);

    A.addEdges([AB, AC]);

    expect(A.hasEdge(AB)).toBeTrue();
    expect(B.hasEdge(AB)).toBeFalse();

    expect(A.hasEdge(AC)).toBeTrue();
    expect(C.hasEdge(AC)).toBeFalse();

    expect(A.getEdges()).toHaveLength(2);

    expect(A.getEdges()[0].toString()).toBe('A_B');
    expect(A.getEdges()[1].toString()).toBe('A_C');

    A.deleteEdge(AB);
    expect(A.hasEdge(AB)).toBeFalse();
    expect(A.hasEdge(AC)).toBeTrue();
    expect(A.getEdges()[0].toString()).toBe('A_C');

    A.deleteEdge(AC);

    expect(A.hasEdge(AB)).toBeFalse();
    expect(A.hasEdge(AC)).toBeFalse();
    expect(A.getEdges()).toHaveLength(0);
  });

  it('should delete all edges from vertex', () => {
    const [A, B, C] = createVertices(['A', 'B', 'C']);

    const [AB, AC] = createEdges([
      [A, B],
      [A, C],
    ]);

    A.addEdges([AB, AC]);

    expect(A.hasEdge(AB)).toBeTrue();
    expect(B.hasEdge(AB)).toBeFalse();

    expect(A.hasEdge(AC)).toBeTrue();
    expect(C.hasEdge(AC)).toBeFalse();

    expect(A.getEdges()).toHaveLength(2);

    A.deleteAllEdges();

    expect(A.hasEdge(AB)).toBeFalse();
    expect(B.hasEdge(AB)).toBeFalse();

    expect(A.hasEdge(AC)).toBeFalse();
    expect(C.hasEdge(AC)).toBeFalse();

    expect(A.getEdges()).toHaveLength(0);
  });

  it('should return vertex neighbors in case if current node is start one', () => {
    const [A, B, C] = createVertices(['A', 'B', 'C']);

    const [edgeAB, edgeAC] = createEdges([
      [A, B],
      [A, C],
    ]);

    A.addEdges([edgeAB, edgeAC]);

    expect(B.getNeighbors()).toEqual([]);

    const neighbors = A.getNeighbors();

    expect(neighbors).toHaveLength(2);
    expect(neighbors[0]).toEqual(B);
    expect(neighbors[1]).toEqual(C);
  });

  it('should return vertex neighbors in case if current node is end one', () => {
    const [A, B, C] = createVertices(['A', 'B', 'C']);

    const [edgeBA, edgeCA] = createEdges([
      [B, A],
      [C, A],
    ]);

    A.addEdges([edgeBA, edgeCA]);

    expect(B.getNeighbors()).toEqual([]);

    const neighbors = A.getNeighbors();

    expect(neighbors).toHaveLength(2);
    expect(neighbors[0]).toEqual(B);
    expect(neighbors[1]).toEqual(C);
  });

  it('should check if vertex has specific neighbor', () => {
    const [A, B, C] = createVertices(['A', 'B', 'C']);

    const edgeAB = new GraphEdge(A, B);

    A.addEdge(edgeAB);

    expect(A.hasNeighbor(B)).toBeTrue();
    expect(A.hasNeighbor(C)).toBeFalse();
  });

  it('should edge by vertex', () => {
    const [A, B, C] = createVertices(['A', 'B', 'C']);

    const edgeAB = new GraphEdge(A, B);
    A.addEdge(edgeAB);

    expect(A.findEdge(B)).toEqual(edgeAB);
    expect(A.findEdge(C)).toBeUndefined();
  });

  it('should represent a vertex', () => {
    const vertex = new GraphVertex('A');
    expect(vertex.toString()).toBe('A');
  });

  it('should represent a vertex with decorator', () => {
    const vertex = new GraphVertex('A');
    expect(vertex.toString((value) => `Name: ${value}`)).toBe('Name: A');
  });

  it('should calculate vertex degree', () => {
    const [A, B] = createVertices(['A', 'B']);

    expect(A.getDegree()).toBe(0);

    const edgeAB = new GraphEdge(A, B);
    A.addEdge(edgeAB);

    expect(A.getDegree()).toBe(1);

    const edgeBA = new GraphEdge(B, A);
    A.addEdge(edgeBA);

    expect(A.getDegree()).toBe(2);

    A.addEdge(edgeAB);
    expect(A.getDegree()).toBe(3);

    expect(A.getEdges()).toHaveLength(3);
  });
});
