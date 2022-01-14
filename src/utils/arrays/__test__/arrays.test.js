import {getAllIndexes, 
        cyclicSort,
        isCyclicEqual,
        uniqueIndices,
        getUniques} from '../arrays.js';

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
        const wrapper = cyclicSort('ABCD', 5);
        expect(console.error).toHaveBeenCalledTimes(1);
    });
});
