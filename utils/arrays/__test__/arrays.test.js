import _ from 'lodash';
import {
  getAllIndexes,
  countDict,
  cyclicSort,
  isCyclicEqual,
  getUniques,
  spreadEuler,
  spreadVenn,
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
} from '../arrays';

console.error = jest.fn();

beforeEach(() => {
  console.error.mockClear();
});

describe('Array', () => {
  it('should get all indexes of given value within array', () => {
    expect(getAllIndexes([1, 2, 3, 3], 1)).toStrictEqual([0]);
    expect(getAllIndexes([1, 2, 3, 3], 2)).toStrictEqual([1]);
    expect(getAllIndexes([1, 2, 3, 3], 3)).toStrictEqual([2, 3]);
  });

  it('should return true for control_ array  equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'DABC')).toStrictEqual(true);
  });

  it('should return true control_ array is not equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABDC')).toStrictEqual(false);
  });

  it('should return true control_ array has not the same length as treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABC')).toStrictEqual(false);
  });

  it('should reorder elements from chain in a cyclic form', () => {
    expect(cyclicSort('ABCD', 2)).toStrictEqual('CDAB');
  });

  it('should return an descending ordered array', () => {
    expect(sort([1, 2, 3, 4, 5])).toEqual([5, 4, 3, 2, 1]);
  });

  it('should return an ascending ordered array', () => {
    expect(sort([5, 4, 3, 2, 1], 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should Error for unexpected type', () => {
    function sortThrowForUnexpectedType() {
      sort([3, 2, 1], 2);
    }

    expect(sortThrowForUnexpectedType).toThrow();
  });

  it('should return remove elements from array', () => {
    expect(_.isEqual(removeElements([1, 2, 3, 4], [1, 2]), [3, 4])).toEqual(true);
  });

  it('should return sequential blobs of numbers in number array', () => {
    expect(sequentialArrayBlobs([1])).toEqual(
      {
        0: [1],
      },
    );

    expect(sequentialArrayBlobs([1, 2, 4, 5])).toEqual(
      {
        0: [1, 2],
        1: [4, 5],
      },
    );

    expect(sequentialArrayBlobs([1, 2, 4, 5, 7, 8])).toEqual(
      {
        0: [1, 2],
        1: [4, 5],
        2: [7, 8],
      },
    );

    expect(sequentialArrayBlobs([1, 2, 4, 5, 5, 7, 8])).toEqual(
      {
        0: [1, 2],
        1: [4, 5, 5],
        2: [7, 8],
      },
    );
  });

  it('should return count dict', () => {
    expect(countDict([1, 1, 2, 2, 2, 3, 4, 4])).toEqual(
      {
        1: 2,
        2: 3,
        3: 1,
        4: 2,
      },
    );
  });

  it('should return the unique array elements', () => {
    expect(getUniques('ABCDA')).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should throw console.error in case the index exceeds array size', () => {
    cyclicSort('ABCD', 5);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should return full polytope hyper-indexes', () => {
    expect([...hyperIndexes(2, 2, fullPolytopeIndexesFn)]).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);

    expect([...fullPolytopeHyperindexes(2, 2)]).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });

  it('should return upper triangular polytope hyper-indexes', () => {
    expect([...hyperIndexes(2, 2, upperTriangularIndexesFn)]).toEqual([
      [0, 0], [0, 1], [1, 1],
    ]);

    expect([...upperTriangularHyperindexes(2, 2)]).toEqual([
      [0, 0], [0, 1], [1, 1],
    ]);
  });

  it('should throw error for negative length and dimension', () => {
    function negativeDimension() {
      return [...hyperIndexes(42, -1, () => [42, 42])];
    }

    function negativeLength() {
      return [...hyperIndexes(42, -1, () => [42, 42])];
    }

    expect(negativeDimension).toThrow();
    expect(negativeLength).toThrow();
  });
});

describe('hasElement', () => {
  it('should return true for element on array', () => {
    expect(hasElement([1, 2, 3], 3)).toStrictEqual(true);
  });

  it('should return true for array on array of elements', () => {
    expect(hasElement([[1, 2], [1, 2, 3]], [1, 2])).toStrictEqual(true);
  });

  it('should return true for array on array of elements', () => {
    expect(hasElement([[1, 2], [1, 2, 3]], [1])).toStrictEqual(false);
  });
});

describe('Extended venn diagram', () => {
  it('should validate information from Extended Venn Diagram', () => {
    const list_1 = [1, 2, 3, 4, 5];
    const list_2 = [4, 5, 6, 7];

    expect(
      spreadVenn([list_1, list_2]),
    ).toEqual({
      '0,1': [4, 5],
      0: [1, 2, 3],
      1: [6, 7],
    });

    expect(
      spreadEuler([list_1, list_2]),
    ).toEqual({
      '0,1': [4, 5],
      0: [1, 2, 3],
      1: [6, 7],
    });
  });

  it('should throw error for empty set provided Euler Diagram', () => {
    function repeatedElementsEuler() {
      return spreadEuler([[1, 1], [1, 2]]);
    }

    expect(repeatedElementsEuler).toThrow();
  });

  it('should return m n-tuples of the array given', () => {
    expect(
      [...mSetsOfnTuples([1, 2, 3, 4], 2, 2)],
    ).toEqual(
      [
        [[1, 2], [3, 4]], [[1, 3], [2, 4]],
        [[1, 4], [2, 3]], [[2, 3], [1, 4]],
        [[2, 4], [1, 3]], [[3, 4], [1, 2]],
      ],
    );
  });

  it('should throw for blob size greater than array', () => {
    function blobSizeGreaterThanArray() {
      return [...mSetsOfnTuples([1, 2, 3], 42, 2)];
    }

    expect(blobSizeGreaterThanArray).toThrow();
  });

  it('should return a multiple set interactions', () => {
    const list_1 = [1, 2, 3];
    const list_2 = [2, 4, 5];
    const list_3 = [2, 6, 7];

    const result = {
      0: [1, 3],
      1: [4, 5],
      2: [6, 7],
      '0,1,2': [2],
    };

    expect(spreadVenn([list_1, list_2, list_3])).toEqual(result);

    expect(
      spreadEuler([list_1, list_2, list_3]),
    ).toEqual(result);
  });

  it('should validate empty exclusivity from Extended Venn Diagram', () => {
    const list_1 = [1, 2, 3, 4, 5, 6];
    const list_2 = [4, 5, 6];

    const result = {
      0: [1, 2, 3],
      '0,1': [4, 5, 6],
    };

    expect(spreadVenn([list_1, list_2])).toEqual(result);
  });

  it('should throw error for empty set provided Euler Diagram', () => {
    function emptySetVenn() {
      return spreadEuler([]);
    }

    expect(emptySetVenn).toThrow();
  });
});
