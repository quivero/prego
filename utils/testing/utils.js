import { uniq } from "lodash";
import { isTrue, isFalse, areTrue } from "./checkers";

export const allIndexes = (arr, val) => arr.reduce(
  (acc, el, i) => (el === val ? [...acc, i] : acc), []
);

export const whosWhat = (array, whatCallback) => {
  const theseElements = array.filter(whatCallback)
  let theseElementsIndexes = [];
  let thisElementIndexes;

  theseElements.forEach(
    thisElement => {
      thisElementIndexes = allIndexes(array, thisElement);
      theseElementsIndexes = theseElementsIndexes.concat(thisElementIndexes);
    }
  );

  return uniq(theseElementsIndexes);
};
export const whosTrue = (array) => whosWhat(array, isTrue);
export const whosFalse = (array) => whosWhat(array, isFalse);

export const areArrayElements = (array, truthCallback) => areTrue(array.map(truthCallback));

