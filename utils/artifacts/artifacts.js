import { isArray } from "lodash";
import { are, fulfill, hasTrue } from "./checkers";


/*-------------------------------------------------------------------------------------------------------------*\
 | Truth operators                                                                                             |
\*-------------------------------------------------------------------------------------------------------------*/

/*
// TODO: Check if map-output result is boolean array
export const are = (arrayCandidate, truthCallback) =>
  batchAnd(arrayCandidate.map(truthCallback));

export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);
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

*/

/*-------------------------------------------------------------------------------------------------------------*\
 | Artifact                                                                                                    |
\*-------------------------------------------------------------------------------------------------------------*/

export const isArtifactArray = (candidate, isArtifactCallback) =>
  isArray(candidate) ? are(candidate, isArtifactCallback) : false;

export const hasArtifactItem = (candidate, isArtifactCallback) =>
  isArray(candidate) ?  
  candidate.map(isArtifactCallback).includes(true) : 
  false;

export const isArtifactItem = (candidate, isArtifactCallback) => isArtifactCallback(candidate);

export const isArtifact = (candidate, isArtifactCallback) =>
  isArtifactCallback(candidate) ? true : isArtifactArray(candidate, isArtifactCallback);

export const hasArtifacts = (candidate, isArtifactCallback) =>
  isArtifactItem(candidate, isArtifactCallback) || 
  hasArtifactItem(candidate, isArtifactCallback);

export const isArtifactCollection = (candidate, isArtifactCallback) => {
  return isArtifact(candidate, (x) => isArtifact(x, isArtifactCallback));
};

export const applyArtifact = (candidate, isArtifactCallback, applyCallback) => {
  const artifactApplyCallback = (candidate) =>
    isArtifactArray(candidate, isArtifactCallback) ? 
    candidate.map(applyCallback) : 
    applyCallback(candidate);

  return artifactApplyCallback(
    fulfill(
      candidate, isArtifact(candidate, isArtifactCallback), 
      "Provided candidate does not fulfill artifact is-callback", TypeError
    )
  );
}

export const catalogArtifactItems = (candidate, isArtifactCallback) => {
  const catalogArtifactItem = (candidate) => isArtifactItem(candidate, isArtifactCallback)

  return hasArtifacts(candidate, isArtifactCallback)  ? 
  (
    isArtifactItem(candidate, isArtifactCallback) ? 
    [ true ] : candidate.map(catalogArtifactItem)
  ) : false;
}

export const hasArtifactItemInCollection = (candidate, isArtifactCallback) => {
  return isArtifact(candidate, isArtifactCallback)  ? 
  true : (
    isArray(candidate) ? 
    isArtifact(
      catalogArtifactItems(candidate, isArtifactCallback), 
      hasTrue
    ) : 
    false
  );
};
