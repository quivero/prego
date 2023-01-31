import _, { isArray } from "lodash";

import { organizationCriteria, assertItemCriteria } from "./criteriaStrings";
import { defaultArrayTruthMessage } from "./defaults";

export const buildError = (errorClass, errorMessage) => {
  return  {
    message: errorMessage,
    type: errorClass,
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

export const organizationTypeError = (fakeOrganization) => {
  const fakeOrganizationType = typeof fakeOrganization;
  const fakeOrganizationKeys = fakeOrganizationType === "object" ? Object.keys(fakeOrganization) : "[]";
  const fakeOrganizationValuesTypes = fakeOrganizationType === "object" ?
    Object.values(fakeOrganization).map((value) => typeof value) : "[]";

  let invalidOrganizationObjectMsg = "";

  const fakeOrganizationDescription = `keys [${fakeOrganizationKeys}] and value types [${fakeOrganizationValuesTypes}]`;
  const givenOrganizationMsg = `Given Organization has type ${fakeOrganizationType} with ${fakeOrganizationDescription}`;

  invalidOrganizationObjectMsg = organizationCriteria + givenOrganizationMsg;

  return buildError(TypeError, invalidOrganizationObjectMsg);

};

const arrayTruthHeader = (falseElements) => {
  const condition = `non-fulfilling elements on indexes [${falseElements}]`

  return `The provided array have condition ${condition}. `;
}

export const arrayTruthError = (falseElements, truthMessage=defaultArrayTruthMessage) => {
  const TMessage = arrayTruthHeader(falseElements) + truthMessage;

  return buildError(TypeError, TMessage);
}
