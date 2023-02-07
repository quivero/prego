import { isString } from "lodash";
import { fulfill } from "./artifacts";
import { isExtensionOf } from "./checkers";

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
