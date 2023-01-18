import MergeSort from "../MergeSort";

import { SortTester } from "@algorithms/sorting/SortTester.js";

import { arr, sorted_arr, reverse_arr, ones_arr } from "../../fixtures";

// Complexity constants.
const SORTED_ARRAY_VISITING_COUNT = 79;
const NOT_SORTED_ARRAY_VISITING_COUNT = 102;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 87;
const EQUAL_ARRAY_VISITING_COUNT = 79;

describe("MergeSort", () => {
  it("should sort array", () => {
    SortTester.testSort(MergeSort);
  });

  it("should sort array with custom comparator", () => {
    SortTester.testSortWithCustomComparator(MergeSort);
  });

  it("should do stable sorting", () => {
    SortTester.testSortStability(MergeSort);
  });

  it("should sort negative numbers", () => {
    SortTester.testNegativeNumbersSort(MergeSort);
  });

  it("should visit EQUAL array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      MergeSort,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it("should visit SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      MergeSort,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit NOT SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      MergeSort,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit REVERSE SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      MergeSort,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
