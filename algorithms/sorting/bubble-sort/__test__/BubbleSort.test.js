import BubbleSort from "../BubbleSort";

import { SortTester } from "@algorithms/sorting/SortTester.js";

import { arr, sorted_arr, reverse_arr, ones_arr } from "../../fixtures";

// Complexity constants.
const SORTED_ARRAY_VISITING_COUNT = 20;
const NOT_SORTED_ARRAY_VISITING_COUNT = 189;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 209;
const EQUAL_ARRAY_VISITING_COUNT = 20;

describe("BubbleSort", () => {
  it("should sort array", () => {
    SortTester.testSort(BubbleSort);
  });

  it("should sort array with custom comparator", () => {
    SortTester.testSortWithCustomComparator(BubbleSort);
  });

  it("should do stable sorting", () => {
    SortTester.testSortStability(BubbleSort);
  });

  it("should sort negative numbers", () => {
    SortTester.testNegativeNumbersSort(BubbleSort);
  });

  it("should visit EQUAL array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      BubbleSort,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it("should visit SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      BubbleSort,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit NOT SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      BubbleSort,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit REVERSE SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      BubbleSort,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
