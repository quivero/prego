import { assert, batchAssert, batchAssertGuard } from "../assertions";
import { hasAssertions, expectAssertions, expectToThrow } from "../expectTo";

import {
  assertFixtures,
  validAssertLength2Item,
  validAssertLength3Item,
  invalidAssertItemLength,
  invalidAssertCallbackItem,
} from "./fixtures";

describe("assert", () => {
  it("must assert on result-callback pattern", () => {
    hasAssertions();
    expectAssertions(1);
    assert(validAssertLength2Item);
  });

  it("must assert on result-expected-callback pattern", () => {
    hasAssertions();
    expectAssertions(1);

    assert(validAssertLength3Item);
  });

  it("must throw error on item with length different than 2 or 3", () =>
    expect(() => assert(invalidAssertItemLength)).toThrow(Error));

  it("must throw error on invalid callback function", () =>
    expect(() => assert(invalidAssertCallbackItem)).toThrow(Error));
});

describe("batchAssert", () => {
  it("must assert asserts in batch", () => {
    hasAssertions();
    expectAssertions(assertFixtures.length);

    batchAssert(assertFixtures);
  });
  it("must throw error on invalid batchAssert", () => {
    const batchThrowError = () => batchAssertGuard(['42', '42']);

    expectToThrow(batchThrowError)
  });
});
