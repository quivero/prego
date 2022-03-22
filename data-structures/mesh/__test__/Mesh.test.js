import Mesh from '../Mesh';

describe('Mesh', () => {
  it('should contain mesh tests', () => {
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
});
