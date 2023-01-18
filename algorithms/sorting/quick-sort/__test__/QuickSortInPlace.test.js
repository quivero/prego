import QuickSortInPlace from "../QuickSortInPlace";

import { SortTester } from "#algorithms/sorting/SortTester.js";

import { arr, sorted_arr, reverse_arr, ones_arr } from "../../fixtures";

// Complexity constants.
const SORTED_ARRAY_VISITING_COUNT = 19;
const NOT_SORTED_ARRAY_VISITING_COUNT = 12;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 19;
const EQUAL_ARRAY_VISITING_COUNT = 19;

describe("QuickSortInPlace", () => {
  it("should sort array", () => {
    SortTester.testSort(QuickSortInPlace);
  });

  it("should sort array with custom comparator", () => {
    SortTester.testSortWithCustomComparator(QuickSortInPlace);
  });

  it("should sort negative numbers", () => {
    SortTester.testNegativeNumbersSort(QuickSortInPlace);
  });

  it("should visit EQUAL array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSortInPlace,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it("should visit SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSortInPlace,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit NOT SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSortInPlace,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit REVERSE SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      QuickSortInPlace,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
