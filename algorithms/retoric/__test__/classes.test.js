import { InterfaceError } from '../../errors/errors';
import { applyReasoningArtifact } from '../utils';
import {
  injunctions,
  premises,
  truePremise,
  falsePremise,
  expectedTruePremiseArgument,
  expectedFalsePremiseArgument,
  expectedPremisesArguments,
  expectedPremisesConclusions,
  expectedPremisesVerbalizations,
  expectedInjunctionsConclusions,
  expectedInjConjArguments,
  reason,
  expectedTruePremiseConclusion,
  expectedFalsePremiseConclusion,
  expectedConjunctionsConclusions,
  conjunctions,
  expectedConjunctionsVerbalizations,
  expectedInjunctionsVerbalizations,
  singlePremiseInjunction,
  expectedSinglePremiseInjunctionConclusion,
  expectedSinglePremiseConjunctionConclusion,
  singlePremiseConjunction,
  expectedInjunctionThoughts,
  expectedConjunctionThoughts,
} from './fixtures';

const thinkCallback = (premise) => premise.think();
const argueCallback = (premise) => premise.argue();
const verbalizeCallback = (premise) => premise.verbalize();
const concludeCallback = (premise) => premise.conclude();

describe('dialetic-classes', () => {
  it('must throw on (toPremise, toArgument, toConclusion, toThought) on Reasoning object', () => {
    let throwErrorOnToPremise,
      throwErrorOnToArgument,
      throwErrorOnToConclusion,
      throwErrorOnToThought,
      throwErrorOnVerbalize;

    throwErrorOnToPremise = () => reason.toPremise();
    expect(throwErrorOnToPremise).toThrow(InterfaceError);

    throwErrorOnToArgument = () => reason.toArgument();
    expect(throwErrorOnToArgument).toThrow(InterfaceError);

    throwErrorOnToArgument = () => reason.argue();
    expect(throwErrorOnToArgument).toThrow(InterfaceError);

    throwErrorOnToConclusion = () => reason.toConclusion();
    expect(throwErrorOnToConclusion).toThrow(InterfaceError);

    throwErrorOnToConclusion = () => reason.conclude();
    expect(throwErrorOnToConclusion).toThrow(InterfaceError);

    throwErrorOnToThought = () => reason.toThought();
    expect(throwErrorOnToThought).toThrow(InterfaceError);

    throwErrorOnToThought = () => reason.think();
    expect(throwErrorOnToThought).toThrow(InterfaceError);

    throwErrorOnVerbalize = () => reason.verbalize();
    expect(throwErrorOnVerbalize).toThrow(InterfaceError);
  });
  it('must assert premises argument', () => {
    expect(truePremise.argue()).toEqual(expectedTruePremiseArgument);
    expect(falsePremise.argue()).toEqual(expectedFalsePremiseArgument);

    expect(truePremise.conclude()).toEqual(expectedTruePremiseConclusion);
    expect(falsePremise.conclude()).toEqual(expectedFalsePremiseConclusion);

    expect(truePremise.toPremise()).toBe(truePremise);
    expect(falsePremise.toPremise()).toBe(falsePremise);

    expect(applyReasoningArtifact(premises, argueCallback)).toEqual(
      expectedPremisesArguments
    );
  });
  it('must assert premises conclusion', () => {
    expect(
      applyReasoningArtifact(premises, concludeCallback)
    ).toEqual(expectedPremisesConclusions);
  });
  it('must assert premises verbalization', () => {
    expect(
      applyReasoningArtifact(premises, verbalizeCallback)
    ).toEqual(expectedPremisesVerbalizations);
  });
  it('must assert injunction thoughts', () => {
    expect(
      applyReasoningArtifact(injunctions, thinkCallback)
    ).toEqual(expectedInjunctionThoughts);
  });
  it('must assert injunction arguments', () => {
    expect(
      applyReasoningArtifact(injunctions, argueCallback)
    ).toEqual(expectedInjConjArguments);
  });
  it('must assert injunction conclusion', () => {
    expect(
      applyReasoningArtifact(injunctions, concludeCallback)
    ).toEqual(expectedInjunctionsConclusions);
  });
  it('must assert injunction verbalization', () => {
    expect(
      applyReasoningArtifact(injunctions, verbalizeCallback)
    ).toEqual(expectedInjunctionsVerbalizations);
  });
  it('must assert single injunction conclusion', () => {
    expect(
      applyReasoningArtifact(singlePremiseInjunction, concludeCallback)
    ).toEqual(expectedSinglePremiseInjunctionConclusion);
  });
  it('must assert conjunctions thoughts', () => {
    expect(
      applyReasoningArtifact(conjunctions, thinkCallback)
    ).toEqual(expectedConjunctionThoughts);
  });
  it('must assert conjunction arguments', () => {
    expect(
      applyReasoningArtifact(conjunctions, argueCallback)
    ).toEqual(expectedInjConjArguments);
  });
  it('must assert conjunction conclusion', () => {
    expect(
      applyReasoningArtifact(conjunctions, concludeCallback)
    ).toEqual(expectedConjunctionsConclusions);
  });
  it('must assert single conjunction conclusion', () => {
    expect(
      applyReasoningArtifact(singlePremiseConjunction, concludeCallback)
    ).toEqual(expectedSinglePremiseConjunctionConclusion);
  });
  it('must assert conjunction verbalization', () => {
    expect(applyReasoningArtifact(conjunctions, verbalizeCallback)).toEqual(
      expectedConjunctionsVerbalizations
    );
  });
});
