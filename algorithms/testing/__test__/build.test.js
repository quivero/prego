import { assert, batchAssert } from "../assertions";
import { buildScene } from "../build";
import { areAssertItems } from "../checkers";
import { expectToBeEqual } from "../expectTo";
import { assertFixtures } from "./fixtures";

describe("checkers", () => {
  it("must assert on default truth message", () => {
    const assertItem = [areAssertItems(assertFixtures), expectToBeEqual, true];
    assert(assertItem);
  });
  it("must assert scenes a.k.a. assertItem", () => {
    const assertItem2 = assertFixtures[0];
    const assertItem3 = assertFixtures[1];

    const scene2 = buildScene(assertItem2);
    const scene3 = buildScene(assertItem3);

    batchAssert([scene2, scene3]);
  });

});
