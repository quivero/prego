import {
  countDict,
} from '../arrays/arrays.js';

import {
  decimalPart,
} from '../math/math.js';

export const primeFactors = (n) => {
  if (decimalPart(n) !== 0 || n < 0) {
    throw Error('The provided number must not be zero and must be natural.');
  }

  const factors = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n /= divisor;
    } else {
      divisor++;
    }
  }

  return countDict(factors);
};
