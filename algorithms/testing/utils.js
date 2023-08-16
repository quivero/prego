import { isArray, isBoolean, uniq } from 'lodash';

export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);

const and = (acc, el) => acc && el;
export const batchAnd = (list) => {
  const error_message =
    'Batch and expects a list of boolean values i.e. true/false.';

  if (isArray(list)) {
    if (list.every(isBoolean)) {
      return list.reduce(and, true);
    } else {
      throw TypeError(error_message);
    }
  } else {
    throw TypeError(error_message);
  }
};

export const are = (candidate, truthCallback) =>
  batchAnd(candidate.map(truthCallback));

export const fulfill = (arg, condition, error_msg, errorClass = Error) =>
  isCondition(condition, (x) => x, arg, error_msg, errorClass);

export let isCondition = (
  condition, conditionCallback, args, error_msg, errorClass = Error,
) => {
  if (condition) {
    return conditionCallback(args);
  } else {
    throw errorClass(error_msg);
  }
};

export const isExtensionOf = (childClass, parentClassCandidate) =>
  Object.getPrototypeOf(childClass.prototype) ===
  parentClassCandidate.prototype;

/*-------------------------------------------------------------------------------------------------------------*\
 | Array helpers                                                                                               |
\*-------------------------------------------------------------------------------------------------------------*/

// TODO:
//  1. Provide is-callback to iterate along array (suggestion: filter for keys);
//  2. Verify if arr-variable isArray.
export const allIndexes = (array, val) =>
  array.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);

/*-------------------------------------------------------------------------------------------------------------*\
 | Blamer helpers                                                                                              |
\*-------------------------------------------------------------------------------------------------------------*/

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

export const enumerate = (array) => {
  let enumeratedStringArray = '';
  let line;

  array.forEach((el, index) => {
    line = `${index}. ${String(el)}\n`;
    enumeratedStringArray += line;
  });

  return enumeratedStringArray;
};

/*-------------------------------------------------------------------------------------------------------------*\
 | String manipulators                                                                                         |
\*-------------------------------------------------------------------------------------------------------------*/

const stringifyMap = (element) => String(element);
export const stringifier = (artifact) =>
  isArray(artifact) ? artifact.map(stringifyMap) : String(artifact);

export const delimitify = (strings, delimiter) =>
  stringifier(strings).join(delimiter);
export const slugify = (strings) => stringifier(strings).join('_');
export const hyphenify = (strings) => stringifier(strings).join('-');
export const andify = (strings) => stringifier(strings).join('&');
export const orify = (strings) => stringifier(strings).join('|');
