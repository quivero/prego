// The expecteTo callbacks below are only a subset of available jest.expect functionalities
// Check https://jestjs.io/docs/expect
// Anyone interested to extend this behavior must refer to URL content above with parsimony

/*-------------------------------------------------*\
 | Matchers                                        |
\*-------------------------------------------------*/
// [ x ] .toHaveBeenCalled()
// [ x ] .toHaveReturned()
// [ x ] .toBeDefined()
// [ x ] .toBeFalsy()
// [ x ] .toBeNull()
// [ x ] .toBeTruthy()
// [ x ] .toBeUndefined()
// [ x ] .toBeNaN()
// [ x ] .toBe(value)
// [ x ] .toHaveBeenCalledTimes(number)
// [ x ] .toHaveReturnedTimes(number)
// [ x ] .toHaveReturnedWith(value)
// [ x ] .toHaveLastReturnedWith(value)
// [ x ] .toHaveLength(number)
// [ x ] .toContain(item)
// [ x ] .toContainEqual(item)
// [ x ] .toEqual(value)
// [ x ] .toBeGreaterThan(number | bigint)
// [ x ] .toBeGreaterThanOrEqual(number | bigint)
// [ x ] .toBeLessThan(number | bigint)
// [ x ] .toBeLessThanOrEqual(number | bigint)
// [ x ] .toBeInstanceOf(Class)
// [ x ] .toMatch(regexp | string)
// [ x ] .toMatchObject(object)
// [ x ] .toThrowErrorMatchingInlineSnapshot(inlineSnapshot)
// [ x ] .toStrictEqual(value)
// [ x ] .toThrow(error?)
// [ x ] .toThrowErrorMatchingSnapshot(hint?)
// [ x ] .toMatchSnapshot(propertyMatchers?, hint?)
// [ x ] .toHaveProperty(keyPath, value?)
// [ x ] .toBeCloseTo(number, numDigits?)
// [ x ] .toMatchInlineSnapshot(propertyMatchers?, inlineSnapshot)
// [ x ] .toHaveBeenCalledWith(arg1, arg2, ...)
// [ x ] .toHaveBeenLastCalledWith(arg1, arg2, ...)
// [ x ] .toHaveBeenNthCalledWith(nthCall, arg1, arg2, ....)

// 0 argument expectation
export const expectToBeDefined = (result) => expect(result).toBeDefined();
export const expectToBeUndefined = (result) => expect(result).toBeUndefined();
export const expectToHaveBeenCalled = (result) =>
  expect(result).toHaveBeenCalled();
export const expectToHaveReturned = (result) => expect(result).toHaveReturned();
export const expectToBeFalsy = (result) => expect(result).toBeFalsy();
export const expectToBeNull = (result) => expect(result).toBeNull();
export const expectToBeTruthy = (result) => expect(result).toBeTruthy();
export const expectToBeNaN = (result) => expect(result).toBeNaN();

// 1 arguments expectation
export const expectToBe = (result, expectation) =>
  expect(result).toBe(expectation);
export const expectToBeEqual = (result, expectation) =>
  expect(result).toEqual(expectation);
export const expectToStrictEqual = (result, expectation) =>
  expect(result).toStrictEqual(expectation);
export const expectToHaveBeenCalledTimes = (result, expectation) =>
  expect(result).toHaveBeenCalledTimes(expectation);
export const expectToHaveReturnedTimes = (result, expectation) =>
  expect(result).toHaveReturnedTimes(expectation);
export const expectToHaveReturnedWith = (result, expectation) =>
  expect(result).toHaveReturnedWith(expectation);
export const expectToHaveLastReturnedWith = (result, expectation) =>
  expect(result).toHaveLastReturnedWith(expectation);
export const expectToHaveLength = (result, expectation) =>
  expect(result).toHaveLength(expectation);
export const expectToContain = (result, expectation) =>
  expect(result).toContain(expectation);
export const expectToContainEqual = (result, expectation) =>
  expect(result).toContainEqual(expectation);
export const expectToEqual = (result, expectation) =>
  expect(result).toEqual(expectation);
export const expectToBeGreaterThan = (result, expectation) =>
  expect(result).toBeGreaterThan(expectation);
export const expectToBeGreaterThanOrEqual = (result, expectation) =>
  expect(result).toBeGreaterThanOrEqual(expectation);
export const expectToBeLessThan = (result, expectation) =>
  expect(result).toBeLessThan(expectation);
