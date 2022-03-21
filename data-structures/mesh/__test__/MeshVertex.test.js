import GraphicMeshVertex from '../MeshVertex.js';

describe('GraphicMeshVertex', () => {
  it('should throw an error when trying to create GraphicMeshVertex', () => {
    let vertex = null;

    function createEmptyGVertex() {
      vertex = new GraphicMeshVertex();
    }

    expect(vertex).toBeNull();
    expect(createEmptyGVertex).toThrow();
  });

  it('should create graph vertex', () => {
    const gvertex = new GraphicMeshVertex('A', [1, 2]);

    expect(gvertex).toBeDefined();
    expect(gvertex.label).toBe('A');
    expect(gvertex.toString()).toBe('A');
    expect(gvertex.getKey()).toBe('A');
  });
});
