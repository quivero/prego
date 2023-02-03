import { enumerate } from "./utils";

/*-------------------------------------------------*\
 | assertItem                                      |
\*-------------------------------------------------*/
const assertDescription = "Assert test item must have structure: \n\n";

const assertValidArgument_1 = "[result, expectToMap]";
const assertValidArgument_2 = "[result, expectToMap, expectation]";
const assertValidArgument_3 = '{"result": object, "expectToMap": function}';

let assertKeyValue1 = '"result": object, "expectation": object';
let assertKeyValue2 = '"expectToMap": function';

const assertValidArgument_4 = `{${assertKeyValue1}, ${assertKeyValue2}}`;

export const assertCriteriaArray = [
  assertValidArgument_1, assertValidArgument_2, assertValidArgument_3, assertValidArgument_4
];

const schemas = `${enumerate(assertCriteriaArray)}\n`;

export const assertItemCriteria = assertDescription + schemas;

/*-------------------------------------------------*\
 | Organization                                      |
\*-------------------------------------------------*/
const orgDescription = "An organization has the following characteristics \n\n";

const orgCriterium1 = "Type object;";
const orgCriterium2 = 'Keys strings: ["setup", "prepare", "teardown"];';
const orgCriterium3 = 'Value types: ["function", "function", "function"];';
const orgCriterium4 = "Value argument: length [void, [any], void];";
const orgCriterium5 = "Has return value: [false, true, false];";
const orgCriterium6 =
  '"prepare" return value types: assertItem or Array(assertItem);';

const organizationCriteriaArray = [
  orgCriterium1, orgCriterium2, orgCriterium3, orgCriterium4, orgCriterium5, orgCriterium6
];

const orgProps = `${enumerate(organizationCriteriaArray)}\n `;

export const organizationCriteria = orgDescription + orgProps;
