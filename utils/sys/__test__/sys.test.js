import {
  throwError
} from '../sys.js'

describe('numbers', () => {
    it('should throw error', () => {
      function throwErrorFn() {
        return throwError('to continue!')
      }

      expect(throwErrorFn).toThrowError();
    });
});
  