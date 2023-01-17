import CountingSort from "../CountingSort";

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
const SORTED_ARRAY_VISITING_COUNT = 60;
const NOT_SORTED_ARRAY_VISITING_COUNT = 60;
const REVERSE_SORTED_ARRAY_VISITING_COUNT = 60;
const EQUAL_ARRAY_VISITING_COUNT = 60;

describe("CountingSort", () => {
  it("should sort array", () => {
    SortTester.testSort(CountingSort);
  });

  it("should sort negative numbers", () => {
    SortTester.testNegativeNumbersSort(CountingSort);
  });

  it("should allow to use specify max/min integer value in array to make sorting faster", () => {
    const visitingCallback = jest.fn();
    const sorter = new CountingSort({ visitingCallback });

    // Detect biggest number in array in prior.
    const biggestElement = Math.max(...arr);

    // Detect smallest number in array in prior.
    const smallestElement = Math.min(...arr);

    const sorted_array = sorter.sort(
      arr,
      smallestElement,
      biggestElement
    );

    expect(sorted_array).toEqual(sorted_arr);
    // Normally visitingCallback is being called 60 times but in this case
    // it should be called only 40 times.
    expect(visitingCallback).toHaveBeenCalledTimes(40);
  });

  it("should visit EQUAL array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      CountingSort,
      ones_arr,
      EQUAL_ARRAY_VISITING_COUNT
    );
  });

  it("should visit SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      CountingSort,
      sorted_arr,
      SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit NOT SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      CountingSort,
      arr,
      NOT_SORTED_ARRAY_VISITING_COUNT
    );
  });

  it("should visit REVERSE SORTED array element specified number of times", () => {
    SortTester.testAlgorithmTimeComplexity(
      CountingSort,
      reverse_arr,
      REVERSE_SORTED_ARRAY_VISITING_COUNT
    );
  });
});
