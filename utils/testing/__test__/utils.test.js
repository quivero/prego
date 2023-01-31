import { assert } from "../assertions";
import { isTrue, isFalse, areTrue } from "../checkers";
import { expectAssertions, expectToBe, expectToStrictEqual } from "../expectTo";
import {
  whosWhat,
  whosTrue,
  whosFalse,
  areArrayElements,
  allIndexes,
  isCondition,
} from "../utils";

let assertItem;

describe("whos", () => {
  it("should return indexes on callback whosTrue with argument [true, false, true]", () => {
    expectAssertions(1);

    assertItem = [whosTrue([true, false, true]), expectToStrictEqual, [0, 2]];
    assert(assertItem);
  });
  it("should return indexes on callback whosFalse with argument [true, false, true]", () => {
    expectAssertions(1);

    assertItem = [whosFalse([true, false, true]), expectToStrictEqual, [1]];
    assert(assertItem);
  });
  it("should return indexes on callback whosWhat with argument [true, false, true], isTrue", () => {
    expectAssertions(1);

    assertItem = [
      whosWhat([true, false, true], isTrue),
      expectToStrictEqual,
      [0, 2],
    ];
    assert(assertItem);
  });
  it("should return indexes on callback whosWhat with argument [true, false, true], isFalse", () => {
    expectAssertions(1);

    expectAssertions(1);

    assertItem = [
      whosWhat([true, false, true], isFalse),
      expectToStrictEqual,
      [1],
    ];
    assert(assertItem);
  });
});

describe("{is, are}{True, False}", () => {
  it("should return true on callback isTrue with argument true", () => {
    expectAssertions(1);
    assertItem = [isTrue(true), expectToBe, true];

    assert(assertItem);
  });
  it("should return false on callback isTrue with argument false", () => {
    expectAssertions(1);

    assertItem = [isTrue(false), expectToBe, false];
    assert(assertItem);
  });
  it("should return true on callback isFalse with argument false", () => {
    expectAssertions(1);

    assertItem = [isFalse(false), expectToBe, true];
    assert(assertItem);
  });
  it("should return true on callback areTrue with argument [true, true]", () => {
    expectAssertions(1);

    assertItem = [areTrue([true, true]), expectToBe, true];
    assert(assertItem);
  });
  it("should return false on callback areTrue with argument [true, false]", () => {
    expectAssertions(1);

    assertItem = [areTrue([true, false]), expectToBe, false];
    assert(assertItem);
  });
});

describe("utils", () => {
  it("should return indexes on callback allIndexes with argument [1,2,2,3], 2", () => {
    expectAssertions(1);

    assertItem = [allIndexes([1, 2, 2, 3], 2), expectToStrictEqual, [1, 2]];
    assert(assertItem);
  });
  it("should return true on callback areArrayElements with argument [true, true], isTrue", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, true], isTrue), expectToBe, true];
    assert(assertItem);
  });
  it("should return false on callback areArrayElements with argument [true, true], isTrue", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, false], isTrue), expectToBe, false];
    assert(assertItem);
  });
  it("should return true on callback areArrayElements with argument [false, false], isFalse", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([false, false], isFalse), expectToBe, true];
    assert(assertItem);
  });
  it("should return false on callback areArrayElements with argument [true, false], isFalse", () => {
    expectAssertions(1);

    assertItem = [areArrayElements([true, false], isFalse), expectToBe, false];
    assert(assertItem);
  });
});

describe("isCondition", () => {
  it("should throw TypeError on false condition", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => {};
    const args = {};
    const error_msg = "Wrong!";
    const errorClass = TypeError;

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, args, error_msg, errorClass);

    expect(isConditionFn).toThrowError(TypeError);
  });

  it("should throw Error on missing errorClass", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => arg;
    const args = 7;
    const error_msg = "Wrong!";

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, args, error_msg);

    expect(isConditionFn).toThrowError(Error);
  });

  it("should return on true condition", () => {
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
});
