import { stringify } from "ts-jest";
import { assert } from "../assertions";
import { expectAssertions, expectToBe, expectToEqual, expectToStrictEqual, expectToThrow } from "../expectTo";
import {
  whosWhat,
  whosTrue,
  whosFalse,
  areArrayElements,
  allIndexes,
  isCondition,
  fulfill,
  delimitify,
  slugify,
  orify,
  andify,
  isTrue,
  isFalse,
  areTrue,
  batchAnd,
  batchOr,
  isArtifact,
  stringifier,
  applyArtifact,

} from "../utils";

let assertItem, result, expectation;

describe("whos", () => {
  it("must return indexes on callback whosTrue with argument [true, false, true]", () => {
    expectAssertions(1);

    assertItem = [whosTrue([true, false, true]), expectToStrictEqual, [0, 2]];
    assert(assertItem);
  });
  it("must return indexes on callback whosFalse with argument [true, false, true]", () => {
    expectAssertions(1);

    assertItem = [whosFalse([true, false, true]), expectToStrictEqual, [1]];
    assert(assertItem);
  });
  it("must return indexes on callback whosWhat with argument [true, false, true], isTrue", () => {
    expectAssertions(1);

    assertItem = [ whosWhat([true, false, true], isTrue), expectToStrictEqual, [0, 2],
    ];
    assert(assertItem);
  });
  it("must return indexes on callback whosWhat with argument [true, false, true], isFalse", () => {
    expectAssertions(1);

    assertItem = [ whosWhat([true, false, true], isFalse),  expectToStrictEqual, [1], ];
    assert(assertItem);
  });
});

describe("{is, are}{True, False}", () => {
  it("must return true on callback isTrue with argument true", () => {
    expectAssertions(1);
    assertItem = [isTrue(true), expectToBe, true];

    assert(assertItem);
  });
  it("must return false on callback isTrue with argument false", () => {
    expectAssertions(1);

    assertItem = [isTrue(false), expectToBe, false];
    assert(assertItem);
  });
  it("must return true on callback isFalse with argument false", () => {
    expectAssertions(1);

    assertItem = [isFalse(false), expectToBe, true];
    assert(assertItem);
  });
  it("must return true on callback areTrue with argument [true, true]", () => {
    expectAssertions(1);

    assertItem = [areTrue([true, true]), expectToBe, true];
    assert(assertItem);
  });
  it("must return false on callback areTrue with argument [true, false]", () => {
    expectAssertions(1);

    assertItem = [areTrue([true, false]), expectToBe, false];
    assert(assertItem);
  });
});

describe("utils", () => {
  it("must return indexes on callback allIndexes with argument [1,2,2,3], 2", () => {
    expectAssertions(1);

    assertItem = [allIndexes([1, 2, 2, 3], 2), expectToStrictEqual, [1, 2]];
    assert(assertItem);
  });
  it("must return true on callback areArrayElements with argument [true, true], isTrue", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, true], isTrue), expectToBe, true];
    assert(assertItem);
  });
  it("must return false on callback areArrayElements with argument [true, true], isTrue", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, false], isTrue), expectToBe, false];
    assert(assertItem);
  });
  it("must return true on callback areArrayElements with argument [false, false], isFalse", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([false, false], isFalse), expectToBe, true];
    assert(assertItem);
  });
  it("must return false on callback areArrayElements with argument [true, false], isFalse", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, false], isFalse), expectToBe, false];
    assert(assertItem);
  });
});

