import {
  assert,
  batchAssert,
  atest,
  batchAtest
} from "../assertions";

import { hasAssertions, expectAssertions } from "../expectTo";

import {
  assertFixtures,
  validAssertLength2Item,
  validAssertLength3Item,
  invalidAssertItemLength,
  invalidAssertCallbackItem,
  validAtestFixture,
  validAtestAct,
  additionFixtures,
  additionScenes,
} from "./fixtures";

describe("assert", () => {
  it("should assert on result-callback pattern", () => {
    hasAssertions();
    expectAssertions(1);
    assert(validAssertLength2Item);
  });

  it("should assert on result-expected-callback pattern", () => {
    hasAssertions();
    expectAssertions(1);

    assert(validAssertLength3Item);
  });

  it("should throw error on item with length different than 2 or 3", () =>
    expect(() => assert(invalidAssertItemLength)).toThrow(Error));

  it("should throw error on invalid callback function", () =>
    expect(() => assert(invalidAssertCallbackItem)).toThrow(Error));
});

describe("batchAssert", () => {
  it("should assert asserts in batch", () => {
    hasAssertions();
    expectAssertions(assertFixtures.length);

    batchAssert(assertFixtures);
  });
});
