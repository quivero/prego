import { assert } from '../assertions';
import {
  expectAssertions,
  expectToBe,
  expectToEqual,
  expectToStrictEqual,
} from '../expectTo';
import {
  areTrue,
  isFalse,
  isTrue,
  whosWhat,
  whosTrue,
  whosFalse,
  areArrayElements,
  allIndexes,
  delimitify,
  slugify,
  orify,
  andify,
  stringifier,
} from '../utils';

import { is } from 'arqeo';

let assertItem, result;

describe('whos', () => {
  it('must return indexes on callback whosTrue with argument [true, false, true]', () => {
    expectAssertions(1);

    assertItem = [whosTrue([true, false, true]), expectToStrictEqual, [0, 2]];
    assert(assertItem);
  });
  it('must return indexes on callback whosFalse with argument [true, false, true]', () => {
    expectAssertions(1);

    assertItem = [whosFalse([true, false, true]), expectToStrictEqual, [1]];
    assert(assertItem);
  });
  it('must return indexes on callback whosWhat with argument [true, false, true], isTrue', () => {
    expectAssertions(1);

    assertItem = [
      whosWhat([true, false, true], isTrue),
      expectToStrictEqual,
      [0, 2],
    ];
    assert(assertItem);
  });
  it('must return indexes on callback whosWhat with argument [true, false, true], isFalse', () => {
    expectAssertions(1);

    assertItem = [
      whosWhat([true, false, true], isFalse),
      expectToStrictEqual,
      [1],
    ];
    assert(assertItem);
  });
});

describe('{is, are}{True, False}', () => {
  it('must return true on callback isTrue with argument true', () => {
    expectAssertions(1);
    assertItem = [isTrue(true), expectToBe, true];

    assert(assertItem);
  });
  it('must return false on callback isTrue with argument false', () => {
    expectAssertions(1);

    assertItem = [isTrue(false), expectToBe, false];
    assert(assertItem);
  });
  it('must return true on callback isFalse with argument false', () => {
    expectAssertions(1);

    assertItem = [isFalse(false), expectToBe, true];
    assert(assertItem);
  });
  it('must return true on callback areTrue with argument [true, true]', () => {
    expectAssertions(1);

    assertItem = [areTrue([true, true]), expectToBe, true];
    assert(assertItem);
  });
  it('must return false on callback areTrue with argument [true, false]', () => {
    expectAssertions(1);

    assertItem = [areTrue([true, false]), expectToBe, false];
    assert(assertItem);
  });
});

describe('utils', () => {
  it('must return indexes on callback allIndexes with argument [1,2,2,3], 2', () => {
    expectAssertions(1);

    assertItem = [allIndexes([1, 2, 2, 3], 2), expectToStrictEqual, [1, 2]];
    assert(assertItem);
  });
  it('must return true on callback areArrayElements with argument [true, true], isTrue', () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, true], isTrue), expectToBe, true];
    assert(assertItem);
  });
  it('must return false on callback areArrayElements with argument [true, true], isTrue', () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, false], isTrue), expectToBe, false];
    assert(assertItem);
  });
  it('must return true on callback areArrayElements with argument [false, false], isFalse', () => {
    expectAssertions(1);

    assertItem = [areArrayElements([false, false], isFalse), expectToBe, true];
    assert(assertItem);
  });
  it('must return false on callback areArrayElements with argument [true, false], isFalse', () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, false], isFalse), expectToBe, false];
    assert(assertItem);
  });
});

const numberList = [1, 2, 3];

describe('delimitify', () => {
  it('must return string delimited by hyphen -', () => {
    const result = delimitify(numberList, '+');

    expect(result).toBe('1+2+3');
  });
  it('must return string delimited by underscore _', () => {
    const result = slugify(numberList);

    expect(result).toBe('1_2_3');
  });
  it('must return string delimited by pipe |', () => {
    const result = orify(numberList);

    expectToBe(result, '1|2|3');
  });
  it('must return string delimited by and &', () => {
    const result = andify(numberList);

    expectToBe(result, '1&2&3');
  });
  it('should return equal stringified element', () => {
    result = stringifier(1);

    expectToEqual(result, '1');
  });
  it('should return equal stringified array elements', () => {
    result = stringifier(numberList);

    expectToEqual(result, ['1', '2', '3']);
  });
});

describe('Miscelaneous', () => {
  it('assert function handler array includes function', () => {
    const func_1 = (x) => x;
    const func_2 = () => 42;

    const funcs = [func_1, func_2];

    expectToEqual(funcs.includes(func_1), true);
  });
  it('should return true for list of artifacts', () => {
    result = is(numberList, (x) => typeof x === 'number');

    expectToEqual(result, true);
  });
});
