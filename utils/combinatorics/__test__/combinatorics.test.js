import {
  partitions,
  cardvecCombinations,
  partitionTree
} from '../partition.js';

import _ from 'lodash';

describe('combinatorics', () => {
  it('should return number k-partition summand terms', () => {
    expect(_.isEqual(partitions(5, 2), [[4, 1], [3, 2]])).toStrictEqual(true);
  });

  it('should throw an error for negative number of partitions', () => {
    function partitionWithNegativeLength() {
      return partitions(10, -1);
    }

    expect(partitionWithNegativeLength).toThrowError();
  });

  it('should throw an error for more blobs than points', () => {
    function partitionWithMoreBlobsThanPoints() {
      return partitions(10, 11);
    }

    expect(partitionWithMoreBlobsThanPoints).toThrowError();
  });

  it('should throw an error for negative number of partitions', () => {
    function partitionWithMoreBlobsThanPoints() {
      return partitions(10, 11);
    }

    expect(partitionWithMoreBlobsThanPoints).toThrowError();
  });

  it('should throw an error for negative number of partitions', () => {
    expect(_.isEqual(partitions(10, 1), [10])).toBe(true);
  });

  it('should return the partition tree of number with certain number of summands', () => {
    const ptree  = []
    
    for(const tree_node of partitionTree(2, 2)) {
      ptree.push(tree_node)
    }
    
    expect(ptree).toEqual(
      [{
        "element": 1,
        "partition": [ 1, 1, ],
        "size": 1,
        "tree_node": {
          "element": [ 1, ],
          "partition": [ 1, ],
          "size": 1,
          "tree_node": [ 1, ],
        },
      }]
    );
  });

  it('should throw an error for negative number of partitions', () => {
    function negativeNumberForPartitionTree() {
      return [...partitionTree(-1, 42)]
    }

    function negativeSummandNumberForPartitionTree() {
      return [...partitionTree(42, -1)]
    }
    
    expect(negativeNumberForPartitionTree).toThrow();
    expect(negativeSummandNumberForPartitionTree).toThrow();
  });

  it('should throw an error for number of summands greater than the number', () => {
    function summandsGreaterThanNumber() {
      return [...partitionTree(41, 42)]
    }
    
    expect(summandsGreaterThanNumber).toThrow();
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
