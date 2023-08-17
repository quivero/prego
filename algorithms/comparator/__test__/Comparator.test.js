import Comparator from '../Comparator';

describe('Comparator', () => {
  it('should compare with default comparator function', () => {
    const comparator = new Comparator();

    expect(comparator.equal(0, 0)).toBeTrue();
    expect(comparator.equal(0, 1)).toBeFalse();
    expect(comparator.equal('a', 'a')).toBeTrue();
    expect(comparator.lessThan(1, 2)).toBeTrue();
    expect(comparator.lessThan(-1, 2)).toBeTrue();
    expect(comparator.lessThan('a', 'b')).toBeTrue();
    expect(comparator.lessThan('a', 'ab')).toBeTrue();
    expect(comparator.lessThan(10, 2)).toBeFalse();
    expect(comparator.lessThanOrEqual(10, 2)).toBeFalse();
    expect(comparator.lessThanOrEqual(1, 1)).toBeTrue();
    expect(comparator.lessThanOrEqual(0, 0)).toBeTrue();
    expect(comparator.greaterThan(0, 0)).toBeFalse();
    expect(comparator.greaterThan(10, 0)).toBeTrue();
    expect(comparator.greaterThanOrEqual(10, 0)).toBeTrue();
    expect(comparator.greaterThanOrEqual(10, 10)).toBeTrue();
    expect(comparator.greaterThanOrEqual(0, 10)).toBeFalse();
  });

  it('should compare with custom comparator function', () => {
    const comparator = new Comparator((a, b) => {
      if (a.length === b.length) {
        return 0;
      }

      return a.length < b.length ? -1 : 1;
    });

    expect(comparator.equal('a', 'b')).toBeTrue();
    expect(comparator.equal('a', '')).toBeFalse();
    expect(comparator.lessThan('b', 'aa')).toBeTrue();
    expect(comparator.greaterThanOrEqual('a', 'aa')).toBeFalse();
    expect(comparator.greaterThanOrEqual('aa', 'a')).toBeTrue();
    expect(comparator.greaterThanOrEqual('a', 'a')).toBeTrue();

    comparator.reverse();

    expect(comparator.equal('a', 'b')).toBeTrue();
    expect(comparator.equal('a', '')).toBeFalse();
    expect(comparator.lessThan('b', 'aa')).toBeFalse();
    expect(comparator.greaterThanOrEqual('a', 'aa')).toBeTrue();
    expect(comparator.greaterThanOrEqual('aa', 'a')).toBeFalse();
    expect(comparator.greaterThanOrEqual('a', 'a')).toBeTrue();
  });
});
