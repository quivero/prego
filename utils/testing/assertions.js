import _, { isArray } from "lodash";
import { assertionError } from "./errors";
import { isCondition } from "../sys/sys";
import { isAssertItem } from "./checkers";
import { buildScene } from "./build";

const validAssertItemCallback = (item) => {
  let result, expectation, assertionMap, itemCardinality;

  itemCardinality = isArray(item) ? item.length : Object.keys(item).length;
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

export const assert = (item) => {
  const assertionError_ = assertionError(item);
  const isValidAssertItemCondition = isAssertItem(item);

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
