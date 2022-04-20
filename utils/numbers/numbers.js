import {
  countDict,
} from '../arrays/arrays.js';

import {
  decimalPart,
} from '../math/math.js';
import { throwError } from '../sys/sys.js';

/**
 * @abstract returns prime factors for non-zero natural numbers 
 * 
 * @param {String} task_msg
 */
export const primeFactors = (n) => {
  if(typeof n !== 'number') {
    throwError(`to factorize \'${n}\'. It MUST be a number!`)
  }
  
  if (decimalPart(n) !== 0 || n < 1) {
    throw Error('The provided number must not be zero and must be natural.');
  }
  
  let factors = [];

  if(n === 1) {
    factors = [1];
  } else {
    let divisor = 2;

    while (n >= 2) {
      if (n % divisor == 0) {
        factors.push(divisor);
        n /= divisor;
      } else {
        divisor++;
      }
    }
  }

  return countDict(factors);
};

/**
 * @abstract returns true/false for prime/non-prime number
 *
 * @param {Number} number 
 * @return {boolean} 
 */
export const isPrime = (number) => {
  return Object.keys(primeFactors(number)).length === 1 && 
         Object.values(primeFactors(number))[0] === 1;
} 