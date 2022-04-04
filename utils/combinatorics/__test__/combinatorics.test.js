import {
  partitions,
  cardvecCombinations,
  partitionTree
} from '../partition.js';

import _ from 'lodash';

describe('combinatorics', () => {
  it('should return number k-partition summand terms', () => {
    
    expect(partitions(3)).toEqual(
      [[1, 1, 1], [2, 1], [3]]
    );
  });

  it('should throw an error for negative number', () => {
    function partitionWithNegativeNumber() {
      return partitions(-42);
    }

    expect(partitionWithNegativeNumber).toThrowError();
  });

  it('should throw an error for decimal number', () => {
    function partitionWithDecimalNumber() {
      return partitions(4.2);
    }

    expect(partitionWithDecimalNumber).toThrowError();
  });
});

describe('cardvecCombinations', () => {
  it('should return combinations for given cardinality vector', () => {
    expect(_.isEqual(
      cardvecCombinations([1, 2, 3], [1, 2]),
      [
        [[1], [[2, 3]]],
        [[2], [[1, 3]]],
        [[3], [[1, 2]]],
      ],
    )).toStrictEqual(true);
  });

  it('should throw error ', () => {
    function cardvecSumDifferentFromPointsLength() {
      return cardvecCombinations([1, 2, 3], [1, 1]);
    }

    expect(cardvecSumDifferentFromPointsLength).toThrow();
  });
});
