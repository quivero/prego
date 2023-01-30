import _, { isArray, isFunction } from "lodash";
import { isCondition } from "../sys/sys";
import { 
  isAssertItem,
  isOrganization, 
  possibleOrganizationKeys 
} from "./checkers";
import { organizationTypeError, assertionError } from "./errors";

export const assert = (item) => {
  const assertionError_ = assertionError(item);
  const isValidAssertItemCondition = isAssertItem(item);

  const validAssertItemCallback = (item_) => {
    let result, expectation, assertionMap, itemCardinality;

    itemCardinality = isArray(item) ? item_.length : Object.keys(item_).length;
    assertionMap = isArray(item) ? item[1] : item.assertionMap;
    result = isArray(item) ? item[0] : item.result;

    switch (itemCardinality) {
      case 2:
        assertionMap(result);
        break;

      case 3:
        expectation = isArray(item) ? item[2] : item.expectation;

        assertionMap(result, expectation);
        break;
    }
  };

  isCondition(
    isValidAssertItemCondition, validAssertItemCallback, item,
    assertionError_.message, assertionError_.type
  );
};

export const batchAssert = (items) => items.forEach(
  (item) => assert(item)
);

const verify = (scenes) => batchAssert(scenes);

export const atest = (fixtures, scenario) => {
  scenario.setup();

  const setFixtures = scenario.prepare(fixtures);
  let performanceItems = scenario.perform(setFixtures);

  performanceItems = performanceItems.map(
    (performanceItem) => buildScene(performanceItem)
  );

  verify(performanceItems);

  scenario.teardown();
};

export const batchAtest = (fixtures, acts) => {
  _.zip(fixtures, acts).forEach(
    (fixture_act) => atest(fixture_act[0], fixture_act[1])
  );
};

export const rehearse = (auditions) =>
  auditions.forEach((scene) => it(scene.description, scene.callback));

export const validate = (rehearsals) => {
  rehearsals.forEach(
    (rehearsal) => describe(rehearsal.name, rehearsal.callback)
  );
};

export const buildOrganization = (setup, prepare, teardown) => {
  return {
    "setup": setup,
    "prepare": prepare,
    "teardown": teardown
  }
};

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

export const buildAct = (script, organization=defaultOrganization) => {
  const organization_ = fillOrganization(organization);
  const isFunction_ = isFunction(script); 
  
  let actArgs = {}; 
  
  actArgs.organization = organization_;
  actArgs.perform = script;
  
  const actCallback = (actArgs_) => {
    return {
      setup: actArgs_.organization.setup,
      prepare: actArgs_.organization.prepare,
      perform: actArgs_.perform, 
      teardown: actArgs_.organization.teardown
    }
  };

  const actDescription = "a function with 1 input and output argument";
  const actPerformCriterium = `First argument \"perform\" must be ${actDescription}`;

  return isCondition(
    isFunction_, actCallback, actArgs,
    actPerformCriterium, TypeError
  );
};

export const buildRehearsal = (name, rehearsalCallback) => {
  return {
    name: name,
    callback: rehearsalCallback,
  };
};

export const buildPlay = (description, rehearsals) => {
  return {
    description: description,
    callback: () => rehearse(rehearsals),
  };
};
