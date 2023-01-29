import { uniq } from "lodash";

export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);

export const allIndexes = (arr, val) => arr.reduce(
  (acc, el, i) => (el === val ? [...acc, i] : acc), []
);

export const areArrayElements = (array, truthCallback) => {
  return areTrue(array.map(truthCallback));
}

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

