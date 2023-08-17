import * as aqo from 'arqeo';
import { are } from '../../testing/utils';

import {
  isConjunction,
  isConjunctionArtifact,
  isDefined,
  isInjunction,
  isInjunctionArtifact,
  isPremise,
  isPremiseArtifact,
  isReasoningArtifact,
} from '../checkers';
import {
  conjunctions,
  injunctions,
  premiseArtifacts,
  premises,
} from './fixtures';

let result, expectation;

describe('dialetic-checkers', () => {
  it('must check true for premises', () => {
    expect(aqo.is(premises, isPremise)).toBeTrue();
    expect(aqo.are(premiseArtifacts, isPremise)).toBeTrue();
  });

  it('must check true for injunctions', () => {
    expect(are(injunctions, isInjunction)).toBeTrue();
  });

  it('must check true for conjunctions', () => {
    expect(are(conjunctions, isConjunction)).toBeTrue();
  });

  it('must assert is{Premise|Conjunction|Injunction}Artifact', () => {
    expect(isReasoningArtifact(premises)).toBeTrue();

    expect(isPremiseArtifact(premises)).toBeTrue();
    expect(isInjunctionArtifact(injunctions)).toBeTrue();
    expect(isConjunctionArtifact(conjunctions)).toBeTrue();

    expect(isPremiseArtifact(conjunctions)).toBeFalse();
    expect(isInjunctionArtifact(premises)).toBeFalse();
    expect(isConjunctionArtifact(injunctions)).toBeFalse();
  });

  it('must assert defined variables', () => {
    result = isDefined(42);
    expectation = true;

    expect(result).toEqual(expectation);

    result = isDefined(undefined);
    expectation = false;

    expect(result).toEqual(expectation);
  });
});
