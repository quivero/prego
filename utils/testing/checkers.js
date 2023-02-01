import _, { isArray, union, intersection, isObject, uniq, isFunction } from "lodash";

import { defaultOrganization } from "./defaults";

/*-------------------------*\
 | General                 |
\*-------------------------*/

export const and = (acc, el) => acc && el;
export const or = (acc, el) => acc || el;

export const batchAnd = (booleanList) => booleanList.reduce(and, true);
export const batchOr = (booleanList) => booleanList.reduce(or, false);

export const are = (candidates, truthCallback) => areTrue(
  candidates.map((candidate) => truthCallback(candidate))
);
export const isTrue = (element) => element === true;
export const isFalse = (element) => element === false;
export const areTrue = (array) => array.every(isTrue);

/*-------------------------------------------------*\
 | Assert items                                    |
\*-------------------------------------------------*/

// Default item key strings
let item2LengthKeys, item3LengthKeys;
item2LengthKeys = ["result", "expectToMap"];
item3LengthKeys = [...item2LengthKeys, "expectation"];

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
    
    keysCardinalityCondition = object_keys.length === 2 || object_keys.length === 3;
    necessaryKeysCondition =
      intersection(object_keys, item2LengthKeys).length === 2 ||
      intersection(object_keys, item3LengthKeys).length === 3;
    functionTypeCondition = typeof item.expectToMap === "function";

    const criteria = [ keysCardinalityCondition, necessaryKeysCondition, functionTypeCondition ]; 

    return batchAnd(criteria);
  } else return false;
};

export const areAssertItems = (candidates) => are(candidates, isAssertItem)


/*-------------------------------------------------*\
 | Scene                                           |
\*-------------------------------------------------*/

export const isScene = (candidate) => isAssertItem(candidate) && !isArray(candidate);

export const areScenes = (candidates) => are(candidates, isScene);


/*-------------------------------------------------*\
 | Assertifacts = Assert artifacts                 |
\*-------------------------------------------------*/

export const isAssertArtifact = (candidate) => {
  return isArray(candidate) ? (
    areAssertItems(candidate) ? true : isAssertItem(candidate)
  ) : isAssertItem(candidate);
};


/*-------------------------*\
 | Organization            |
\*-------------------------*/

// Possible organization key strings
export const possibleOrganizationKeys = Object.keys(defaultOrganization);

export const isOrganization = (candidate) => {
  const candidateKeys = Object.keys(candidate);
  const organizationCandidateKeysUnion = uniq(union(possibleOrganizationKeys, candidateKeys));

  const isObject_ = isObject(candidate);
  const objectKeysLowerEqualThan3 = candidateKeys.length <= 3;
  const areOrganizationKeys = organizationCandidateKeysUnion.length === 3;

  const criteria = [ isObject_, objectKeysLowerEqualThan3, areOrganizationKeys ]; 

  return batchAnd(criteria);
};

export const areOrganizations = (candidates) => are(candidates, isOrganization);

/*-------------------------------------------------*\
 | Act                                             |
\*-------------------------------------------------*/

// Default item key strings
const actKeys = [...possibleOrganizationKeys, "script"];

export const isAct = (candidate) => {
  const candidateKeys = Object.keys(candidate);
  const actCandidateKeysUnion = uniq(union(actKeys, candidateKeys));
  const actCandidateKeysIntersec = intersection(actKeys, candidateKeys);
  const actCandidateValuesAreFunctions = are(Object.values(candidate), isFunction);

  const isObject_ = isObject(candidate);
  const objectKeysUnionLowerEqualThan4 = actCandidateKeysUnion.length <= 4;
  const objectKeysIntersecGreaterEqualThan1 = actCandidateKeysIntersec.length >= 1;

  const criteria = [
    isObject_, 
    objectKeysUnionLowerEqualThan4, 
    objectKeysIntersecGreaterEqualThan1, 
    actCandidateValuesAreFunctions
  ];

  return batchAnd(criteria);
};

export const areActs = (candidates) => are(candidates, isAct);
