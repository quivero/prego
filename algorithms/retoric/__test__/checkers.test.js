import * as aqo from "arqeo";
import { are } from "../../testing/utils";

import {
  isConjunction,
  isConjunctionArtifact,
  isDefined,
  isInjunction,
  isInjunctionArtifact,
  isPremise,
  isPremiseArtifact,
  isReasoningArtifact,
} from "../checkers";
import {
  conjunctions,
  injunctions,
  premiseArtifacts,
  premises,
} from "./fixtures";

let result, expectation;

describe("dialetic-checkers", () => {
  it("must check true for premises", () => {
    expect(aqo.is(premises, isPremise)).toEqual(true);
    expect(aqo.are(premiseArtifacts, isPremise)).toEqual(true);
  });
  it("must check true for injunctions", () => {
    expect(are(injunctions, isInjunction)).toEqual(true);
  });
  it("must check true for conjunctions", () => {
    expect(are(conjunctions, isConjunction)).toEqual(true);
  });
  it("must assert is{Premise|Conjunction|Injunction}Artifact", () => {
    expect(isReasoningArtifact(premises)).toEqual(true);

    expect(isPremiseArtifact(premises)).toEqual(true);
    expect(isInjunctionArtifact(injunctions)).toEqual(true);
    expect(isConjunctionArtifact(conjunctions)).toEqual(true);

    expect(isPremiseArtifact(conjunctions)).toEqual(false);
    expect(isInjunctionArtifact(premises)).toEqual(false);
    expect(isConjunctionArtifact(injunctions)).toEqual(false);
  });
  it("must assert defined variables", () => {
    result = isDefined(42);
    expectation = true;

    expect(result).toEqual(expectation);

    result = isDefined(undefined);
    expectation = false;

    expect(result).toEqual(expectation);
  });
});
