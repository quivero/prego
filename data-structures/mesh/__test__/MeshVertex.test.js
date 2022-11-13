import MeshVertex from "../MeshVertex.js";
import { createMVertices } from "../MeshVertex.js";

describe("GraphicMeshVertex", () => {
  it("should throw an error when trying to create MeshVertex", () => {
    let vertex = null;

    function createEmptyGVertex() {
      vertex = new MeshVertex();
    }

    expect(vertex).toBeNull();
    expect(createEmptyGVertex).toThrow();
  });

  it("should create graph vertex", () => {
    const gvertex = new MeshVertex("A", [1, 2]);
    expect(gvertex.getKey()).toBe("A");
  });

  it("should create graph vertex", () => {
    createMVertices(["A"], [[1, 2]]);
  });

  it("should throw error for unequal array lengths", () => {
    function throwErrorUnequalArrayLengths() {
      createMVertices(["A", "b"], [[1, 2]]);
    }

    expect(throwErrorUnequalArrayLengths).toThrowError();
  });
});
