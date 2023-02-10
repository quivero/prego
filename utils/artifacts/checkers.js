import { isArray, isBoolean } from "lodash";

const and = (acc, el) => acc && el;
export const batchAnd = (list) => {
  const error_message = 'Batch and expects a list of boolean values i.e. true/false.';

  if(isArray(list)) {
    if(list.every(isBoolean)) {
      return list.reduce(and, true);
    } else {
      throw TypeError(error_message);
    }
  } else {
    throw TypeError(error_message);
  }
}

export const are = (candidate, truthCallback) => batchAnd(
    candidate.map(truthCallback)
);

export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);
export const areFalse = (array) => array.every(isFalse);
export const hasTrue = (element) => isArray(element) ? element.includes(true) : isTrue(element);

export let isCondition = (
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
