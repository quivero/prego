// The expecteTo callbacks below are only a subset of available jest.expect functionalities
// Check https://jestjs.io/docs/expect
// Anyone interested to extend this behavior must refer to URL content above with parsimony

// Matchers
// 
// TODO:
// 
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
// [   ] .toThrow(error?)
// [   ] .toThrowErrorMatchingSnapshot(hint?)
// [   ] .toMatchSnapshot(propertyMatchers?, hint?)
// [   ] .toHaveProperty(keyPath, value?)
// [   ] .toBeCloseTo(number, numDigits?)
// [   ] .toMatchInlineSnapshot(propertyMatchers?, inlineSnapshot)
// [   ] .toHaveBeenCalledWith(arg1, arg2, ...)
// [   ] .toHaveBeenLastCalledWith(arg1, arg2, ...)
// [   ] .toHaveBeenNthCalledWith(nthCall, arg1, arg2, ....)

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
export const expectToMatch = (result, expectation) =>
  expect(result).toMatch(expectation);
export const expectToMatchObject = (result, expectation) =>
  expect(result).toMatchObject(expectation);

// {0, 1, 2} arguments expectation
// TODO:
// 
//   - toThrow
//   - toThrowErrorMatchingSnapshot
//   - toMatchSnapshot
//   - toHaveProperty
//   - toBeCloseTo
//   - toMatchInlineSnapshot

// Varyadic arguments expectation
// TODO:
// 
//   - toHaveBeenCalledWith
//   - toHaveBeenLastCalledWith
//   - toHaveBeenNthCalledWith

// Asymmetric Matchers
// TODO: 
// 
// [   ] .anything()
// [   ] .any(constructor)
// [   ] .arrayContaining(array)
// [   ] .not.arrayContaining(array)
// [   ] .closeTo(number, numDigits?)
// [   ] .objectContaining(object)
// [   ] .not.objectContaining(object)
// [   ] .stringContaining(string)
// [   ] .not.stringContaining(string)
// [   ] .stringMatching(string | regexp)
// [   ] .not.stringMatching(string | regexp)

// Assertion Count
// TODO: 
// [ x ] .assertions(number)
// [ x ] .hasAssertions()

export const expectAssertions = (number) => expect.assertions(number);
export const expectHasAssertions = () => expect.hasAssertions()
