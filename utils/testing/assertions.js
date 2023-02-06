import _, { isArray } from "lodash";
import { assertionError } from "./errors";
import { isAssertItem } from "./checkers";
import { isCondition } from "../artifacts/artifacts";

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

export const assert = (item) => {
  const assertionError_ = assertionError(item);
  const isValidAssertItemCondition = isAssertItem(item);
  
  isCondition(
    isValidAssertItemCondition, validAssertItemCallback, item,
    assertionError_.message, assertionError_.type
  );
};

export const batchAssert = (items) => items.forEach((item) => assert(item));
