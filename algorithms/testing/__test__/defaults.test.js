import { assert, batchAssert } from "../assertions";
import { isOrganization } from "../checkers";
import { defaultOrganization, defaultArrayTruthMessage } from "../defaults";
import { expectToBe, expectToBeUndefined } from "../expectTo";

describe("utils", () => {
  it("must assert on default truth message", () => {
    const message = "The required criteria are not provided.";
    const assertItem = [defaultArrayTruthMessage, expectToBe, message];

    assert(assertItem);
  });
  it("must assert on default truth message", () => {
    const assertItems = [
      [isOrganization(defaultOrganization), expectToBe, true],
      [defaultOrganization.setup(), expectToBeUndefined],
      [defaultOrganization.prepare(42), expectToBe, 42],
      [defaultOrganization.teardown(42), expectToBeUndefined],
    ];

    batchAssert(assertItems);
  });
});
