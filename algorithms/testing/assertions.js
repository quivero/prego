import { isArray } from "lodash";
import { assertionError } from "./errors";
import { isAssertArtifact, isAssertItem } from "./checkers";
import { fulfill } from "./utils";

const validAssertItemCallback = (item) => {
  let result, expectation, expectToMap, itemCardinality;

  itemCardinality = isArray(item) ? item.length : Object.keys(item).length;
  expectToMap = isArray(item) ? item[1] : item.expectToMap;
  result = isArray(item) ? item[0] : item.result;

  switch (itemCardinality) {
    case 2:
      expectToMap(result);
      break;

    case 3:
      expectation = isArray(item) ? item[2] : item.expectation;

      expectToMap(result, expectation);
      break;
  }
};

export const assertGuard = (item) => {
  const error = assertionError(item);

  return fulfill(item, isAssertItem(item), error.message, error.type);
}

export const batchAssertGuard = (items) => {
  const error = assertionError(items);

  return fulfill(items, isAssertArtifact(items), error.message, error.type);
}

export const assert = (item) => validAssertItemCallback(assertGuard(item));

export const batchAssert = (items) => {
  batchAssertGuard(items).forEach(validAssertItemCallback)
};
