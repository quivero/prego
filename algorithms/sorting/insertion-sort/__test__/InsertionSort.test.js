import InsertionSort from "../InsertionSort";

import {
  SortTester,
} from "@algorithms/sorting/SortTester.js";

import {
  arr,
  sorted_arr,
  reverse_arr,
  ones_arr
} from '../../fixtures'

// Complexity constants.
const SORTED_ARRAY_VISITING_COUNT = 19;
const NOT_SORTED_ARRAY_VISITING_COUNT = 100;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 209;
const EQUAL_ARRAY_VISITING_COUNT = 19;

describe("InsertionSort", () => {
  it("should sort array", () => {
    SortTester.testSort(InsertionSort);
  });

  it("should sort array with custom comparator", () => {
    SortTester.testSortWithCustomComparator(InsertionSort);
  });

  it("should do stable sorting", () => {
    SortTester.testSortStability(InsertionSort);
  });

  it("should sort negative numbers", () => {
    SortTester.testNegativeNumbersSort(InsertionSort);
  });

  it("should visit EQUAL array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      InsertionSort,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it("should visit SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      InsertionSort,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit NOT SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      InsertionSort,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit REVERSE SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      InsertionSort,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
