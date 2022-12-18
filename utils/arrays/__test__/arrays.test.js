import _ from "lodash";
import {
  ones,
  zip,
  getAllIndexes,
  countDict,
  randMinMax,
  nRandMinMax,
  nRandMinsMaxs,
  cyclicSort,
  isCyclicEqual,
  getUniques,
  euler,
  spreadEuler,
  removeElements,
  hasElement,
  sort,
  mSetsOfnTuples,
  hyperIndexes,
  upperTriangularIndexesFn,
  fullPolytopeIndexesFn,
  fullPolytopeHyperindexes,
  upperTriangularHyperindexes,
  sequentialArrayBlobs,
  cartesianProduct,
} from "../arrays";

import { throwError } from "../../sys/sys.js";

const { format } = require("winston");

jest.mock("../../sys/sys");

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Array", () => {
  it("should get an array of ones", () => {
    expect(ones(5)).toStrictEqual([1, 1, 1, 1, 1]);
  });

  it("should get a random number between 0 and 1", () => {
    const num = randMinMax(0, 1);

    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThanOrEqual(1);
  });

  it("should get a [2, 1] random array between 0 and 1", () => {
    const num = nRandMinMax(2, 0, 1);

    expect(num[0]).toBeGreaterThanOrEqual(0);
    expect(num[0]).toBeLessThanOrEqual(1);

    expect(num[1]).toBeGreaterThanOrEqual(0);
    expect(num[1]).toBeLessThanOrEqual(1);
  });

  it("should get a [2, 1] random array with first entry between 0 and 1 and second entry between 1 and 2", () => {
    const num = nRandMinsMaxs([
      [0, 1],
      [1, 2],
    ]);

    expect(num[0]).toBeGreaterThanOrEqual(0);
    expect(num[0]).toBeLessThanOrEqual(1);

    expect(num[1]).toBeGreaterThanOrEqual(1);
    expect(num[1]).toBeLessThanOrEqual(2);
  });

  it("should call throwError for one entry in min_max", () => {
    nRandMinsMaxs([[1]]);

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for non-numerical entries", () => {
    nRandMinsMaxs([["0", "42"]]);

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for min_max in decrescent order", () => {
    nRandMinsMaxs([[1, 0]]);

    expect(throwError).toHaveBeenCalled();
  });

  it("should receive a zipped array with two arrays entries", () => {
    expect(zip([1, 2, 3], ["a", "b", "c"])).toStrictEqual([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
  });

  it("should get all indexes of given value within array", () => {
    expect(getAllIndexes([1, 2, 3, 3], 1)).toStrictEqual([0]);
    expect(getAllIndexes([1, 2, 3, 3], 2)).toStrictEqual([1]);
    expect(getAllIndexes([1, 2, 3, 3], 3)).toStrictEqual([2, 3]);
  });

  it("should return true for control_ array  equal to treatment_", () => {
    expect(isCyclicEqual("ABCD", "DABC")).toStrictEqual(true);
  });

  it("should return true control_ array is not equal to treatment_", () => {
    expect(isCyclicEqual("ABCD", "ABDC")).toStrictEqual(false);
  });

  it("should return true control_ array has not the same length as treatment_", () => {
    expect(isCyclicEqual("ABCD", "ABC")).toStrictEqual(false);
  });

  it("should reorder elements from chain in a cyclic form", () => {
    expect(cyclicSort("ABCD", 2)).toStrictEqual("CDAB");
  });

  it("should call throwError for array length greater than given index", () => {
    cyclicSort([1, 2, 3], 4);

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for inexistent input arguments ", () => {
    sort([3, 1, 2], 2);

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for invalid blob scenario ", () => {
    const mSetsOfnTuples_gen = mSetsOfnTuples(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      5,
      3
    );

    mSetsOfnTuples_gen.next();

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for empty sets", () => {
    const euler_gen = euler({});

    euler_gen.next();

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for sets with duplicated elements", () => {
    const euler_gen = euler({ a: [1, 1] });

    euler_gen.next();

    expect(throwError).toHaveBeenCalled();
  });

  it("should call throwError for invalid input arguments ", () => {
    const hyperIndexes_gen = hyperIndexes(1, -1, () => "test");
    hyperIndexes_gen.next();

    expect(throwError).toHaveBeenCalled();
  });

  it("should return an descending ordered array", () => {
    expect(sort([1, 2, 3, 4, 5])).toEqual([5, 4, 3, 2, 1]);
  });

  it("should return an ascending ordered array", () => {
    expect(sort([5, 4, 3, 2, 1], 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it("should return remove elements from array", () => {
    expect(_.isEqual(removeElements([1, 2, 3, 4], [1, 2]), [3, 4])).toEqual(
      true
    );
  });

  it("should return sequential blobs of numbers in number array", () => {
    expect(sequentialArrayBlobs([1])).toEqual({
      0: [1],
    });

    expect(sequentialArrayBlobs([1, 2, 4, 5])).toEqual({
      0: [1, 2],
      1: [4, 5],
    });

    expect(sequentialArrayBlobs([1, 2, 4, 5, 7, 8])).toEqual({
      0: [1, 2],
      1: [4, 5],
      2: [7, 8],
    });

    expect(sequentialArrayBlobs([1, 2, 4, 5, 5, 7, 8])).toEqual({
      0: [1, 2],
      1: [4, 5, 5],
      2: [7, 8],
    });
  });

  it("should return count dict", () => {
    expect(countDict([1, 1, 2, 2, 2, 3, 4, 4])).toEqual({
      1: 2,
      2: 3,
      3: 1,
      4: 2,
    });
  });

  it("should return the unique array elements", () => {
    expect(getUniques("ABCDA")).toEqual(["A", "B", "C", "D"]);
  });

  it("should return full polytope hyper-indexes", () => {
    expect([...hyperIndexes(2, 2, fullPolytopeIndexesFn)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);

    expect([...fullPolytopeHyperindexes(2, 2)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it("should return upper triangular polytope hyper-indexes", () => {
    expect([...hyperIndexes(2, 2, upperTriangularIndexesFn)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);

    expect([...upperTriangularHyperindexes(2, 2)]).toEqual([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
  });
});

describe("hasElement", () => {
  it("should return true for element on array", () => {
    expect(hasElement([1, 2, 3], 3)).toStrictEqual(true);
  });

  it("should return true for array on array of elements", () => {
    expect(
      hasElement(
        [
          [1, 2],
          [1, 2, 3],
        ],
        [1, 2]
      )
    ).toStrictEqual(true);
  });

  it("should return true for array on array of elements", () => {
    expect(
      hasElement(
        [
          [1, 2],
          [1, 2, 3],
        ],
        [1]
      )
    ).toStrictEqual(false);
  });
});

describe("Extended euler diagram", () => {
  it("should validate information from Extended Venn Diagram", () => {
    const list_1 = [1, 2, 3, 4, 5];
    const list_2 = [4, 5, 6, 7];

    expect(spreadEuler([list_1, list_2])).toEqual({
      "0,1": [4, 5],
      0: [1, 2, 3],
      1: [6, 7],
    });
  });

  it("should validate information from Extended Venn Diagram", () => {
    const list_1 = [1, 2];
    const list_2 = [3, 4];

    const result = {
      0: [1, 2],
      1: [3, 4],
    };

    expect(spreadEuler([list_1, list_2])).toEqual({
      0: [1, 2],
      1: [3, 4],
    });
  });

  it("should return m n-tuples of the array given", () => {
    expect([...mSetsOfnTuples([1, 2, 3, 4], 2, 2)]).toEqual([
      [
        [1, 2],
        [3, 4],
      ],
      [
        [1, 3],
        [2, 4],
      ],
      [
        [1, 4],
        [2, 3],
      ],
      [
        [2, 3],
        [1, 4],
      ],
      [
        [2, 4],
        [1, 3],
      ],
      [
        [3, 4],
        [1, 2],
      ],
    ]);
  });

  it("should return a multiple set interactions", () => {
    const list_1 = [1, 2, 3];
    const list_2 = [2, 4, 5];
    const list_3 = [2, 6, 7];

    const result = {
      0: [1, 3],
      1: [4, 5],
      2: [6, 7],
      "0,1,2": [2],
    };

    expect(spreadEuler([list_1, list_2, list_3])).toEqual(result);
  });
});