export const expectToBeLessThanOrEqual = (result, expectation) =>
  expect(result).toBeLessThanOrEqual(expectation);
export const expectToBeInstanceOf = (result, expectation) =>
  expect(result).toBeInstanceOf(expectation);
export const expectToMatch = (result, string_regex) =>
  expect(result).toMatch(string_regex);
export const expectToMatchObject = (result, expectedObject) =>
  expect(result).toMatchObject(expectedObject);
export const expectToThrow = (result, ...errorType) =>
  expect(result).toThrow(...errorType);
export const expectToThrowErrorMatchingSnapshot = (result, ...hint) =>
  expect(result).toThrowErrorMatchingSnapshot(...hint);
export const expectToMatchSnapshot = (photo, ...propertyMatchers_hint) =>
  expect(photo).toMatchSnapshot(...propertyMatchers_hint);
export const expectToHaveProperty = (object_, keyPath, ...value) =>
  expect(object_).toHaveProperty(keyPath, ...value);
export const expectToBeCloseTo = (value, number, ...numDigits) =>
  expect(value).toBeCloseTo(number, ...numDigits);
export const expectToMatchInlineSnapshot = (
  result,
  inlineSnapshot,
  ...propertyMatchers
) => expect(result).toMatchInlineSnapshot(inlineSnapshot, ...propertyMatchers);
export const expectToHaveBeenCalledWith = (result, ...args) =>
  expect(result).toHaveBeenCalledWith(...args);
export const expectToHaveBeenLastCalledWith = (result, ...args) =>
  expect(result).toHaveBeenLastCalledWith(...args);
export const expectToHaveBeenNthCalledWith = (functionHandler, expectation) => {
  expect(functionHandler).toHaveBeenNthCalledWith(
    expectation.callIndex,
    ...expectation.args
  );
};

export const availableExpectToMaps = [
  expectToBeDefined,
  expectToBeUndefined,
  expectToHaveBeenCalled,
  expectToHaveReturned,
  expectToBeFalsy,
  expectToBeNull,
  expectToBeTruthy,
  expectToBeNaN,
  expectToBe,
  expectToBeEqual,
  expectToStrictEqual,
  expectToHaveBeenCalledTimes,
  expectToHaveReturnedTimes,
  expectToHaveReturnedWith,
  expectToHaveLastReturnedWith,
  expectToHaveLength,
  expectToContain,
  expectToContainEqual,
  expectToEqual,
  expectToBeGreaterThan,
  expectToBeGreaterThanOrEqual,
  expectToBeLessThan,
  expectToBeLessThanOrEqual,
  expectToBeInstanceOf,
  expectToMatch,
  expectToMatchObject,
  expectToThrow,
  expectToThrowErrorMatchingSnapshot,
  expectToMatchSnapshot,
  expectToHaveProperty,
  expectToBeCloseTo,
  expectToMatchInlineSnapshot,
  expectToHaveBeenCalledWith,
  expectToHaveBeenLastCalledWith,
  expectToHaveBeenNthCalledWith,
];

/*-------------------------------------------------*\
 | Asymmetric matchers                             |
\*-------------------------------------------------*/
export const anythingAsyMatch = () => expect.anything();
export const anyAsyMatch = (constructor) => expect.any(constructor);
export const arrayContainingAsyMatch = (array) => expect.arrayContaining(array);
export const notArrayContainingAsyMatch = (array) =>
  expect.not.arrayContaining(array);
export const closeToAsyMatch = (number, ...numDigits) =>
  expect.closeTo(number, ...numDigits);
export const objectContainingAsyMatch = (object) =>
  expect.objectContaining(object);
export const notObjectContainingAsyMatch = (object) =>
  expect.not.objectContaining(object);
export const stringContainingAsyMatch = (string) =>
  expect.stringContaining(string);
export const notStringContainingAsyMatch = (string) =>
  expect.not.stringContaining(string);
export const stringMatchingAsyMatch = (string_regexp) =>
  expect.stringMatching(string_regexp);
export const notStringMatchingAsyMatch = (string_regexp) =>
  expect.not.stringMatching(string_regexp);

/*-------------------------------------------------*\
 | Assertion matchers                              |
\*-------------------------------------------------*/
export const hasAssertions = () => expect.hasAssertions();
export const expectAssertions = (number) => {
  hasAssertions();
  expect.assertions(number);
};
