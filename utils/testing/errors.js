import _, { isArray, isString } from "lodash";
import { fulfill, isExtensionOf } from "../artifacts/checkers";
import { isAssertArtifact } from "./checkers";

import { organizationCriteria, assertItemCriteria, assertArtifactCriteria } from "./criteriaStrings";
import { defaultArrayTruthMessage } from "./defaults";

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

export const assertionError = (fakeItem) => {
  const itemValuesTypes = Object.values(fakeItem).map((value) => typeof value);
  const itemKeys = Object.keys(fakeItem);
  const itemType = isArray(fakeItem) ? "array" : "object";

  const givenItemDescription = `keys [${itemKeys}] and value types [${itemValuesTypes}]`;
  const givenItemTypesMsg = `Given item has type ${itemType} with ${givenItemDescription}`;

  const invalidAssertItemMsg = assertItemCriteria + givenItemTypesMsg;

  return buildError(TypeError, invalidAssertItemMsg);
};

export const assertionArtifactError = (items) => {
  const itemAreArtifacts = items.map((item) => isAssertArtifact(item));
  
  const designationMsg = `We designate assertion items with 1 and non-(assertion items) with 0: `;
  const areItems = `[${itemAreArtifacts}]`
  
  const checkEachMessage = designationMsg + areItems + "\n";

  const invalidAssertionArtifactMsg = designationMsg + checkEachMessage + assertArtifactCriteria;

  return buildError(TypeError, invalidAssertionArtifactMsg);
};

export const organizationTypeError = (fakeOrganization) => {
  const fakeOrganizationType = typeof fakeOrganization;
  const fakeOrganizationKeys =
    fakeOrganizationType === "object" ? Object.keys(fakeOrganization) : "[]";
  const fakeOrganizationValuesTypes =
    fakeOrganizationType === "object"
      ? Object.values(fakeOrganization).map((value) => typeof value)
      : "[]";

  let invalidOrganizationObjectMsg = "";

  const fakeOrganizationDescription = `keys [${fakeOrganizationKeys}] and value types [${fakeOrganizationValuesTypes}]`;
  const givenOrganizationMsg = `Given Organization has type ${fakeOrganizationType} with ${fakeOrganizationDescription}`;

  invalidOrganizationObjectMsg = organizationCriteria + givenOrganizationMsg;

  return buildError(TypeError, invalidOrganizationObjectMsg);
};

const arrayTruthHeader = (falseElements) => {
  const condition = `non-fulfilling elements on keys [${falseElements}]`;

  return `The provided array have condition ${condition}. `;
};

export const arrayTruthError = (
  falseElements,
  criteriaMessage = defaultArrayTruthMessage
) => {
  const TMessage = arrayTruthHeader(falseElements) + criteriaMessage;

  return buildError(TypeError, TMessage);
};
