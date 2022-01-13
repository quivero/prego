import {getAllIndexes, cyclicSort} from '../arrays.js';

console.error = jest.fn();

beforeEach(() => {
  console.error.mockClear();
});

it('component logs two errors when no props are passed', () => {
    const wrapper = cyclicSort('ABCD', 5);
    expect(console.error).toHaveBeenCalledTimes(1);
});


describe('Array', () => {
    it('Get all indexes of given value within array', () => {
        expect(getAllIndexes([1, 2, 3, 3], 1)).toStrictEqual([0]);
        expect(getAllIndexes([1, 2, 3, 3], 2)).toStrictEqual([1]);
        expect(getAllIndexes([1, 2, 3, 3], 3)).toStrictEqual([2, 3]);
    });

    it('Reorder elements from chain in a cyclic form', () => {
        expect(cyclicSort('ABCD', 2)).toStrictEqual('CDAB');
    });
});
