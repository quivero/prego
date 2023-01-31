import { isArray, isFunction } from "lodash";

import { isCondition } from "./utils";
import {
  isAssertItem,
  isOrganization,
  possibleOrganizationKeys
} from "./checkers";
import {
  organizationTypeError,
  assertionError
} from "./errors";
import { rehearse, validate } from "./assertions";


export const buildScene = (item) => {
    const assertionError_ = assertionError(item);
    const isValidAssertItemCondition = isAssertItem(item);

    const buildSceneCallback = (item_) => {
      let result, expectation, assertMap, itemCardinality;

      if (isArray(item_)) {
        itemCardinality = item_.length;
        result = item_[0];
        assertMap = item_[1];

        switch (itemCardinality) {
          case 2:
            return {
              result: result,
              assertionMap: assertMap,
            };

          case 3:
            expectation = isArray(item_) ? item_[2] : item_.expectation;

            return {
              result: result,
              assertionMap: assertMap,
              expectation: expectation,
            };
        }
      } else return item_;
    };

    return isCondition(
      isValidAssertItemCondition, buildSceneCallback, item,
      assertionError_.message, assertionError_.type
    );
};


export const buildOrganization = (setup, prepare, teardown) => {
  return {
      "setup": setup,
      "prepare": prepare,
      "teardown": teardown
  }
};


export const fillOrganization = (candidate) => {
  const isOrganizationCondition = isOrganization(candidate);
  const OrganizationError = organizationTypeError(candidate);

  const fillOrganizationCallback = (organization) => {
    let defaultValue;

    possibleOrganizationKeys.forEach(
      (organizationKey) => {
          organization[organizationKey] = organization[organizationKey] ?? defaultValue;
      }
    );

    return organization;
  };

  return isCondition(
      isOrganizationCondition, fillOrganizationCallback, candidate,
      OrganizationError.message, OrganizationError.type
  );
}

const actCallback = (actArgs) => {
  return {
    setup: actArgs.organization.setup,
    prepare: actArgs.organization.prepare,
    perform: actArgs.performance,
    teardown: actArgs.organization.teardown
  }
};

export const buildAct = (script, organization=defaultOrganization) => {
  organization = fillOrganization(organization);

  let actArgs = {
    "organization": organization,
    "performance": script
  };

  const actDescription = "a function with 1 input and output argument";
  const actPerformCriterium = `First argument \"perform\" must be ${actDescription}`;

  return isCondition(
    isFunction(script), actCallback, actArgs,
    actPerformCriterium, TypeError
  );
};


export const buildRehearsal = (name, acts) => {
  return {
      name: name,
      callback: () => rehearse(acts),
  };
};


export const buildPlay = (description, rehearsals) => {
  return {
      description: description,
      callback: () => validate(rehearsals),
  };
};
