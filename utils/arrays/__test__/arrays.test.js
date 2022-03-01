import {
  getAllIndexes,
  cyclicSort,
  isCyclicEqual,
  getUniques,
  extendedVenn,
  arraysEqual
} from '../arrays';

console.error = jest.fn();

beforeEach(() => {
  console.error.mockClear();
});

describe('Array', () => {
  it('Get all indexes of given value within array', () => {
    expect(getAllIndexes([1, 2, 3, 3], 1)).toStrictEqual([0]);
    expect(getAllIndexes([1, 2, 3, 3], 2)).toStrictEqual([1]);
    expect(getAllIndexes([1, 2, 3, 3], 3)).toStrictEqual([2, 3]);
  });

  it('Array control_ is equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'DABC')).toStrictEqual(true);
  });

  it('Array control_ is not equal to treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABDC')).toStrictEqual(false);
  });

  it('Array control_ has not the same length as treatment_', () => {
    expect(isCyclicEqual('ABCD', 'ABC')).toStrictEqual(false);
  });

  it('Reorder elements from chain in a cyclic form', () => {
    expect(cyclicSort('ABCD', 2)).toStrictEqual('CDAB');
  });

  it('Returns the unique array elements', () => {
    expect(getUniques('ABCDA')).toEqual(['A', 'B', 'C', 'D']);
  });

  it('Throws console.error in case the index exceeds array size', () => {
    cyclicSort('ABCD', 5);
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('arraysEqual', () => {
    it('should return true for 2 equal arrays', () => {
      expect(arraysEqual('abc', 'abc')).toStrictEqual(true);
    });
    
    it('should return false for null value', () => {
      expect(arraysEqual(null, 42)).toStrictEqual(false);
      expect(arraysEqual(42, null)).toStrictEqual(false);
    });

    it('should return false for arrays of different lengths', () => {
      expect(arraysEqual([0, 1], [0, 1, 2])).toStrictEqual(false);
    });
});

describe('Extended venn diagram', () => {
  it('Validate information from Extended Venn Diagram', () => {
    const list_1 = [1, 2, 3, 4, 5];
    const list_2 = [4, 5, 6, 7];

    expect(extendedVenn([list_1, list_2])).toEqual({
      '0,1': [4, 5],
      0: [1, 2, 3],
      1: [6, 7],
    });
  });

  it('Validate non-intersection from Extended Venn Diagram', () => {
    const list_1 = [1, 2, 3];
    const list_2 = [4, 5, 6];

    expect(extendedVenn([list_1, list_2])).toEqual({
      0: [1, 2, 3],
      1: [4, 5, 6],
    });
  });

  it('Validate empty exclusivity from Extended Venn Diagram', () => {
    const list_1 = [1, 2, 3, 4, 5, 6];
    const list_2 = [4, 5, 6];

    expect(extendedVenn([list_1, list_2])).toEqual({
      0: [1, 2, 3],
      '0,1': [4, 5, 6],
    });
  });
});
