import _, {
  isArray, union, intersection, isObject, uniq, isFunction,
} from 'lodash';

import { batchAnd, are } from './utils';
import { defaultOrganization } from './defaults';
import { availableExpectToMaps } from './expectTo';

import { is } from 'arqeo';

/* -------------------------------------------------------------------------------------------------------------*\
 | Assert items                                                                                                |
\*------------------------------------------------------------------------------------------------------------- */

// Default item key strings
let item2LengthKeys, item3LengthKeys;
item2LengthKeys = ['result', 'expectToMap'];
item3LengthKeys = [...item2LengthKeys, 'expectation'];

export const isAssertItem = (item) => {
  let keysCardinalityCondition;
  let necessaryKeysCondition;
  let functionTypeCondition;
  let expectedExpectToMap;

  if (isArray(item)) {
    const itemLength = item.length;
    keysCardinalityCondition = itemLength === 2 || itemLength === 3;
    functionTypeCondition = typeof item[1] === 'function';
    expectedExpectToMap = availableExpectToMaps.includes(item[1]);

    const criteria = [
      keysCardinalityCondition,
      functionTypeCondition,
      expectedExpectToMap,
    ];

    return batchAnd(criteria);
  } else if (isObject(item)) {
    const objectKeys = Object.keys(item);

    keysCardinalityCondition =
      objectKeys.length === 2 || objectKeys.length === 3;
    necessaryKeysCondition =
      intersection(objectKeys, item2LengthKeys).length === 2 ||
      intersection(objectKeys, item3LengthKeys).length === 3;
    functionTypeCondition = typeof item.expectToMap === 'function';
    expectedExpectToMap = availableExpectToMaps.includes(item.expectToMap);

    const criteria = [
      keysCardinalityCondition,
      necessaryKeysCondition,
      functionTypeCondition,
      expectedExpectToMap,
    ];

    return batchAnd(criteria);
  } else return false;
};

export const areAssertItems = (candidates) => are(candidates, isAssertItem);

export const isAssertArtifact = (candidate) =>
  is(candidate, isAssertItem);

/* -------------------------------------------------------------------------------------------------------------*\
 | Scene                                                                                                       |
\*------------------------------------------------------------------------------------------------------------- */

export const isScene = (candidate) =>
  isAssertItem(candidate) && !isArray(candidate);

export const areScenes = (candidates) => are(candidates, isScene);

/* -------------------------------------------------------------------------------------------------------------*\
 | Organization                                                                                                |
\*------------------------------------------------------------------------------------------------------------- */

// Possible organization key strings
export const possibleOrganizationKeys = Object.keys(defaultOrganization);

export const isOrganization = (candidate) => {
  const candidateKeys = Object.keys(candidate);
  const organizationCandidateKeysUnion = uniq(
    union(possibleOrganizationKeys, candidateKeys),
  );

  const isObject_ = isObject(candidate);
  const objectKeysLowerEqualThan3 = candidateKeys.length <= 3;
  const areOrganizationKeys = organizationCandidateKeysUnion.length === 3;

  const criteria = [isObject_, objectKeysLowerEqualThan3, areOrganizationKeys];

  return batchAnd(criteria);
};

export const areOrganizations = (candidates) => are(candidates, isOrganization);

export const isOrganizationArtifact = (candidate) => is(candidate, isOrganization);

/* -------------------------------------------------------------------------------------------------------------*\
 | Act                                                                                                         |
\*------------------------------------------------------------------------------------------------------------- */

// Default item key strings
const actKeys = [...possibleOrganizationKeys, 'perform'];

const actObjectCallback = (candidate) => {
  const candidateKeys = Object.keys(candidate);
  const actCandidateKeysUnion = uniq(union(actKeys, candidateKeys));
  const actCandidateKeysIntersec = intersection(actKeys, candidateKeys);
  const actCandidateValuesAreFunctions = are(
    Object.values(candidate),
    isFunction,
  );

  const objectKeysUnionLowerEqualThan4 = actCandidateKeysUnion.length <= 4;
  const objectKeysIntersecGreaterEqualThan1 =
      actCandidateKeysIntersec.length >= 1;

  const criteria = [
    objectKeysUnionLowerEqualThan4,
    objectKeysIntersecGreaterEqualThan1,
    actCandidateValuesAreFunctions,
  ];

  return batchAnd(criteria);
}

export const isAct = (candidate) => {
  return isObject(candidate) ? actObjectCallback(candidate) : false;
};

/* -------------------------------------------------------------------------------------------------------------*\
 | Rehearsal                                                                                                   |
\*------------------------------------------------------------------------------------------------------------- */

// Default item key strings
const rehearsalKeys = ['description', 'callback'];

const rehearsalObjectCallback = (candidate) => {
  const candidateKeys = Object.keys(candidate);

  const rehearsalDescriptionIsString = isString(candidate['description']);
  const rehearsalCallbackIsFunction = isFunction(candidate['callback']);
  const intersecKeysEqual2 = intersection(candidateKeys, rehearsalKeys).length === 2;

  const objectKeysLengthEqual2 = candidateKeys.length <= 2;
  actCandidateKeysIntersec.length >= 1;

  const criteria = [
    rehearsalDescriptionIsString,
    rehearsalCallbackIsFunction,
    intersecKeysEqual2,
    objectKeysLengthEqual2,
  ];

  return batchAnd(criteria);
}

export const isRehearsal = (candidate) => {
  return isObject(candidate) ? rehearsalObjectCallback(candidate) : false;
};

export const areActs = (candidates) => are(candidates, isAct);

export const isActArtifact = (candidate) => is(candidate, isAct);
