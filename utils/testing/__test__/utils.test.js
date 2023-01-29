import { assert } from '../assertions';
import { expectAssertions, expectToBe, expectToStrictEqual } from '../expectTo';
import {
  isTrue, isFalse, areTrue, 
  whosWhat, whosTrue, whosFalse, 
  areArrayElements, allIndexes
} from '../utils' 

describe(
    "utils", 
    () => {
      it(
        "should return true on callback isTrue with argument true", 
        () => {
          expectAssertions(1);
          assert([isTrue(true), expectToBe, true]);
        }
      );
      it(
        "should return false on callback isTrue with argument false", 
        () => {
          expectAssertions(1);
          assert([isTrue(false), expectToBe, false]);
        }
      );
      it(
        "should return true on callback isFalse with argument false",
        () => {
          expectAssertions(1);
          assert([isFalse(false), expectToBe, true]);
        }
      );
      it(
        "should return true on callback areTrue with argument [true, true]", 
        () => {
          expectAssertions(1);
          assert([areTrue([true, true]), expectToBe, true]);
        }
      );
      it(
        "should return false on callback areTrue with argument [true, false]", 
        () => {
          expectAssertions(1);
          assert([areTrue([true, false]), expectToBe, false]);
        }
      );
      it(
        "should return indexes on callback allIndexes with argument [1,2,2,3], 2", 
        () => {
          expectAssertions(1);
          assert([allIndexes([1,2,2,3], 2), expectToStrictEqual, [1, 2]]);
        }
      );
      it(
        "should return indexes on callback whosTrue with argument [true, false, true]", 
        () => {
          expectAssertions(1);
          assert([whosTrue([true, false, true]), expectToStrictEqual, [0, 2]]);
        }
      );
      it(
        "should return indexes on callback whosFalse with argument [true, false, true]", 
        () => {
          expectAssertions(1);
          assert([whosFalse([true, false, true]), expectToStrictEqual, [1]]);
        }
      ); 
      it(
        "should return indexes on callback whosWhat with argument [true, false, true], isTrue", 
        () => {
          expectAssertions(1);
          assert([whosWhat([true, false, true], isTrue), expectToStrictEqual, [0, 2]]);
        }
      );
      it(
        "should return indexes on callback whosWhat with argument [true, false, true], isFalse", 
        () => {
          expectAssertions(1);
          assert([whosWhat([true, false, true], isFalse), expectToStrictEqual, [1]]);
        }
      );
      it(
        "should return true on callback areArrayElements with argument [true, true], isTrue", 
        () => {
          expectAssertions(1);
          assert([
            areArrayElements([true, true], isTrue), expectToBe, true
          ]);
        }
      );
      it(
        "should return false on callback areArrayElements with argument [true, true], isTrue", 
        () => {
          expectAssertions(1);
          assert([
            areArrayElements([true, false], isTrue), expectToBe, false
          ]);
        }
      );
      it(
        "should return true on callback areArrayElements with argument [false, false], isFalse", 
        () => {
          expectAssertions(1);
          assert([
            areArrayElements([false, false], isFalse), expectToBe, true
          ]);
        }
      );
      it(
        "should return false on callback areArrayElements with argument [true, false], isFalse", 
        () => {
          expectAssertions(1);
          assert([
            areArrayElements([true, false], isFalse), expectToBe, false
          ]);
        }
      );
    }
  );
