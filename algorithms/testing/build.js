import { isArray, isFunction, isString } from "lodash";
import { isActArtifact, isAssertItem, isOrganization } from "./checkers";
import { organizationTypeError, assertionError } from "./errors";
import { rehearse, validate } from "./assertions";
import { actCriterium } from "./criteriaStrings";
import { isCondition } from "./utils";
import { emptyCallback, identityCallback } from "./defaults";
import { is } from "arqeo";

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

  return isCondition(
    is(item, isAssertItem),
    buildSceneCallback,
    item,
    assertionError_.message,
    assertionError_.type
  );
};

export const buildOrganization = (setup, prepare, teardown) => {
  const organization = {
    setup: setup,
    prepare: prepare,
    teardown: teardown,
  };

  return organization;
};

const fillOrganizationCallback = (organization) => {
  return buildOrganization(
    organization["setup"] ?? emptyCallback,
    organization["prepare"] ?? identityCallback,
    organization["teardown"] ?? emptyCallback
  );
};

export const fillOrganization = (candidate) => {
  const OrganizationError = organizationTypeError(candidate);

  return isCondition(
    isOrganization(candidate), fillOrganizationCallback,
    candidate, OrganizationError.message, OrganizationError.type
  );
};

const defaultOrganization = fillOrganization({});

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
