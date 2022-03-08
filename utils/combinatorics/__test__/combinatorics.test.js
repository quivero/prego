import {
  partitions,
} from '../partition.js';

import {
  arraysEqual,
} from '../../arrays/arrays.js';

describe('combinatorics', () => {
  it('should return number k-partition summand terms', () => {
    expect(arraysEqual(partitions(5, 2), [[4, 1], [3, 2]])).toStrictEqual(true);
  });
});
