import { isReasoningArtifact } from "../checkers";
import {
  applyReasoningArtifact,
  getPremiseKeys,
  getPremisesEntries
} from "../utils";
import {
  expectedPremisesEntries,
  expectedPremisesKeys,
  premises,
  expectedPremisesConclusions
} from "./fixtures";

const concludeCallback = (premise) => premise.conclude();

let result, expectation;

describe("dialetic-utils", () => {
  it(
    "must assert reasoning artifact",
    () => {
      expect(isReasoningArtifact(premises)).toEqual(true);
    }
  );
  it(
    "must assert getPremisesEntries",
    () => {
      result = getPremisesEntries( premises );
      expectation = expectedPremisesEntries;

      expect(result).toEqual(expectation);
    }
  );
  it(
    "must assert getPremisesKeys",
    () => {
      result = getPremiseKeys( premises );
      expectation = expectedPremisesKeys;

      expect(result).toEqual(expectation);
    }
  );
  it(
    "must assert applyReasoningArtifact",
    () => {
      result = applyReasoningArtifact(premises, concludeCallback);
      expectation = expectedPremisesConclusions;

      expect(result).toEqual(expectation);
    }
  );
  it(
    "must throw on non-fulfillinf condition for applyReasoningArtifact",
    () => {
      result = () => applyReasoningArtifact(['ackbar', 42], concludeCallback);
      expectation = TypeError;

      expect(result).toThrow(expectation);
    }
  );
});
