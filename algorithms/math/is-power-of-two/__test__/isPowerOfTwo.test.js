import { isPowerOfTwoUseCases } from './fixtures';

describe('isPowerOfTwo', () => {
  test.each(isPowerOfTwoUseCases)(
    'should check if the number is made by multiplying twos',
    (result, expected) => expect(result).toBe(expected),
  );
});
