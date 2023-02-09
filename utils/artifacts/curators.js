import { isArray } from "lodash";
import { hasArtifacts, isArtifact, isArtifactItem } from "./artifacts";
import { areFalse, hasTrue } from "./checkers";

export const catalogArtifactItems = (candidate, isArtifactCallback) => {
  const catalogArtifactItem = (candidate) => isArtifactItem(candidate, isArtifactCallback)

  return hasArtifacts(candidate, isArtifactCallback)  ? 
  (
    isArtifactItem(candidate, isArtifactCallback) ? 
    [ true ] : candidate.map(catalogArtifactItem)
  ) : false;
}

export const hasArtifactItemInCollection = (candidate, isArtifactCallback) => {
  const catalogCallback = (element) => catalogArtifactItems(element, isArtifactCallback);
  
  return isArtifact(candidate, isArtifactCallback)  ? 
  true : (
    isArray(candidate) ? 
    candidate.map(catalogCallback).includes(true) || 
    candidate.map(catalogCallback).map(hasTrue).includes(true) : 
    false
  );
};

export const catalogArtifactsInCollection = (candidate, isArtifactCallback) => {
  const catalogCallback = (element) => catalogArtifactItems(element, isArtifactCallback);
  
  return isArtifact(candidate, isArtifactCallback)  ? 
    catalogArtifactItems(candidate, isArtifactCallback) : 
    ( 
      isArray(candidate) ? 
      (
        areFalse(candidate.map(catalogCallback)) ? false : candidate.map(catalogCallback)
      ) :
      false 
    );
};
