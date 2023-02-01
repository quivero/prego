import { assert, batchAssert } from "../assertions";
import { buildScene } from "../build";
import { areAssertItems } from "../checkers";
import { expectToBeEqual } from "../expectTo";
import { assertFixtures, additionRehearsals } from "./fixtures";

describe("checkers", () => {
  it("should assert on default truth message", () => {
    const assertItem = [areAssertItems(assertFixtures), expectToBeEqual, true];
    assert(assertItem);
  });
  it("should assert scenes a.k.a. assertItem", () => {
    const assertItem2 = assertFixtures[0];
    const assertItem3 = assertFixtures[1];

    const scene2 = buildScene(assertItem2);
    const scene3 = buildScene(assertItem3);

    batchAssert([scene2, scene3]);
  });
  it("should batchAssert on ", () => {
    const assertItem2 = assertFixtures[0];
    const assertItem3 = assertFixtures[1];

    const scene2 = buildScene(assertItem2);
    const scene3 = buildScene(assertItem3);

    batchAssert([scene2, scene3]);
  });
});
