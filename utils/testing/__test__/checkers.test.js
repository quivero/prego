import { assert, batchAssert } from "../assertions";
import { buildScene } from "../build";
import {
  areAssertItems, areOrganizations, areScenes, isAssertArtifact, isAssertItem,
} from "../checkers";
import { expectToBe, expectToBeEqual } from "../expectTo";
import {
  assertFixtures,
  validAssertLength2Item,
  validAssertLength3Item,
  invalidAssertItemLength,
  invalidAssertCallbackItem,
  validOrganizations,
  invalidOrganizations,
} from "./fixtures";

let assertItem, assertItems;

describe("checkers", () => {
  it("must assert checker areAssertItems", () => {
    assertItem = [ areAssertItems(assertFixtures), expectToBeEqual, true ];
    assert(assertItem);
  });
  it("must batchAssert checker isAssertArtifact", () => {
    assertItems = [
      [ isAssertArtifact(assertFixtures), expectToBeEqual, true ],
      [ isAssertArtifact(invalidAssertItemLength), expectToBeEqual, false ],
    ];

    batchAssert(assertItems);
  });
  it("must batchAssert checker isAssertItem", () => {
    assertItems = [
      [ isAssertItem(validAssertLength2Item), expectToBeEqual, true ],
      [ isAssertItem(validAssertLength3Item), expectToBeEqual, true ],
      [ isAssertItem(invalidAssertItemLength), expectToBeEqual, false ],
      [ isAssertItem(invalidAssertCallbackItem), expectToBeEqual, false ],
    ];

    batchAssert(assertItems);
  });
  it("must return true on valid organization array", () => {
    assertItem = [areOrganizations(validOrganizations), expectToBeEqual, true];
    assert(assertItem);
  });
  it("must return false on invalid assert items", () => {
    assertItem = [areOrganizations(invalidOrganizations), expectToBeEqual, false];
    assert(assertItem);
  });
  it("must return true for valid assert artifact", () => {
    assertItems = [
      [ isAssertArtifact(validAssertLength2Item), expectToBe, true ],
      [ isAssertArtifact(validAssertLength3Item), expectToBe, true ],
//      [ isAssertArtifact(buildScene(validAssertLength2Item)), expectToBe, true ],
//      [ isAssertArtifact(buildScene(validAssertLength3Item)), expectToBe, true ],
//      [ isAssertArtifact(invalidAssertItemLength),   expectToBe, false ],
//      [ isAssertArtifact(invalidAssertCallbackItem), expectToBe, false ],
//      [ isAssertArtifact(assertFixtures), expectToBe, true ],
    ];

    batchAssert(assertItems);
  });
  it("must return true for valid assert item", () => {
    assertItems = [
      [ areAssertItems(assertFixtures), expectToBe, true ],
      [ areScenes(assertFixtures), expectToBe, false ]
    ];

    batchAssert(assertItems);
  });
});
