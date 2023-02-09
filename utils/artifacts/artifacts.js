import { isArray } from "lodash";
import { are, fulfill } from "./checkers";

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
