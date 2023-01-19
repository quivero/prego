import QuickSort from "../QuickSort";

import { SortTester } from "#algorithms/sorting/SortTester.js";

import { arr, sorted_arr, reverse_arr, ones_arr } from "../../fixtures";

// Complexity constants.
const SORTED_ARRAY_VISITING_COUNT = 190;
const NOT_SORTED_ARRAY_VISITING_COUNT = 62;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 190;
const EQUAL_ARRAY_VISITING_COUNT = 19;

describe("QuickSort", () => {
  it("should sort array", () => {
    SortTester.testSort(QuickSort);
  });

  it("should sort array with custom comparator", () => {
    SortTester.testSortWithCustomComparator(QuickSort);
  });

  it("should do stable sorting", () => {
    SortTester.testSortStability(QuickSort);
  });

  it("should sort negative numbers", () => {
    SortTester.testNegativeNumbersSort(QuickSort);
  });

  it("should visit EQUAL array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSort,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it("should visit SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSort,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit NOT SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSort,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit REVERSE SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSort,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
