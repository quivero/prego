import {
  nNormDistance,
  nNorm,
  greatCircleDistance,
  nSphereDistance,
  distance,
  travelTime,
} from '../distance.js';

import { throwError } from '#utils/sys/sys.js';

jest.mock('../../sys/sys');

let result;
let expected;

describe('distance', () => {
  it.each([
    [1, 2],
    [2, Math.sqrt(2)],
    [Infinity, 1],
  ])('should return n norm of two tuple coordinates', (exponent, expected) => {
    const coord_1 = [1, 1];
    const coord_2 = [2, 2];

    result = nNormDistance(coord_1, coord_2, exponent);

    expect(result).toBe(expected);
  });

  it('should return n-norm of a number array', () => {
    const coords = [1, 1, 1, 1, 1];

    result = nNorm(coords, 2);
    expected = Math.sqrt(5);

    expect(result).toBeCloseTo(expected);
  });

  it('should throw exception for negative n', () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    nNormDistance(coord_1, coord_2, -1);

    expect(throwError).toHaveBeenCalled();
  });

  it('should return distance between two coordinates on a sphere', () => {
    const coord_1 = [0, 0];
    const coord_2 = [0, Math.PI / 2];
    const coord_3 = [Math.PI / 2, 0];
    const radius = 1;

    result = greatCircleDistance(coord_1, coord_2, radius);
    expected = Math.PI / 2;

    expect(result).toBeCloseTo(expected);

    result = greatCircleDistance(coord_1, coord_3, radius);
    expected = Math.PI / 2;

    expect(result).toBeCloseTo(expected);

    result = greatCircleDistance(coord_2, coord_3, radius);
    expected = Math.PI / 2;

    expect(result).toBeCloseTo(expected);
  });

  it('should return distance on a sphere', () => {
    const coord_1 = [0, 0];
    const coord_2 = [Math.PI / 2, 0];
    const coord_3 = [Math.PI, 0];
    const radius = 1;

    expected = (2 * Math.PI * radius) / 4;
    result = nSphereDistance(coord_1, coord_2, radius);

    expect(expected).toBeCloseTo(result);

    result = nSphereDistance(coord_1, coord_3, radius);
    expected = (2 * Math.PI * radius) / 2;

    expect(result).toBeCloseTo(expected);

    result = nSphereDistance(coord_2, coord_3, radius);
    expected = (2 * Math.PI * radius) / 4;

    expect(result).toBeCloseTo(expected);
  });

  it('should return distance between coordinates according to method sphere', () => {
    const coord_1 = [0, 0];
    const coord_2 = [Math.PI / 2, 0];

    result = distance(coord_1, coord_2, 'sphere', { radius: 1 });
    expected = (2 * Math.PI) / 4;

    expect(result).toBeCloseTo(expected);
  });

  it('should throw exception for 1-dimensional coordinates', () => {
    const coord_1 = [0];
    const coord_2 = [1];

    distance(coord_1, coord_2, 'sphere', { radius: 1 });

    expect(throwError).toHaveBeenCalled();
  });

  it('should throw exception for empty configuration dict', () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    distance(coord_1, coord_2, '', {});

    expect(throwError).toHaveBeenCalled();
  });

  it('should throw exception for missing exponent', () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    distance(coord_1, coord_2, undefined, {});

    expect(throwError).toHaveBeenCalled();
  });

  it('should throw exception for missing radius', () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    distance(coord_1, coord_2, 'sphere', {});

    expect(throwError).toHaveBeenCalled();
  });

  it('should return distance between coordinates according to method sphere', () => {
    const coord_1 = [0, 0];
    const coord_2 = [Math.PI / 2, 0];

    expect(distance(coord_1, coord_2, 'sphere', { radius: 1 })).toBeCloseTo(
      (2 * Math.PI) / 4
    );
  });

  it('should return distance between coordinates according to method n_norm', () => {
    const coord_1 = [1, 1];
    const coord_2 = [2, 2];

    expect(distance(coord_1, coord_2, 'n_norm', { exponent: 1 })).toBeCloseTo(
      2
    );

    expect(distance(coord_1, coord_2, 'n_norm', { exponent: 2 })).toBeCloseTo(
      Math.sqrt(2)
    );
  });

  it('should return 2-Euclidean distance for absent exponent on methodConfig input', () => {
    const coord_1 = [0, 0];
    const coord_2 = [1, 1];

    result = distance(coord_1, coord_2, 'n_norm', {});
    expected = Math.sqrt(2);

    expect(result).toBeCloseTo(expected);
  });

  it('should return greatest absolute difference for infinity norm', () => {
    const coord_1 = [1, -1];
    const coord_2 = [2, 2];

    expect(
      distance(coord_1, coord_2, 'n_norm', { exponent: Infinity })
    ).toBeCloseTo(3);
  });

  it.each([
    [1, [1, 1], [2, 2], 'n_norm', { exponent: 2 }, Math.sqrt(2)],
    [1, [1, -1], [2, 2], 'n_norm', { exponent: Infinity }, 3],
    [1, [0, 0], [Math.PI / 2, 0], 'sphere', { radius: 1 }, (2 * Math.PI) / 4],
    [2, [1, 1], [2, 2], 'n_norm', { exponent: 2 }, Math.sqrt(2) / 2],
    [2, [1, -1], [2, 2], 'n_norm', { exponent: Infinity }, 1.5],
    [2, [0, 0], [Math.PI / 2, 0], 'sphere', { radius: 1 }, (2 * Math.PI) / 8],
  ])(
    'should return time to travel from coord_1 to coord_2',
    (
      average_speed,
      coordinate_1,
      coordinate_2,
      method,
      method_config,
      expected_value
    ) => {
      result = travelTime(
        average_speed,
        coordinate_1,
        coordinate_2,
        method,
        method_config
      );

      expect(result).toBeCloseTo(expected_value);
    }
  );
});
