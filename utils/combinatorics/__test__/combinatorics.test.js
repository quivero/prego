import {
  partitions,
  cardvecCombinations
} from '../partition.js';

import {
  arraysEqual,
} from '../../arrays/arrays.js';

describe('combinatorics', () => {
  it('should return number k-partition summand terms', () => {
    expect(arraysEqual(partitions(5, 2), [[4, 1], [3, 2]])).toStrictEqual(true);
  });

  it('should throw an error for negative number of partitions', () => {
    function partitionWithNegativeLength() {
      return partitions(10, -1)
    }

    expect(partitionWithNegativeLength).toThrowError()
  });

  it('should throw an error for more blobs than points', () => {
    function partitionWithMoreBlobsThanPoints() {
      return partitions(10, 11)
    }

    expect(partitionWithMoreBlobsThanPoints).toThrowError()
  });

  it('should throw an error for negative number of partitions', () => {
    function partitionWithMoreBlobsThanPoints() {
      return partitions(10, 11)
    }

    expect(partitionWithMoreBlobsThanPoints).toThrowError()
  });

  it('should throw an error for negative number of partitions', () => {
    expect(arraysEqual(partitions(10, 1), [10])).toBe(true)
  });

});

describe('cardvecCombinations', () => {
  it('should return combinations for given cardinality vector', () => {
    expect(arraysEqual(
      cardvecCombinations([1, 2, 3], [1, 2]),
      [
        [[1], [[2, 3]]],
        [[2], [[1, 3]]],
        [[3], [[1, 2]]]
      ]
    )).toStrictEqual(true);
  });

  it('should throw error ', () => {
    function cardvecSumDifferentFromPointsLength() {
      return cardvecCombinations([1, 2, 3], [1, 1])
    }
    
    expect(cardvecSumDifferentFromPointsLength).toThrow();
  });
});