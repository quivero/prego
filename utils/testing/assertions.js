import _ from "lodash";

export const assert = (item) => {
  let result, expected;
  const item_length = item.length;
  const isValidAssertItem = item_length === 2 || item_length === 3;

  if (isValidAssertItem) {
    const callback = item[item_length - 1];

    if (typeof callback === "function") {
      switch (item_length) {
        case 2:
          result = item[0];

          callback(result);

          break;

        case 3:
          result = item[0];
          expected = item[1];

          callback(result, expected);

          break;
      }
    } else {
      const callbackValidity =
        "Last element on item must be a callback function!";

      throw Error(callbackValidity);
    }
  } else {
    const description = "Test element may have structure: ";
    const validArgument_1 = "[result, assertion_callback]";
    const validArgument_2 = "[result, expected, assertion_callback]";

    const schemas = `${validArgument_1} or ${validArgument_2}`;

    throw Error(description + schemas);
  }
};

export const batchAssert = (items) => items.forEach((item) => assert(item));

const verifyExperiment = (experiments) => {
  batchAssert(
    _.zip(
      experiments.results,
      experiments.expectations,
      experiments.assertionMaps,
    ),
  );
};

export const atest = (fixtures, scenario) => {
  scenario.setup();

  const experiment = scenario.exercise(scenario.prepare(fixtures));

  verifyExperiment(experiment);

  scenario.teardown();
};

export const batchAtest = (fixtures, scenarios) => {
  let scenario, fixture;

  _.zip(fixtures, scenarios).forEach((scenario_tuple) => {
    fixture = scenario_tuple[0];
    scenario = scenario_tuple[1];

    atest(fixture, scenario);
  });
};

export const rehearsal = (scenes) => {
  let testCaseName, testCaseCallback;

  scenes.forEach((scene) => {
    testCaseName = scene[0];
    testCaseCallback = scene[1];

    it(testCaseName, testCaseCallback);
  });
};

export const validate = (describeCases) => {
  let describeName, describeCallback;

  describeCases.forEach((describeCase) => {
    describeName = describeCase[0];
    describeCallback = describeCase[1];

    describe(describeName, describeCallback);
  });
};

export const buildScenario = (setup, prepare, exercise, teardown) => {
  return {
    setup: setup,
    prepare: prepare,
    exercise: exercise,
    teardown: teardown,
  };
};

export const buildAssertion = (results, expectations, assertionMaps) => {
  return {
    results: results,
    expectations: expectations,
    assertionMaps: assertionMaps,
  };
};

export const expectToBe = (result, expected) => expect(result).toBe(expected);
export const expectToBeEqual = (result, expected) => expect(result).toEqual(expected);
export const expectToStrictEqual = (result, expected) => expect(result).toStrictEqual(expected);
export const expectToBeDefined = (result) => expect(result).toBeDefined();
export const expectToBeUndefined = (result) => expect(result).toBeUndefined();
