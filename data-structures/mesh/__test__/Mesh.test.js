import Mesh from '../Mesh';
import MeshVertex from '../MeshVertex';

describe('Mesh', () => {
  it('should return a defined object', () => {
    let metric_fun = (coord_1, coord_2) => {
      return Math.sqrt(
        Math.pow(
          coord_2.coordinates[1]-coord_1.coordinates[1], 2) + 
        Math.pow(
          coord_2.coordinates[0]-coord_1.coordinates[0], 2
        )
        )
    }

    let mesh = new Mesh(metric_fun)
    
    expect(mesh).toBeDefined();
  });

  it('should throw an error for non valid metric', () => {
    function meshWithNotValidMetric() {
      let metric_fun = (coord_1, coord_2) => {
        return -Math.sqrt(
          Math.pow(
            coord_2.coordinates[1]-coord_1.coordinates[1], 2) + 
          Math.pow(
            coord_2.coordinates[0]-coord_1.coordinates[0], 2
          )
          )
      }
  
      return new Mesh(metric_fun)
    }
    
    expect(meshWithNotValidMetric).toThrowError();
  });
  
  it('should return two added vertices and the distance between them is one', () => {
    let metric_fun = (coord_1, coord_2) => {
      return Math.sqrt(
        Math.pow(
          coord_2.coordinates[1]-coord_1.coordinates[1], 2) + 
        Math.pow(
          coord_2.coordinates[0]-coord_1.coordinates[0], 2
        )
      )
    }

    let mesh = new Mesh(metric_fun)
    let A = new MeshVertex('A', [0, 0])
    let B = new MeshVertex('B', [0, 1])
    
    mesh.addVertices([A, B])
    
    expect(mesh.getAllVertices().length).toBe(2);
    expect(mesh.distance('A', 'B')).toBe(1);
  });

  it('should return two added vertices and the distance between them is one', () => {
    let metric_fun = (coord_1, coord_2) => {
      return Math.sqrt(
        Math.pow(
          coord_2.coordinates[1]-coord_1.coordinates[1], 2) + 
        Math.pow(
          coord_2.coordinates[0]-coord_1.coordinates[0], 2
        )
      )
    }

    let mesh = new Mesh(metric_fun)
    let A = new MeshVertex('A', [0, 0])
    let B = new MeshVertex('B', [0, 1])
    let C = new MeshVertex('C', [1, 0])
    
    mesh.addVertices([A, B, C])
    
    expect(mesh.getAllVertices().length).toBe(3);
    expect(mesh.distance('A', 'B')).toBe(1);
    expect(mesh.getPathLength([0, 1, 2])).toBe(1+Math.sqrt(2));
  });
});
