import { defaultArrayTruthMessage } from '../defaults';
import { arrayTruthError, organizationTypeError } from '../errors';
import { expectToMatch } from '../expectTo';

describe('Errors', () => {
  it('must provide organization error', () => {
    const orgError = organizationTypeError('Not an organization');

    expectToMatch(orgError.message, '[]');
  });

  it('must match on truthError message the truthMessage and falseIndexesString', () => {
    const truthMessage = '\n This array must have only true values. :/';
    const falseIndexes = [0, 1];
    const falseIndexesString = `[${falseIndexes}]`;

    const truthError = arrayTruthError(falseIndexes, truthMessage);

    expectToMatch(truthError.message, truthMessage);
    expectToMatch(truthError.message, falseIndexesString);
  });

  it('must match defaultArrayTruthMessage on truthError message without truthMessage', () => {
    const falseIndexes = [0, 1];
    const falseIndexesString = `[${falseIndexes}]`;
    const truthError = arrayTruthError(falseIndexes);

    expectToMatch(truthError.message, defaultArrayTruthMessage);
    expectToMatch(truthError.message, falseIndexesString);
  });
});
