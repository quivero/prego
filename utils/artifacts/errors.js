import { isString } from "lodash";
import { fulfill, isExtensionOf } from "./checkers";

export const buildError = (errorClass, errorMessage) => {
  return {
    message: fulfill(
      errorMessage, isString(errorMessage),
      "Error message must be a string!", TypeError
    ),
    type: fulfill(
      errorClass, isExtensionOf(errorClass, Error),
      "Error type must extend Error class!", TypeError
    ),
  };
};

export const artifactErrorMessage = (ItemCriteria = "") => {
  const artifactCriterium = "either an item or array of items with true-return callback";
  const artifactDescription = `An artifact is ${artifactCriterium}. \n`;
  
  return artifactDescription + ItemCriteria;
}

export const artifactError = (ItemCriteria = "") => buildError(
  TypeError, artifactErrorMessage(ItemCriteria)
);
  
