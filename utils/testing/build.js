import { isArray, isFunction } from "lodash";
import { isCondition } from "../sys/sys";
import { 
    isAssertItem, 
    isOrganization, 
    possibleOrganizationKeys 
} from "./checkers";
import { 
    organizationTypeError, 
    assertionError 
} from "./errors";


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
