import _, {
  isArray,
  isObject,
  intersection,
  union,
  difference,
  every,
  isFunction
} from "lodash";
import { isCondition } from "../sys/sys";

import {
  bunwareCriteria,
  assertItemCriteria
} from "./assertionCriteriaStrings";

export const emptyCallback = () => {};
export const identityCallback = (fixture_) => fixture_;

// Default item key strings
let item2LengthKeys, item3LengthKeys;
item2LengthKeys = ["result", "expectation"];
item3LengthKeys = [...item2LengthKeys, "assertionMap"];

// Possible bunware key strings
const bunwareKeys = ["setup", "prepare", "teardown"];

// Default bunware
const defaultBunware = {
  "setup": emptyCallback,
  "prepare": identityCallback,
  "teardown": emptyCallback
}

const assertionError = (item) => {
  const itemValuesTypes = Object.values(item).map((value) => typeof value);
  const itemKeys = Object.keys(item);
  const itemType = isArray(item) ? "array" : "object";

  const givenItemDescription = `keys [${itemKeys}] and value types [${itemValuesTypes}]`;
  const givenItemTypesMsg = `Given item has type ${itemType} with ${givenItemDescription}`;

  const invalidAssertItemMsg = assertItemCriteria + givenItemTypesMsg;

  return {
    message: invalidAssertItemMsg,
    type: TypeError,
  };
};


const bunwareTypeError = (fakeBunware) => {
  const fakeBunwareType = typeof fakeBunware;
  const fakeBunwareKeys = fakeBunwareType === "object" ? Object.keys(fakeBunware) : "[]";
  const fakeBunwareValuesTypes = fakeBunwareType === "object" ?
    Object.values(fakeBunware).map((value) => typeof value) : "[]";

  let invalidBunwareObjectMsg = "";

  const fakeBunwareDescription = `keys [${fakeBunwareKeys}] and value types [${fakeBunwareValuesTypes}]`;
  const givenBunwareMsg = `Given bunware has type ${fakeBunwareType} with ${fakeBunwareDescription}`;

  invalidBunwareObjectMsg = bunwareCriteria + givenBunwareMsg;

  return {
    message: invalidBunwareObjectMsg,
    type: TypeError,
  };
};

export const isAssertItem = (item) => {
  let keysCardinalityCondition;
  let necessaryKeysCondition;
  let functionTypeCondition;

  if (isArray(item)) {
    const item_length = item.length;
    keysCardinalityCondition = item_length === 2 || item_length === 3;
    functionTypeCondition = typeof item[1] === "function";

    return keysCardinalityCondition && functionTypeCondition;
  } else if (isObject(item)) {
    const object_keys = Object.keys(item);

    keysCardinalityCondition =
      object_keys.length === 2 || object_keys.length === 3;
    necessaryKeysCondition =
      intersection(object_keys, item2LengthKeys).length === 2 ||
      intersection(object_keys, item3LengthKeys).length === 3;
    functionTypeCondition = typeof item.assertionMap === "function";

    return (
      keysCardinalityCondition &&
      necessaryKeysCondition &&
      functionTypeCondition
    );
  } else return false;
};

export const isBunware = (candidate) => {
  const candidateKeys = Object.keys(candidate);
  const bunwareCandidateKeysUnion = union(bunwareKeys, candidateKeys);

  const isObject_ = isObject(candidate);
  const ObjectKeysLowerEqualThan3 = candidateKeys.length <= 3;
  const areBunwareKeys = bunwareCandidateKeysUnion.length === 3;

  return isObject_ && ObjectKeysLowerEqualThan3 && areBunwareKeys;
}

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

const verify = (performanceItems) => batchAssert(performanceItems);

export const atest = (fixtures, scenario) => {
  scenario.setup();

  const augmentedFixtures = scenario.prepare(fixtures);
  let performanceItems = scenario.perform(augmentedFixtures);

  performanceItems = performanceItems.map((performanceItem) =>
    buildScene(performanceItem)
  );

  verify(performanceItems);

  scenario.teardown();
};

export const batchAtest = (fixtures, acts) => {
  _.zip(fixtures, acts).forEach((fixture_act) =>
    atest(fixture_act[0], fixture_act[1])
  );
};

export const rehearse = (auditions) =>
  auditions.forEach((scene) => it(scene.description, scene.callback));

export const validate = (rehearsals) => {
  rehearsals.forEach((rehearsal) => describe(rehearsal.name, rehearsal.callback));
};

export const buildBunware = (setup, prepare, teardown) => {
  return {
    "setup": setup,
    "prepare": prepare,
    "teardown": teardown
  }
};

export const buildScene = (item) => {
  const assertionError_ = assertionError(item);
  const isValidAssertItemCondition = isAssertItem(item);

  const buildSceneFromValidItemCallback = (item_) => {
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
    isValidAssertItemCondition, buildSceneFromValidItemCallback,  item,
    assertionError_.message, assertionError_.type
  );
};

export const fillBunware = (candidate) => {
  const isBunwareCondition = isBunware(candidate);
  const bunwareError = bunwareTypeError(candidate);

  fillBunwareCallback = (bunware) => {
    difference(bunwareKeys, Object.keys(bunware)).forEach(
      (missingBunwareKey) =>  {
          candidate.missingBunwareKey = defaultBunware.missingBunwareKey
      }
    );

    return candidate;
  };

  return isCondition(
    isBunwareCondition, fillBunwareCallback, candidate,
    bunwareError.message, bunwareError.type
  );
}

export const buildAct = (perform, bunware=defaultBunware) => {
  const bunware_ = fillBunware(bunware);
  const isFunction_ = isFunction(perform);
  let actArgs = {};

  actArgs.bunware = bunware_;
  actArgs.perform = perform;

  const actCallback = (actArgs_) => {
    return {
      setup: actArgs_.bunware.setup,
      prepare: actArgs_.bunware.prepare,
      perform: actArgs_.perform,
      teardown: actArgs_.bunware.teardown
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

export const buildAudition = (description, rehearsals) => {
  return {
    description: description,
    callback: () => rehearse(rehearsals),
  };
};
