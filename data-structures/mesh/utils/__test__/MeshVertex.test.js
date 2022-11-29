import _ from 'lodash'

import {
  TOKEN_LENGTH,
  createMVertices,
  createRandomMVertices
} from "../mesh.js";

import { throwError } from "../../../../utils/sys/sys.js";

jest.mock("../../../../utils/sys/sys.js");

describe("MeshVertex", () => {
  it("should return n random arrays", () => {
    let n = 2;
    let bounds = [[0, 1], [1, 2]]

    const m_vertices = createRandomMVertices(n, bounds);

    for (let i in _.range(n)) {
      expect(m_vertices[i].label.length).toBe(TOKEN_LENGTH);

      for (let j in _.range(bounds.length)) {
        expect(m_vertices[i].coordinates[j]).toBeGreaterThanOrEqual(bounds[j][0]);
        expect(m_vertices[i].coordinates[j]).toBeLessThanOrEqual(bounds[j][1]);
      }
    }
  });

  it("should throw for negative quantity of vertices", () => {
      let n = -1;
      let bounds = [[0, 1], [1, 2]]
      
      createRandomMVertices(n, bounds);

      expect(throwError).toHaveBeenCalled();
  });

  it("should throw for negative quantity of vertices", () => {
      let n = '42';
      let bounds = [[0, 1], [1, 2]]
      
      createRandomMVertices(n, bounds);

      expect(throwError).toHaveBeenCalled();
  });

  it("should create mesh vertex", () => {
    const MVertices = createMVertices(["A"], [[1, 2]]);

    expect(MVertices[0].label).toBe("A");
    expect(MVertices[0].coordinates).toStrictEqual([1, 2]);
  });

  it("should throw error for unequal array lengths", () => {
    createMVertices(["A", "B"], [[1, 2]]);  

    expect(throwError).toHaveBeenCalled();
  });
});
