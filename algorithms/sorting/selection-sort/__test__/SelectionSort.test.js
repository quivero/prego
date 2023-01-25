import SelectionSort from '../SelectionSort';

import { SortTester } from '#algorithms/sorting/SortTester.js';

import { arr, sorted_arr, reverse_arr, ones_arr } from '../../fixtures';

// Complexity constants.
const SORTED_ARRAY_VISITING_COUNT = 209;
const NOT_SORTED_ARRAY_VISITING_COUNT = 209;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 209;
const EQUAL_ARRAY_VISITING_COUNT = 209;

describe('SelectionSort', () => {
  it('should sort array', () => {
    SortTester.testSort(SelectionSort);
  });

  it('should sort array with custom comparator', () => {
    SortTester.testSortWithCustomComparator(SelectionSort);
  });

  it('should sort negative numbers', () => {
    SortTester.testNegativeNumbersSort(SelectionSort);
  });

  it('should visit EQUAL array element specified number of times', () => {
    SortTester.testAlgorithmTimeComplexity(
      SelectionSort,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it('should visit SORTED array element specified number of times', () => {
    SortTester.testAlgorithmTimeComplexity(
      SelectionSort,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it('should visit NOT SORTED array element specified number of times', () => {
    SortTester.testAlgorithmTimeComplexity(
      SelectionSort,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it('should visit REVERSE SORTED array element specified number of times', () => {
    SortTester.testAlgorithmTimeComplexity(
      SelectionSort,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
