import { throwError, typeOf, warn } from '../sys.js';
import { log_message } from '#utils/logging/logger.js';

jest.mock('#utils/logging/logger.js');

let expected, result, trivia;

describe('sys', () => {
  it('should throw error', () => {
    function throwErrorFn() {
      return throwError('Fire!');
    }

    expect(throwErrorFn).toThrowError();
  });

  it('should warn a message', () => {
    warn('It is warm.');

    expect(log_message).toHaveBeenCalled();
  });

  it('should return data types', () => {
    trivia = [
      [typeOf('string'), 'string'],
      [typeOf(42), 'number'],
      [typeOf({}), 'object'],
      [typeOf(() => {}), 'function'],
      [typeOf(null), 'null'],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });
});
