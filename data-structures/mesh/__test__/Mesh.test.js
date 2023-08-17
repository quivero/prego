import Mesh from '../Mesh';
import MeshVertex from '../MeshVertex';
import { distance } from '#math/distances/distance.js';

describe('Mesh', () => {
  it('should return a defined object with metric validation', () => {
    const valid_metric_fun = (coord_1, coord_2) =>
      Math.sqrt(
        (coord_2.coordinates[1] - coord_1.coordinates[1]) ** 2 +
          (coord_2.coordinates[0] - coord_1.coordinates[0]) ** 2,
      );

    const mesh = new Mesh(valid_metric_fun, true);

    expect(mesh).toBeDefined();
  });

  it('should calculate distance between vertices', () => {
    const metric_fun = (coord_1, coord_2) =>
      Math.sqrt(
        (coord_2[1] - coord_1[1]) ** 2 + (coord_2[0] - coord_1[0]) ** 2,
      );

    const mesh = new Mesh(metric_fun);
    const A = new MeshVertex('A', [0, 0]);
    const B = new MeshVertex('B', [0, 1]);

    mesh.addVertices([A, B]);

    expect(mesh.getAllVertices()).toHaveLength(2);
    expect(mesh.distance('A', 'B')).toBe(1);
  });

  it('should return path distance', () => {
    const distance_fun = (coord_1, coord_2) =>
      Math.sqrt(
        (coord_2[1] - coord_1[1]) ** 2 + (coord_2[0] - coord_1[0]) ** 2,
      );

    const mesh = new Mesh(distance_fun);
    const A = new MeshVertex('A', [0, 0]);
    const B = new MeshVertex('B', [0, 1]);
    const C = new MeshVertex('C', [1, 0]);

    mesh.addVertices([A, B, C]);

    expect(mesh.getAllVertices()).toHaveLength(3);
    expect(mesh.distance('A', 'B')).toBe(1);
    expect(mesh.getPathLength([0, 1, 2])).toBe(1 + Math.sqrt(2));
  });

  it('should return path distance with n_norm', () => {
    const distance_fun = (coord_1, coord_2) =>
      distance(coord_1, coord_2, 'n_norm', { exponent: 2 });

    const mesh = new Mesh(distance_fun);
    const A = new MeshVertex('A', [0, 0]);
    const B = new MeshVertex('B', [0, 1]);
    const C = new MeshVertex('C', [1, 0]);

    mesh.addVertices([A, B, C]);

    expect(mesh.getAllVertices()).toHaveLength(3);
    expect(mesh.distance('A', 'B')).toBe(1);
    expect(mesh.getPathLength([0, 1, 2])).toBe(1 + Math.sqrt(2));
  });
});
