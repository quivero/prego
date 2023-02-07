import { isString } from "lodash";
import {
  fulfill,
  hasValidArtifactItem,
  hasValidArtifacts,
  isArtifactArray,
  isArtifactItem,
  isCondition
} from "../artifacts";

let result, expectation;

describe("isCondition", () => {
  it("must throw TypeError on false condition", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => {};
    const args = {};
    const error_msg = "Wrong!";
    const errorClass = TypeError;

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, args, error_msg, errorClass);

    expect(isConditionFn).toThrow(TypeError);
  });

  it("must throw Error on missing errorClass", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => arg;
    const args = 7;
    const error_msg = "Wrong!";

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, args, error_msg);

    expect(isConditionFn).toThrow(Error);
  });

  it("must return on true condition", () => {
    const condition = 42 === 42; // true
    const conditionCallback = (arg) => arg;
    const args = 7;
    const error_msg = "Wrong!";
    const errorClass = Error;

    result = isCondition(
      condition,
      conditionCallback,
      args,
      error_msg,
      errorClass
    );
    expectation = args;

    expect(result).toBe(expectation);
  });
  it("must return argument on true condition", () => {
    const condition = 42 === 42; // true
    const args = 7;
    const errorMsg = "It does not fulfill!";
    const errorClass = Error;

    result = fulfill(args, condition, errorMsg, errorClass);
    expectation = args;

    expect(result).toBe(expectation);
  });
  it("must throw Error on false condition", () => {
    const condition = 42 !== 42; // false
    const args = 7;
    const errorMsg = "It does not fulfill!";
    const errorClass = TypeError;

    const fulfillWithErrorClassFn = () =>
      fulfill(args, condition, errorMsg, errorClass);
    const fulfillWithoutErrorClassFn = () => fulfill(args, condition, errorMsg);

    expect(fulfillWithErrorClassFn).toThrow(TypeError);
    expect(fulfillWithoutErrorClassFn).toThrow(Error);
  });
});

describe("Artifact", () => {
  it("must assert artifact item", () => {
    const args = ["1", "2", "3", "4"];

    result = isArtifactItem(args, isString)
    expectation = false;

    expect(result).toBe(expectation);

    result = isArtifactItem("1", isString)
    expectation = true;

    expect(result).toBe(expectation);
  });

  it("must assert artifact array", () => {
    const args = ["1", "2", "3", "4"];

    result = isArtifactArray(args, isString)
    expectation = true;

    expect(result).toBe(expectation);

    result = isArtifactArray("1", isString)
    expectation = false;

    expect(result).toBe(expectation);
  });

  it("must check for existence of valid items", () => {
    let args = [1, 2, 3, "4"];

    result = hasValidArtifactItem(args, isString);
    expectation = true;

    expect(result).toBe(expectation);

    args = [1, 2, 3, 4];

    result = hasValidArtifactItem(args, isString);
    expectation = false;

    expect(result).toBe(expectation);
  });

  it("must check for existence of valid items", () => {
    let args = [1, 2, 3, "4"];

    result = hasValidArtifacts(args, isString);
    expectation = true;

    expect(result).toBe(expectation);

    args = [1, 2, 3, 4];

    result = hasValidArtifacts(args, isString);
    expectation = false;

    expect(result).toBe(expectation);

    args = "4";

    result = hasValidArtifacts(args, isString);
    expectation = true;

    expect(result).toBe(expectation);

    args = 1;

    result = hasValidArtifacts(args, isString);
    expectation = false;

    expect(result).toBe(expectation);
  });
});
