import {
  assert, batchAssert, atest, batchAtest,
  // validate
} from "../assertions";

import {
  hasAssertions, expectAssertions
} from "../expectTo"

import {
  assertFixtures,
  validAssertLength1Item,
  validAssertLength2Item,
  invalidAssertItemLength,
  invalidAssertCallbackItem,
  validAtestFixture,
  validAtestAct,
  additionFixtures,
  additionScenes,
} from "./fixtures";

describe(
  "assert",
  () => {
    it(
      "should assert on result-callback pattern",
      () => {
        hasAssertions()
        expectAssertions(1);
        assert(validAssertLength1Item);
      }
    );

    it(
      "should assert on result-expected-callback pattern",
      () => {
        hasAssertions();
        expectAssertions(1);

        assert(validAssertLength2Item);
      }
    );

    it(
      "should throw error on item with length different than 2 or 3",
      () => expect(() => assert(invalidAssertItemLength)).toThrow(Error));

    it(
      "should throw error on invalid callback function",
      () => expect(() => assert(invalidAssertCallbackItem)).toThrow(Error));
  }
);

describe(
  "batchAssert",
  () => {
    it(
      "should assert asserts in batch",
      () => {
        hasAssertions();
        expectAssertions(assertFixtures.length);

        batchAssert(assertFixtures);
      }
    );
  }
);

describe(
  "atest",
  () => {
    it(
      "should assert atest",
      () => atest(validAtestFixture, validAtestAct));
  }
);

describe(
  "batchAtest",
  () => {
    it(
      "should assert batchAtest",
      () => batchAtest(additionFixtures, additionScenes));
  }
);

/*
 *  Audition test design
 */

// validate(additionAuditions);
