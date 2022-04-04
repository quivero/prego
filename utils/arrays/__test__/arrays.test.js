import _ from 'lodash';
import {
  getAllIndexes,
  cyclicSort,
  isCyclicEqual,
  getUniques,
  spreadEuler,
  spreadVenn,
  removeElements,
  hasElement,
  sort,
  spreadEulerDiagram,
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

  it('should return the unique array elements', () => {
    expect(getUniques('ABCDA')).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should throw console.error in case the index exceeds array size', () => {
    cyclicSort('ABCD', 5);
    expect(console.error).toHaveBeenCalledTimes(1);
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
