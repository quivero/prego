import _, { isArray, isObject, intersection } from "lodash";
import { isCondition } from "../sys/sys";

export const emptyCallback = () => {};
export const identityCallback = (fixture_) => fixture_;

let item2LengthKeys, item3LengthKeys;
item2LengthKeys = ["result", "expectation"];
item3LengthKeys = [...item2LengthKeys, "assertionMap"];

const assertionError = (item) => {
  const itemValuesTypes = Object.values(item).map((value) => typeof value);
  const itemKeys = Object.keys(item);
  const itemType = isArray(item) ? "array" : "object";

  const description = "Assert test item must have structure: \n\n";

  const validArgument_1 = "[result, assertionMap]";
  const validArgument_2 = "[result, assertionMap, expected]";
  const validArgument_3 = '{"result": object, "assertionMap": function}';

  let key_value_1 = '"result": object, "expectation": object';
  let key_value_2 = '"assertionMap": function';

  const validArgument_4 = `{${key_value_1}, ${key_value_2}}`;

  const schemas_1 = `1. ${validArgument_1}; \n`;
  const schemas_2 = `2. ${validArgument_2}; \n`;
  const schemas_3 = `3. ${validArgument_3}; \n`;
  const schemas_4 = `4. ${validArgument_4}; \n`;

  const schemas = ` ${schemas_1} ${schemas_2} ${schemas_3} ${schemas_4} \n`;

  const givenItemDescription = `keys [${itemKeys}] and value types [${itemValuesTypes}]`;
  const givenItemTypesMsg = `Given item has type ${itemType} with ${givenItemDescription}`;

  const invalidAssertItemMsg = description + schemas + givenItemTypesMsg;

  return {
    message: invalidAssertItemMsg,
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
    isValidAssertItemCondition,
    validAssertItemCallback,
    item,
    assertionError_.message,
    assertionError_.type
  );
};

export const batchAssert = (items) => items.forEach((item) => assert(item));

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
  rehearsals.forEach((rehearsal) =>
    describe(rehearsal.name, rehearsal.callback)
  );
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
    isValidAssertItemCondition,
    buildSceneFromValidItemCallback,
    item,
    assertionError_.message,
    assertionError_.type
  );
};

export const buildAct = (setup, prepare, perform, teardown) => {
  return {
    setup: setup,
    prepare: prepare,
    perform: perform,
    teardown: teardown,
  };
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
