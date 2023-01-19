import _ from "lodash";
import { partitions, cardvecCombinations } from "../partition.js";

let expected, result;

describe("combinatorics", () => {
  it("should return number k-partition summand terms", () => {
    result = partitions(3);
    expected = [[1, 1, 1], [2, 1], [3]];
    
    expect(result).toEqual(expected);
  });

  it("should throw an error for negative number", () => {
    const partitionWithNegativeNumber = () => partitions(-42);
    
    expect(partitionWithNegativeNumber).toThrowError(Error);
  });

  it("should throw an error for decimal number", () => {
    const partitionWithDecimalNumber = () => partitions(4.2);

    expect(partitionWithDecimalNumber).toThrowError();
  });
});

describe("cardvecCombinations", () => {
  it("should return combinations for given cardinality vector", () => {
    result = cardvecCombinations([1, 2, 3], [1, 2]);
    expected = [ [[1], [[2, 3]]], [[2], [[1, 3]]], [[3], [[1, 2]]], ];
    
    expect(result).toStrictEqual(expected);
  });

  it("should throw error ", () => {
    function cardvecSumDifferentFromPointsLength() {
      return cardvecCombinations([1, 2, 3], [1, 1]);
    }

    expect(cardvecSumDifferentFromPointsLength).toThrow();
  });
});
