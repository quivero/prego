import { isString } from "lodash";
import { 
  catalogArtifactItems,
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

describe("Artifact", () => {
  it("must assert artifact item", () => {
    const candidate = ["1", "2", "3", "4"];
    
    result = isArtifactItem(candidate, isString)
    expectation = false;

    expect(result).toBe(expectation);

    result = isArtifactItem("1", isString)
    expectation = true;

    expect(result).toBe(expectation);
  });

  it("must assert artifact array", () => {
    const candidate = ["1", "2", "3", "4"];
    
    result = isArtifactArray(candidate, isString)
    expectation = true;

    expect(result).toBe(expectation);

    result = isArtifactArray("1", isString)
    expectation = false;

    expect(result).toBe(expectation);
  });

  it("must check for existence of valid items", () => {
    let candidate = [1, 2, 3, "4"];
    
    result = hasValidArtifactItem(candidate, isString);
    expectation = true;

    expect(result).toBe(expectation);
    
    candidate = [1, 2, 3, 4];
    
    result = hasValidArtifactItem(candidate, isString);
    expectation = false;

    expect(result).toBe(expectation);
  });

  it("must check for existence of valid items", () => {
    let candidate = [1, 2, 3, "4"];
    
    result = hasValidArtifacts(candidate, isString);
    expectation = true;

    expect(result).toBe(expectation);
    
    candidate = [1, 2, 3, 4];
    
    result = hasValidArtifacts(candidate, isString);
    expectation = false;

    expect(result).toBe(expectation);

    candidate = "4";
    
    result = hasValidArtifacts(candidate, isString);
    expectation = true;

    expect(result).toBe(expectation);
    
    candidate = 1;
    
    result = hasValidArtifacts(candidate, isString);
    expectation = false;

    expect(result).toBe(expectation);
  });

  it("must check for existence of valid items", () => {
    let candidate = [1, 2, 3, "4"];
    
    result = catalogArtifactItems(candidate, isString)
    expectation = [false, false, false, true];

    expect(result).toStrictEqual(expectation);
    
    candidate = [1, 2, 3, 4];
    
    result = catalogArtifactItems(candidate, isString)
    expectation = false;

    expect(result).toStrictEqual(expectation);

    candidate = 42;
    
    result = catalogArtifactItems(candidate, isString)
    expectation = false;

    expect(result).toStrictEqual(expectation);

    candidate = "42";
    
    result = catalogArtifactItems(candidate, isString)
    expectation = [ true ];

    expect(result).toStrictEqual(expectation);
  });
});

