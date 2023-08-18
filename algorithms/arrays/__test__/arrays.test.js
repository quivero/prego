import _ from 'lodash';
import {
  ones,
  unique,
  getAllIndexes,
  countDict,
  randMinMax,
  nRandMinMax,
  nRandMinsMaxs,
  cyclicSort,
  isCyclicEqual,
  getUniques,
  euler,
  removeElements,
  hasElement,
  sort,
  mSetsOfnTuples,
  hyperIndexes,
  upperTriangularIndexesFn,
  fullPolytopeIndexesFn,
  fullPolytopeHyperindexes,
  upperTriangularHyperindexes,
  sequentialArrayBlobs,
  zeros,
} from '../arrays';

import { raise } from '#algorithms/sys/sys.js';

jest.mock('#algorithms/sys/sys');

let candidate, expected;

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Array', () => {
  it('should get an array of ones', () => {
    expect(ones(5)).toStrictEqual([1, 1, 1, 1, 1]);
  });

  it('should get an array of zeros', () => {
    expect(zeros(2)).toStrictEqual([0, 0]);
  });

  it('should return unique array elements', () => {
    const object_ = unique(['a', 1, { a: 1 }, 'a']);

    expect(object_).toEqual(['a', 1, { a: 1 }]);
  });

  it('should get a random number between 0 and 1', () => {
    const num = randMinMax(0, 1);

    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(1);
  });

  it('should get a [2, 1] random array between 0 and 1', () => {
    const num = nRandMinMax(2, 0, 1);

    expect(num[0]).toBeGreaterThanOrEqual(0);
    expect(num[0]).toBeLessThanOrEqual(1);

    expect(num[1]).toBeGreaterThanOrEqual(0);
    expect(num[1]).toBeLessThanOrEqual(1);
  });

  it('should get a [2, 1] random array with first entry between 0 and 1 and second entry between 1 and 2', () => {
    const num = nRandMinsMaxs([
      [0, 1],
      [1, 2],
    ]);

    expect(num[0]).toBeGreaterThanOrEqual(0);
    expect(num[0]).toBeLessThanOrEqual(1);

    expect(num[1]).toBeGreaterThanOrEqual(1);
    expect(num[1]).toBeLessThanOrEqual(2);
  });

  it('should call raise for one entry in min_max', () => {
    nRandMinsMaxs([[1]]);

    expect(raise).toHaveBeenCalled();
  });

  it('should call raise for non-numerical entries', () => {
    nRandMinsMaxs([['0', '42']]);

    expect(raise).toHaveBeenCalled();
  });

  it('should call raise for min_max in decrescent order', () => {
    nRandMinsMaxs([[1, 0]]);

    expect(raise).toHaveBeenCalled();
  });

  it('should get all indexes of given value within array', () => {
    expect(getAllIndexes([1, 2, 3, 3], 1)).toStrictEqual([0]);
    expect(getAllIndexes([1, 2, 3, 3], 2)).toStrictEqual([1]);
    expect(getAllIndexes([1, 2, 3, 3], 3)).toStrictEqual([2, 3]);
  });

  it('should return true for control_ array  equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'DABC')).toBeTrue();
  });

  it('should return true control_ array is not equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABDC')).toBeFalse();
  });

  it('should return true control_ array has not the same length as treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABC')).toBeFalse();
  });

  it('should reorder elements from chain in a cyclic form', () => {
    expect(cyclicSort('ABCD', 2)).toBe('CDAB');
  });

  it('should call raise for array length greater than given index', () => {
    cyclicSort([1, 2, 3], 4);

    expect(raise).toHaveBeenCalled();
  });

  it('should call raise for inexistent input arguments ', () => {
    sort([3, 1, 2], 2);

    expect(raise).toHaveBeenCalled();
  });

  it('should call raise for invalid blob scenario ', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const m = 3;
    const n = 5;

    const set_gen = mSetsOfnTuples(arr, n, m);

    set_gen.next();

    expect(raise).toHaveBeenCalled();
  });

  it('should return 1 set on given objects', () => {
    const arr = [1, 2, 3];
    let m = 1;
    let n = 3;

    expected = [1, 2, 3];

    let set_gen = mSetsOfnTuples(arr, m, n);

    candidate = set_gen.next().value;
    expect(arr).toStrictEqual(expected);

    m = 2;
    n = 1;

    expected = [[1], [2]];

    set_gen = mSetsOfnTuples(arr, m, n);
    candidate = set_gen.next().value;

    expect(candidate).toStrictEqual(expected);
  });

  it('should call raise for invalid input arguments ', () => {
    const hyperIndexes_gen = hyperIndexes(1, -1, () => 'test');
    hyperIndexes_gen.next();

    expect(raise).toHaveBeenCalled();
  });

  it('should return an descending ordered array', () => {
    expect(sort([1, 2, 3, 4, 5])).toEqual([5, 4, 3, 2, 1]);
  });

  it('should return an ascending ordered array', () => {
    expect(sort([5, 4, 3, 2, 1], 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return remove elements from array', () => {
    expect(_.isEqual(removeElements([1, 2, 3, 4], [1, 2]), [3, 4])).toBeTrue();
  });

  it('should return sequential blobs of numbers in number array', () => {
    expect(sequentialArrayBlobs([1])).toEqual({
      0: [1],
    });

    expect(sequentialArrayBlobs([1, 2, 4, 5])).toEqual({
      0: [1, 2],
      1: [4, 5],
    });

    expect(sequentialArrayBlobs([1, 2, 4, 5, 7, 8])).toEqual({
      0: [1, 2],
      1: [4, 5],
      2: [7, 8],
    });

    expect(sequentialArrayBlobs([1, 2, 4, 5, 5, 7, 8])).toEqual({
      0: [1, 2],
      1: [4, 5, 5],
      2: [7, 8],
    });
  });

  it('should return count dict', () => {
    expect(countDict([1, 1, 2, 2, 2, 3, 4, 4])).toEqual({
      1: 2,
      2: 3,
      3: 1,
      4: 2,
    });
  });

  it('should return the unique array elements', () => {
    expect(getUniques('ABCDA')).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should return full polytope hyper-indexes', () => {
    expect([...hyperIndexes(2, 2, fullPolytopeIndexesFn)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);

    expect([...fullPolytopeHyperindexes(2, 2)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it('should return upper triangular polytope hyper-indexes', () => {
    expect([...hyperIndexes(2, 2, upperTriangularIndexesFn)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);

    expect([...upperTriangularHyperindexes(2, 2)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
  });
});

describe('hasElement', () => {
  it('should return true for element on array', () => {
    expect(hasElement([1, 2, 3], 3)).toBeTrue();
  });

  it('should return true for array on array of elements', () => {
    expect(
      hasElement([ [1, 2], [1, 2, 3] ], [1, 2]),
    ).toBeTrue();
  });

  it('should return false for non-existent array on array of elements', () => {
    expect(
      hasElement([ [1, 2], [1, 2, 3] ], [1]),
    ).toBeFalse();
  });
});
