import { isArray, uniq } from "lodash";

/*-------------------------------------------------------------------------------------------------------------*\
 | Conditionals and iterables                                                                                  |
\*-------------------------------------------------------------------------------------------------------------*/

export const isIterable = candidate => typeof candidate?.[Symbol.iterator] === "function";

export const isCondition = ( condition, conditionCallback, args, error_msg, errorClass = Error
) => {
  if (condition) {
    return conditionCallback(args);
  } else {
    throw errorClass(error_msg);
  }
};

/*-------------------------------------------------------------------------------------------------------------*\
 | Boolean operators                                                                                           |
\*-------------------------------------------------------------------------------------------------------------*/

export const and = (acc, el) => acc && el;
export const or = (acc, el) => acc || el;

// TODO: Check if booleanList-variable is boolean array
export const batchAnd = (booleanList) => booleanList.reduce(and, true);
export const batchOr = (booleanList) => booleanList.reduce(or, false);

/*-------------------------------------------------------------------------------------------------------------*\
 | Truth operators                                                                                             |
\*-------------------------------------------------------------------------------------------------------------*/

// TODO: Check if map-output result is boolean array
export const are = (arrayCandidate, truthCallback) => batchAnd(arrayCandidate.map(truthCallback));


export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);

export const fulfill = (arg, condition, error_msg, errorClass = Error) => isCondition(
  condition, (x) => x, arg, error_msg, errorClass
);

/*-------------------------------------------------------------------------------------------------------------*\
 | Artifact                                                                                                    |
\*-------------------------------------------------------------------------------------------------------------*/

export const isArtifactArray = ( candidate, isArtifactCallback ) => isArray(candidate) ? 
  are(candidate, isArtifactCallback) : false;

export const isArtifact = ( candidate, isArtifactCallback ) => isArtifactCallback(candidate) ? 
  true : isArtifactArray(candidate, isArtifactCallback);

export const applyArtifact = ( candidate, isArtifactCallback, applyCallback ) => {
  const artifactApplyCallback = (candidate) => isArtifactArray( candidate, isArtifactCallback ) ? 
    candidate.map(applyCallback) : applyCallback(candidate);
  
  return isCondition( 
    isArtifact( candidate, isArtifactCallback ), artifactApplyCallback, candidate, 
    "Provided candidate does not fulfill artifact is-callback", TypeError
  )
}

/*-------------------------------------------------------------------------------------------------------------*\
 | Array helpers                                                                                               |
\*-------------------------------------------------------------------------------------------------------------*/

// TODO: 
//  1. Provide is-callback to iterate along array (suggestion: filter for keys);
//  2. Verify if arr-variable isArray.
export const allIndexes = (array, val) =>
  array.reduce(
    (acc, el, i) => (el === val ? [...acc, i] : acc), 
    []
  );

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

  array.forEach(
    (el, index) => {
      line = `${index}. ${String(el)}\n`
      enumeratedStringArray += line;
    }
  );

  return enumeratedStringArray;
}

/*-------------------------------------------------------------------------------------------------------------*\
 | String manipulators                                                                                         |
\*-------------------------------------------------------------------------------------------------------------*/

const stringifyMap = (element) => String(element);
export const stringifier = (artifact) => isArray(artifact) ? artifact.map(stringifyMap) : String(artifact);

export const delimitify = ( strings, delimiter ) => stringifier(strings).join(delimiter);
export const slugify = ( strings ) => stringifier(strings).join('_');
export const hyphenify = ( strings ) => stringifier(strings).join('-');
export const andify = ( strings ) => stringifier(strings).join('&');
export const orify = ( strings ) => stringifier(strings).join('|');
