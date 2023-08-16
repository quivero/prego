import { enumerate } from "./utils";

/*-------------------------------------------------------------------------------*\
 | assertItem                                                                    |
\*-------------------------------------------------------------------------------*/
const assertDescription = "An assert test item must have structure: \n\n";

const assertValidArgument_1 = "[result, expectToMap]";
const assertValidArgument_2 = "[result, expectToMap, expectation]";
const assertValidArgument_3 = '{"result": object, "expectToMap": function}';

let assertKeyValue1 = '"result": object, "expectation": object';
let assertKeyValue2 = '"expectToMap": function';

const assertValidArgument_4 = `{${assertKeyValue1}, ${assertKeyValue2}}`;

export const assertCriteriaArray = [
  assertValidArgument_1,
  assertValidArgument_2,
  assertValidArgument_3,
  assertValidArgument_4,
];

const schemas = `${enumerate(assertCriteriaArray)}`;

export const assertItemCriteria = assertDescription + schemas;

/*-------------------------------------------------------------------------------*\
 | assertArtifact                                                                |
\*-------------------------------------------------------------------------------*/

const assertArtifactDescription = "An assert item artifact is either an assertion item or array of them with following structure: \n\n";

export const assertArtifactCriteria = assertArtifactDescription + schemas;

/*--------------------------------------------------------------------------------*\
 | Organization                                                                   |
\*--------------------------------------------------------------------------------*/
const orgDescription = "An organization has the following characteristics \n\n";

const orgCriterium1 = "Type object;";
const orgCriterium2 = 'Keys strings: ["setup", "prepare", "teardown"];';
const orgCriterium3 = 'Value types: ["function", "function", "function"];';
const orgCriterium4 = "Value input argument: length [void, [any], void];";
const orgCriterium5 = "Has return value: [false, true, false];";
const orgCriterium6 =
  '"prepare" return value types: assertItem or Array(assertItem);';

const organizationCriteriaArray = [
  orgCriterium1,
  orgCriterium2,
  orgCriterium3,
  orgCriterium4,
  orgCriterium5,
  orgCriterium6,
];

const orgProps = `${enumerate(organizationCriteriaArray)}\n `;

export const organizationCriteria = orgDescription + orgProps;


/*--------------------------------------------------------------------------------*\
 | Act                                                                            |
\*--------------------------------------------------------------------------------*/

const actDescription = "An act composes of: ";

const actCompositionItems = [
  "An organization;",
  "A script callback with organization-prepared fixtures return as a scene a.k.a. an assert item as a raw object."
]

const actComposition = `${enumerate(actCompositionItems)}`;

export const actCriterium = actDescription + "\n\n" +
    actComposition + "\n" +
    assertItemCriteria + "\n" +
    organizationCriteria;

/*--------------------------------------------------------------------------------*\
 | Rehearsal                                                                       |
\*--------------------------------------------------------------------------------*/

const reherasalDescription = "A rehearsal constitutes of organization and a script with return as a Scene a.k.a. an assert item.";

export const reherasalCriterium = reherasalDescription + "\n\n" +
    assertItemCriteria + "\n\n" +
    organizationCriteria;
