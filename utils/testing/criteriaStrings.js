// assertItem
const assertDescription = "Assert test item must have structure: \n\n";

const assertValidArgument_1 = "[result, assertionMap]";
const assertValidArgument_2 = "[result, assertionMap, expected]";
const assertValidArgument_3 = '{"result": object, "assertionMap": function}';

let assertKeyValue1 = '"result": object, "expectation": object';
let assertKeyValue2 = '"assertionMap": function';

const assertValidArgument_4 = `{${assertKeyValue1}, ${assertKeyValue2}}`;

const asserSchemas_1 = `1. ${assertValidArgument_1}; \n`;
const asserSchemas_2 = `2. ${assertValidArgument_2}; \n`;
const asserSchemas_3 = `3. ${assertValidArgument_3}; \n`;
const asserSchemas_4 = `4. ${assertValidArgument_4}; \n`;

const asserSchemaComb_1 = ` ${asserSchemas_1} ${asserSchemas_2}`;
const asserSchemaComb_2 = ` ${asserSchemas_3} ${asserSchemas_4}`;

const schemas = `${asserSchemaComb_1}${asserSchemaComb_2}\n`;

export const assertItemCriteria = assertDescription + schemas;

// Bunware
const orgDescription = "An organization has the following characteristics \n\n"

const orgCriterium1 = "Type object;";
const orgCriterium2 = "Keys strings [\"setup\", \"prepare\", \"teardown\"];";
const orgCriterium3 = "Value types [\"function\", \"function\", \"function\"];";
const orgCriterium4 = "Value argument length [0, 1, 0];";
const orgCriterium5 = "Has return value [false, true, false];";
const orgCriterium6 = "\"prepare\" return value types assertItem or Array(assertItem);";

const organizationProp1 = `1. ${orgCriterium1}`;
const organizationProp2 = `2. ${orgCriterium2}`;
const organizationProp3 = `3. ${orgCriterium3}`;
const organizationProp4 = `4. ${orgCriterium4}`;
const organizationProp5 = `5. ${orgCriterium5}`;
const organizationProp6 = `6. ${orgCriterium6}`;

const orgPropComb1 = ` ${organizationProp1}\n ${organizationProp2}\n`;
const orgPropComb2 = ` ${organizationProp3}\n ${organizationProp4}\n`;
const orgPropComb3 = ` ${organizationProp5}\n ${organizationProp6}\n`

const orgProps = `${orgPropComb1}${orgPropComb2}${orgPropComb3} \n\n `;

export const organizationCriteria = orgDescription + orgProps;
