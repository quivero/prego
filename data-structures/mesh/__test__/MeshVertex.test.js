import MeshVertex from "../MeshVertex.js";
import { throwError } from "#utils/sys/sys.js";

jest.mock("#utils/sys/sys.js");

let result, expected;

describe("MeshVertex", () => {
  it("should throw an error when trying to create MeshVertex", () => {
    new MeshVertex();

    result = throwError;
    expected = 1;

    expect(result).toHaveBeenCalledTimes(expected);
  });

  it("should create graph vertex", () => {
    const gvertex = new MeshVertex("A", [1, 2]);
    expect(gvertex.getKey()).toBe("A");
    expect(gvertex.toString()).toBe("A");
  });
});
