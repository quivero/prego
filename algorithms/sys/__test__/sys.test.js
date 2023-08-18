import { throwError, typeOf, warn, raise, report, joke } from '../sys.js';
import { log_message, log } from '#algorithms/logging/logger.js';

jest.mock('#algorithms/logging/logger.js');

let expected, result, trivia;

describe('throwError/warn', () => {
  it('should throw error', () => {
    const throwErrorFn = () => {
      return throwError('Fire!');
    };

    expect(throwErrorFn).toThrow();

    const raiseFn = () => raise('Fire!');
    expect(raiseFn).toThrow(Error);
  });

  it('should throw TypeError', () => {
    const raiseFn = () => raise('Wrong is not right!', TypeError);
    expect(raiseFn).toThrow(TypeError);
  });

  it('should call log on report', () => {
    report('News!');
    expect(log).toHaveBeenCalled();
  });

  it('should call log', () => {
    joke('News!');
    expect(log).toHaveBeenCalled();
  });

  it('should warn a message', () => {
    warn('It is warm.');

    expect(log_message).toHaveBeenCalled();
  });
});

describe('typeOf', () => {
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
