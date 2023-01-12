import { countDict } from "../arrays/arrays.js";

import { decimalPart } from "../math/math.js";
import { throwError } from "../sys/sys.js";

/**
 * @abstract returns prime factors for non-zero natural numbers
 *
 * @param {String} task_msg
 */
export const primeFactors = (n) => {
  if (typeof n !== "number") {
    throwError(`It is impossible to factorize \'${n}\'. It MUST be a number!`);
    return;
  }

  if (decimalPart(n) !== 0 || n < 1) {
    throwError("The provided number must not be zero and must be natural.");
    return;
  }

  let factors = [];

  if (n === 1) {
    factors = [1];
  } else {
    let divisor = 2;

    while (n >= 2) {
      if (n % divisor === 0) {
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
  if (typeof number !== "number") {
    throwError(
      `It is impossible to factorize \'${number}\'. It MUST be a number!`
    );
    return;
  } else {
    return (
      Object.keys(primeFactors(number)).length === 1 &&
      Object.values(primeFactors(number))[0] === 1
    );
  }
};

/**
 * @abstract converts randian to degree angle
 *
 * @param {Number} radian_angle
 * @return {NUmber}
 */
export const radianToDegree = (radian_angle) => (180 * radian_angle) / Math.PI;

/**
 * @abstract converts degree to randian angle
 *
 * @param {Number} radian_angle
 * @return {Number}
 */
export const degreeToRadian = (degree_angle) => (Math.PI * degree_angle) / 180;

/**
 * @abstract return haversine function sin^2(theta)
 *
 * @param {Number} radian_angle
 * @return {NUmber}
 */
export const hav = (theta) => Math.sin(theta / 2) ** 2;
