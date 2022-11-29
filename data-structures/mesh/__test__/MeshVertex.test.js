import MeshVertex from "../MeshVertex.js";
import { createMVertices } from "../MeshVertex.js";

import { throwError } from "../../../utils/sys/sys.js";

jest.mock("../../../utils/sys/sys.js");

describe("MeshVertex", () => {
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
    expect(gvertex.toString()).toBe("A");
  });

  it("should create graph vertex", () => {
    createMVertices(["A"], [[1, 2]]);
  });

  it("should throw error for unequal array lengths", () => {
    createMVertices(["A", "b"], [[1, 2]]);  

    expect(throwError).toHaveBeenCalled();
  });
});
