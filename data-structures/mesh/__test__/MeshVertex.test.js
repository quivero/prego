import MeshVertex from '../MeshVertex.js';

describe('GraphicMeshVertex', () => {
  it('should throw an error when trying to create MeshVertex', () => {
    let vertex = null;

    function createEmptyGVertex() {
      vertex = new MeshVertex();
    }

    expect(vertex).toBeNull();
    expect(createEmptyGVertex).toThrow();
  });

  it('should create graph vertex', () => {
    const gvertex = new MeshVertex('A', [1, 2]);

    expect(gvertex).toBeDefined();
    expect(gvertex.toString()).toBe('A');
    expect(gvertex.getKey()).toBe('A');
  });
});
