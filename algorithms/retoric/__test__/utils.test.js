import { isReasoningArtifact } from '../checkers';
import {
  applyReasoningArtifact,
  batchAnd,
  batchOr,
  getPremiseKeys,
  getPremisesEntries,
} from '../utils';
import {
  expectedPremisesEntries,
  expectedPremisesKeys,
  premises,
  expectedPremisesConclusions,
} from './fixtures';

const concludeCallback = (premise) => premise.conclude();

let result, expectation;

describe('dialetic-utils', () => {
  it('must assert reasoning artifact', () => {
    expect(isReasoningArtifact(premises)).toBeTrue();
  });

  it('must assert getPremisesEntries', () => {
    result = getPremisesEntries(premises);
    expectation = expectedPremisesEntries;

    expect(result).toEqual(expectation);
  });

  it('must assert getPremisesKeys', () => {
    result = getPremiseKeys(premises);
    expectation = expectedPremisesKeys;

    expect(result).toEqual(expectation);
  });

  it('must assert applyReasoningArtifact', () => {
    result = applyReasoningArtifact(premises, concludeCallback);
    expectation = expectedPremisesConclusions;

    expect(result).toEqual(expectation);
  });

  it('must throw on non-fulfillinf condition for applyReasoningArtifact', () => {
    result = () => applyReasoningArtifact(['ackbar', 42], concludeCallback);
    expectation = TypeError;

    expect(result).toThrow(expectation);
  });

  it("assert batch operators 'and' and 'or'", () => {
    result = batchAnd([true, true]);
    expect(result).toBeTrue();

    result = batchAnd([true, false]);
    expect(result).toBeFalse();

    result = batchOr([false, false]);
    expect(result).toBeFalse();

    result = batchOr([true, false]);
    expect(result).toBeTrue();
  });
});
