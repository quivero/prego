import { isArray, uniq } from "lodash";
import { areTrue, isFalse, isTrue } from "../artifacts/checkers";

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
  let enumeratedStringArray = "";
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
export const slugify = (strings) => stringifier(strings).join("_");
export const hyphenify = (strings) => stringifier(strings).join("-");
export const andify = (strings) => stringifier(strings).join("&");
export const orify = (strings) => stringifier(strings).join("|");
