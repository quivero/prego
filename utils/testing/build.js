import { isArray, isFunction, isString } from "lodash";
import { isActArtifact, isAssertItem, isOrganization, possibleOrganizationKeys } from "./checkers";
import { organizationTypeError, assertionError } from "./errors";
import { rehearse, validate } from "./assertions";
import { actCriterium } from "./criteriaStrings";
import { isCondition } from "../artifacts/checkers";

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

const fillOrganizationCallback = (organization) => {
  let defaultValue;

  possibleOrganizationKeys.forEach(
    (organizationKey) => {
      organization[organizationKey] = organization[organizationKey] ?? defaultValue;
    }
  );

  return organization;
};

export const fillOrganization = (candidate) => {
  const isOrganizationCondition = isOrganization(candidate);
  const OrganizationError = organizationTypeError(candidate);

  return isCondition(
    isOrganizationCondition,
    fillOrganizationCallback,
    candidate,
    OrganizationError.message,
    OrganizationError.type
  );
};

const actCallback = (actArgs) => {
  actArgs.organization = fillOrganization(actArgs.organization);

  return {
    setup: actArgs.organization.setup,
    prepare: actArgs.organization.prepare,
    perform: actArgs.performance,
    teardown: actArgs.organization.teardown,
  };
};

export const buildAct = (script, organization = defaultOrganization) => {
  const isActInput = isFunction(script) && isOrganization(organization);

  let actArgs = {
    organization: organization,
    performance: script,
  };

  return isCondition(isActInput, actCallback, actArgs, actCriterium, TypeError);
};

const rehearsalCallback = () => {
  return {
    description: description,
    callback: () => rehearse(acts),
  };
}

export const buildRehearsal = (description, acts) => {
  const isRehearsalInput = isString(description) && isActArtifact(acts);

  let rehearsalArgs = {
    organization: description,
    acts: acts,
  };

  return isCondition(
    isRehearsalInput,
    rehearsalCallback,
    rehearsalArgs,
    actCriterium,
    TypeError
  );
};

export const buildPlay = (name, rehearsals) => {
  return {
    name: name,
    callback: () => validate(rehearsals),
  };
};
