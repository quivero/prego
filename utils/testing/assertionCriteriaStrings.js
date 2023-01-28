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
const bunwareDescription = "A bunware has the following characteristics \n\n"
  
const bunwareProp1 = "1. Type object;";
const bunwareProp2 = "2. Keys strings [\"setup\", \"prepare\", \"teardown\"];";
const bunwareProp3 = "3. Value types [\"function\", \"function\", \"function\"];";
const bunwareProp4 = "4. Value argument length [0, 1, 0];";
const bunwareProp5 = "5. Has return value [false, true, false];";

const bunwarePropComb1 = ` ${bunwareProp1}\n ${bunwareProp2}\n`;
const bunwarePropComb2 = ` ${bunwareProp3}\n ${bunwareProp4}\n`;
const bunwarePropComb3 = ` ${bunwareProp5}`

const bunwareProps = `${bunwarePropComb1}${bunwarePropComb2}${bunwarePropComb3} \n\n `; 

export const bunwareCriteria = bunwareDescription + bunwareProps;

