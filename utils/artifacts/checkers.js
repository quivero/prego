import { isArray } from "lodash";
import { batchAnd } from "../retoric/utils";


export const are = (arrayCandidate, truthCallback) =>
  batchAnd(arrayCandidate.map(truthCallback));

export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);
export const areFalse = (array) => array.every(isFalse);
export const hasTrue = (element) => isArray(element) ? element.includes(true) : isTrue(element);

export const isCondition = (
  condition,
  conditionCallback,
  args,
  error_msg,
  errorClass = Error
) => {
  if (condition) {
    return conditionCallback(args);
  } else {
    throw errorClass(error_msg);
  }
};

export const fulfill = (arg, condition, error_msg, errorClass = Error) =>
  isCondition(condition, (x) => x, arg, error_msg, errorClass);

export const isExtensionOf = (childClass, parentClassCandidate) => 
    Object.getPrototypeOf(childClass.prototype) === parentClassCandidate.prototype;
