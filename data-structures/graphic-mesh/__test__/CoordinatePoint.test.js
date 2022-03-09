import CoordinatePoint from '../CoordinatePoint.js';
import { arraysEqual } from '../../../utils/arrays/arrays.js';

describe('CoordinatePoint', () => {
  it('should create a CoordinatePoint', () => {
    const coordinate_point = new CoordinatePoint('A');

    expect(arraysEqual(coordinate_point.coordinate, [])).toBe(true);
    coordinate_point.coordinate = [1, 2];
    expect(arraysEqual(coordinate_point.coordinate, [1, 2])).toBe(true);
    expect(coordinate_point.toString()).toBe('A');
  });
});
