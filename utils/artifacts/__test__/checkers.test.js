import { fulfill, hasTrue, isCondition, isExtensionOf } from "../checkers";

let result, expectation;

describe("isCondition", () => {
  it("must throw TypeError on false condition", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => {};
    const candidate = {};
    const error_msg = "Wrong!";
    const errorClass = TypeError;

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, candidate, error_msg, errorClass);

    expect(isConditionFn).toThrow(TypeError);
  });

  it("must throw Error on missing errorClass", () => {
    const condition = 42 === "42"; // false
    const conditionCallback = (arg) => arg;
    const candidate = 7;
    const error_msg = "Wrong!";

    const isConditionFn = () =>
      isCondition(condition, conditionCallback, candidate, error_msg);

    expect(isConditionFn).toThrow(Error);
  });

  it("must return on true condition", () => {
    const condition = 42 === 42; // true
    const conditionCallback = (arg) => arg;
    const candidate = 7;
    const error_msg = "Wrong!";
    const errorClass = Error;

    result = isCondition(
      condition,
      conditionCallback,
      candidate,
      error_msg,
      errorClass
    );
    expectation = candidate;
    
    expect(result).toBe(expectation);
  });
  it("must return argument on true condition", () => {
    const condition = 42 === 42; // true
    const candidate = 7;
    const errorMsg = "It does not fulfill!";
    const errorClass = Error;

    result = fulfill(candidate, condition, errorMsg, errorClass);
    expectation = candidate;

    expect(result).toBe(expectation);
  });
  it("must throw Error on false condition", () => {
    const condition = 42 !== 42; // false
    const candidate = 7;
    const errorMsg = "It does not fulfill!";
    const errorClass = TypeError;

    const fulfillWithErrorClassFn = () =>
      fulfill(candidate, condition, errorMsg, errorClass);
    const fulfillWithoutErrorClassFn = () => fulfill(candidate, condition, errorMsg);

    expect(fulfillWithErrorClassFn).toThrow(TypeError);
    expect(fulfillWithoutErrorClassFn).toThrow(Error);
  });
});

describe("boolean maps", () => {
  it("must assert true-element on array", () => {
    result = hasTrue(true);
    expectation = true;
    
    expect(result).toBe(expectation);

    result = hasTrue(false);
    expectation = false;
    
    expect(result).toBe(expectation);

    result = hasTrue([true, false]);
    expectation = true;
    
    expect(result).toBe(expectation);

    result = hasTrue([false, false]);
    expectation = false;
    
    expect(result).toBe(expectation);
  });
});

describe("isExtensionOf", () => {
  it("must assert TypeError as Error extension", () => {
    result = isExtensionOf(TypeError, Error);
    expectation = true;

    expect(result).toBe(expectation);
  });
});
