import { isArray, isFunction } from "lodash";

import {
  isAssertItem,
  isOrganization,
  possibleOrganizationKeys,
} from "./checkers";
import { organizationTypeError, assertionError } from "./errors";
import { rehearse, validate } from "./assertions";
import { isCondition } from "../artifacts/artifacts";

const buildSceneCallback = (item) => {
  let result, expectation, expectToMap, itemCardinality;

  if (isArray(item)) {
    itemCardinality = item.length;
    result = item[0];
    expectToMap = item[1];

    switch (itemCardinality) {
      case 2:
        return {
          result: result,
          expectToMap: expectToMap,
        };

      case 3:
        expectation = isArray(item) ? item[2] : item.expectation;

        return {
          result: result,
          expectToMap: expectToMap,
          expectation: expectation,
        };
    }
  } else return item;
};

export const buildScene = (item) => {
  const assertionError_ = assertionError(item);
  const isValidAssertItemCondition = isAssertItem(item);

  return isCondition(
    isValidAssertItemCondition,
    buildSceneCallback,
    item,
    assertionError_.message,
    assertionError_.type
  );
};

export const buildOrganization = (setup, prepare, teardown) => {
  return {
    setup: setup,
    prepare: prepare,
    teardown: teardown,
  };
};

export const fillOrganization = (candidate) => {
  const isOrganizationCondition = isOrganization(candidate);
  const OrganizationError = organizationTypeError(candidate);

  const fillOrganizationCallback = (organization) => {
    let defaultValue;

    possibleOrganizationKeys.forEach((organizationKey) => {
      organization[organizationKey] =
        organization[organizationKey] ?? defaultValue;
    });

    return organization;
  };

  return isCondition(
    isOrganizationCondition,
    fillOrganizationCallback,
    candidate,
    OrganizationError.message,
    OrganizationError.type
  );
};

const actCallback = (actArgs) => {
  return {
    setup: actArgs.organization.setup,
    prepare: actArgs.organization.prepare,
    perform: actArgs.performance,
    teardown: actArgs.organization.teardown,
  };
};

export const buildAct = (script, organization = defaultOrganization) => {
  organization = fillOrganization(organization);

  let actArgs = {
    organization: organization,
    performance: script,
  };

  const actDescription = "a function with 1 input and output argument";
  const actPerformCriterium = `First argument \"perform\" must be ${actDescription}`;

  return isCondition(
    isFunction(script), actCallback, actArgs,
    actPerformCriterium, TypeError
  );
};

export const buildRehearsal = (description, acts) => {
  return {
    description: description,
    callback: () => rehearse(acts),
  };
};

export const buildPlay = (name, rehearsals) => {
  return {
    name: name,
    callback: () => validate(rehearsals),
  };
};
