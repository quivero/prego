import { isArray } from "lodash";
import { batchAnd } from "../retoric/utils";

/*-------------------------------------------------------------------------------------------------------------*\
 | Truth operators                                                                                             |
\*-------------------------------------------------------------------------------------------------------------*/

// TODO: Check if map-output result is boolean array
export const are = (arrayCandidate, truthCallback) =>
  batchAnd(arrayCandidate.map(truthCallback));

export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);

export const fulfill = (arg, condition, error_msg, errorClass = Error) =>
  isCondition(condition, (x) => x, arg, error_msg, errorClass);

/*-------------------------------------------------------------------------------------------------------------*\
 | Artifact                                                                                                    |
\*-------------------------------------------------------------------------------------------------------------*/

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

export const isArtifactArray = (candidate, isArtifactCallback) =>
  isArray(candidate) ? are(candidate, isArtifactCallback) : false;

export const hasValidArtifactItem = (candidate, isArtifactCallback) =>
  isArray(candidate) ?  
  candidate.map(isArtifactCallback).includes(true) : 
  false;

export const isArtifactItem = (candidate, isArtifactCallback) =>
  isArtifactCallback(candidate);

export const isArtifact = (candidate, isArtifactCallback) =>
  isArtifactCallback(candidate) ? 
  true : 
  isArtifactArray(candidate, isArtifactCallback);

export const hasValidArtifacts = (candidate, isArtifactCallback) =>
  isArtifactItem(candidate, isArtifactCallback) || 
  hasValidArtifactItem(candidate, isArtifactCallback);

export const isArtifactCollection = (candidate, isArtifactCallback) => {
  const isArtifactCallback_ = (x) => isArtifact(x, isArtifactCallback);
  
  return isArtifact(candidate, isArtifactCallback_);
};

export const applyArtifact = (candidate, isArtifactCallback, applyCallback) => {
  const artifactApplyCallback = (candidate) =>
    isArtifactArray(candidate, isArtifactCallback)
      ? candidate.map(applyCallback)
      : applyCallback(candidate);

  return isCondition(
    isArtifact(candidate, isArtifactCallback),
    artifactApplyCallback,
    candidate,
    "Provided candidate does not fulfill artifact is-callback",
    TypeError
  );
};
