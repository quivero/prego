import { uniq } from "lodash";

import { isTrue, isFalse, areTrue } from "./checkers";

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

export const fulfill = (arg, condition, error_msg, errorClass = Error) => isCondition(
  condition, (x) => x, arg, error_msg, errorClass
);

export const allIndexes = (arr, val) =>
  arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

export const whosWhat = (array, whatCallback) => {
  const theseElements = array.filter(whatCallback);
  let theseElementsIndexes = [];
  let thisElementIndexes;

  theseElements.forEach((thisElement) => {
    thisElementIndexes = allIndexes(array, thisElement);
    theseElementsIndexes = theseElementsIndexes.concat(thisElementIndexes);
  });

  return uniq(theseElementsIndexes);
};
export const whosTrue = (array) => whosWhat(array, isTrue);
export const whosFalse = (array) => whosWhat(array, isFalse);

export const areArrayElements = (array, truthCallback) =>
  areTrue(array.map(truthCallback));