describe("isCondition", () => {
  it("must throw TypeError on false condition", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => {};
    const args = {};
    const error_msg = "Wrong!";
    const errorClass = TypeError;

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, args, error_msg, errorClass);

    expectToThrow(isConditionFn, TypeError);
  });

  it("must throw Error on missing errorClass", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => arg;
    const args = 7;
    const error_msg = "Wrong!";

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, args, error_msg);

    expectToThrow(isConditionFn, Error);
  });

  it("must return on true condition", () => {
    const condition = 42 === 42; // true
    const conditionCallback = (arg) => arg;
    const args = 7;
    const error_msg = "Wrong!";
    const errorClass = Error;

    const result = isCondition(
      condition,
      conditionCallback,
      args,
      error_msg,
      errorClass
    );

    expect(result).toBe(args);
  });
  it("must return argument on true condition", () => {
    const condition = 42 === 42; // true
    const args = 7;
    const errorMsg = "It does not fulfill!";
    const errorClass = Error;

    const result = fulfill(args, condition, errorMsg, errorClass);

    expect(result).toBe(args);
  });
  it("must throw Error on false condition", () => {
    const condition = 42 !== 42; // false
    const args = 7;
    const errorMsg = "It does not fulfill!";
    const errorClass = TypeError;

    const fulfillWithErrorClassFn = () => fulfill(args, condition, errorMsg, errorClass);
    const fulfillWithoutErrorClassFn = () => fulfill(args, condition, errorMsg);

    expectToThrow(fulfillWithErrorClassFn, TypeError);
    expectToThrow(fulfillWithoutErrorClassFn, Error);
  });
});

const numberList = [1,2,3];

describe(
  "delimitify",
  () => {
    it(
      "must return string delimited by hyphen -",
      () => {
        const result = delimitify(numberList, '+');

        expect(result).toBe('1+2+3')
      }
    );
    it(
      "must return string delimited by underscore _",
      () => {
        const result = slugify(numberList);

        expect(result).toBe('1_2_3')
      }
    );
    it(
      "must return string delimited by pipe |",
      () => {
        const result = orify(numberList);

        expectToBe(result, '1|2|3')
      }
    );
    it(
      "must return string delimited by and &",
      () => {
        const result = andify(numberList);

        expectToBe(result, '1&2&3');
      }
    );
    it(
      'should return equal stringified element',
      () => {
        result = stringifier(1);

        expectToEqual(result, '1');
      }
    );
    it(
      'should return equal stringified array elements',
      () => {
        result = stringifier(numberList);

        expectToEqual(result, ['1', '2', '3']);
      }
    );
  }
);

describe(
  "Miscelaneous",
  () => {
    it(
      'assert function handler array includes function',
      () => {
        const func_1 = (x) => x;
        const func_2 = () => 42;

        const funcs = [func_1, func_2];

        expectToEqual(funcs.includes(func_1), true);
      }
    );
    it(
      'assert batch operators \"and\" and \"or\"',
      () => {
        result = batchAnd([true, true]);
        expectToEqual(result, true);

        result = batchAnd([true, false]);
        expectToEqual(result, false);

        result = batchOr([false, false]);
        expectToEqual(result, false);

        result = batchOr([true, false]);
        expectToEqual(result, true);
      }
    );
    it(
      'should return true for list of artifacts',
      () => {
        result = isArtifact( numberList, (x) => typeof x === 'number' );

        expectToEqual(result, true);
      }
    );
    it(
      'should return false for non-fulfilling condition',
      () => {
        result = isArtifact( '42', (x) => typeof x === 'number' );

        expectToEqual(result, false);

        result = isArtifact( ['42', 42], (x) => typeof x === 'number' );

        expectToEqual(result, false);
      }
    );
    it(
      'should return transformed artifact on consistent artifact',
      () => {
        result = applyArtifact([1,2,3,4], (x) => typeof x === 'number', (x) => 2*x);
        expectation = [2,4,6,8];

        expectToEqual(result, expectation);

        result = applyArtifact(1, (x) => typeof x === 'number', (x) => 2*x);
        expectation = 2;

        expectToEqual(result, expectation);
      }
    );
    it(
      'should return throw on inconsistent artifact',
      () => {
        result = () => applyArtifact([1,2,3,'4'], (x) => typeof x === 'number', (x) => 2*x);
        expectation = TypeError;

        expectToThrow(result, expectation);
      }
    );
  }
);
