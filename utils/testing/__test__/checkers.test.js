import { assert, batchAssert } from "../assertions";
import { areAssertItems, isAssertArtifact, isAssertItem } from "../checkers";
import { expectToBeEqual } from "../expectTo";
import { 
  assertFixtures, 
  validAssertLength2Item,
  validAssertLength3Item,
  invalidAssertItemLength, 
  invalidAssertCallbackItem
} from "./fixtures";

describe(
    "checkers",
    () => {
      it(
        "should assert on default truth message",
        () => {
            const assertItem = [
                areAssertItems(assertFixtures),
                expectToBeEqual,
                true
            ];
            
            assert(assertItem);
        }
      );
      it(
        "should assert on default truth message",
        () => {
            const assertItem = [
                [
                  isAssertArtifact(assertFixtures), expectToBeEqual, true
                ],
                [
                  isAssertArtifact(invalidAssertItemLength), expectToBeEqual, false
                ] 
            ];
            
            batchAssert(assertItem);
        }
      );
      it(
        "should assert on default truth message",
        () => {
            const assertItem = [
                [ isAssertItem(validAssertLength2Item), expectToBeEqual, true ],
                [ isAssertItem(validAssertLength3Item), expectToBeEqual, true ],
                [ isAssertItem(invalidAssertItemLength), expectToBeEqual, false ],
                [ isAssertItem(invalidAssertCallbackItem), expectToBeEqual, false ],
            ];
            
            batchAssert(assertItem);
        }
      );
    }
);