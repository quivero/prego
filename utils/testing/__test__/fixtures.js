import _ from "lodash";
import {
  assert,
  batchAssert,
  atest,
  batchAtest,
  buildTask,
  buildScene,
  buildAudition,
  buildRehearsal,
  rehearse,
  emptyCallback,
  identityCallback,
} from "../assertions";

const expectToBeDefined = (result) => expect(result).toBeDefined();
const expectToBe = (result, expected) => expect(result).toBe(expected);

/*-------------------------
 | assert design
 *-------------------------*/
export const assertFixtures = [
  [42, expectToBeDefined],
  ["42", "42", expectToBe],
];

// Valid samples
export const validAssertLength1Item = assertFixtures[0];
export const validAssertLength2Item = assertFixtures[1];

// Error-prone samples
export const invalidAssertItemLength = ["42"];
export const invalidAssertCallbackItem = ["42", "42"];

/*-------------------------
 | atest design
 *-------------------------*/
export let validAtestScene;
let setup, prepare, perform, teardown;

export let validAtestFixture = "42";
const resultFunction = (fixture_) => fixture_;
let expectedAtestResult = "42";

setup = emptyCallback;

prepare = (fixture_) => fixture_;

perform = (resources) => {
  return buildTask(
    resultFunction(resources),
    expectedAtestResult,
    (result, expected) => expect(result).toBe(expected)
  );
};

teardown = emptyCallback;

validAtestScene = buildScene(setup, prepare, perform, teardown);

/*-------------------------
 | assert design
 *-------------------------*/
const add = (a, b) => a + b;

let addItem, addItems;

addItem = [add(1, 2), 3, expectToBe];
addItems = [addItem, [add(2, 3), 5, expectToBe]];

export let additionFixtures;
export let additionScenes;
export let additionAuditions;

let oneToOneAdditionFixture,  
    oneToManyAdditionFixture,  
    manyToOneAdditionFixture,  
    manyToManyAdditionFixture;

let oneToOneAdditionCallback,
    oneToManyAdditionCallback,  
    manyToOneAdditionCallback, 
    manyToManyAdditionCallback; 

let oneToOneAdditionTask, 
    oneToManyAdditionTask, 
    manyToOneAdditionTask, 
    manyToManyAdditionTask;

let oneToOneAdditionExpectation,
    oneToManyAdditionExpectation,
    manyToOneAdditionExpectation,
    manyToManyAdditionExpectation;

let oneToOneAdditionAssertionMap,
    oneToManyAdditionAssertionMap,
    manyToOneAdditionAssertionMap,
    manyToManyAdditionAssertionMap;

let oneToOneAdditionScene,
    oneToManyAdditionScene,
    manyToOneAdditionScene,
    manyToManyAdditionScene;

let assertionMap, assertionMaps;

let additionRehearsals;

// TODO: Follow these sketch-guidelines to proceed:
// 1. (
//   fixtures,
//   sceneScripts=(setup, prepare, perform, teardown), 
//   sceneIntentions=(assertioMap, ?expectation)
// ) --> tasks --> scenes --> rehearsal
//     a. resource: (
//         script: (setup, prepare, perform, teardown)
//         assertioMap, ?expectation
//     )
//     b. taskCallback: (resource) => buildTask(
//          resource.script.perform(resource.fixture), 
//          resource.assertionMap, 
//          resource.expectation
//     }
//     c. task: (taskCallback, assertionMap, ?expectation)
//     d. scene: (sceneScript, task)
//       rehearsalCallback: () => batchAtest(scenes);
//     e. rehearsal: (description, rehearsalCallback)
//     f. auditionCallback: () => rehearse(rehearsals)
//     g. audition: (name, auditionCallback)

// Fixtures
oneToOneAdditionFixture = { a: 1, b: 2 };
oneToManyAdditionFixture = [oneToOneAdditionFixture , { a: 2, b: 3 }];
manyToOneAdditionFixture = [ [oneToOneAdditionFixture], [oneToOneAdditionFixture] ];
manyToManyAdditionFixture = [ oneToManyAdditionFixture, oneToManyAdditionFixture ];

// Expectations
oneToOneAdditionExpectation = 3;
oneToManyAdditionExpectation = [oneToOneAdditionExpectation, 5];
oneToManyAdditionExpectation = [ [oneToOneAdditionExpectation], [oneToOneAdditionExpectation] ];
manyToManyAdditionExpectation = [ oneToManyAdditionExpectation, oneToManyAdditionExpectation ];

// Perform callbacks
oneToOneAdditionCallback = (fixture_) => add(fixture_.a, fixture_.b);
oneToManyAdditionCallback = (fixture_) => fixture_.map((value) => add(value.a, value.b));
manyToOneAdditionCallback = [oneToOneAdditionCallback, oneToOneAdditionCallback];
manyToManyAdditionCallback = [oneToManyAdditionCallback, oneToManyAdditionCallback];

// Assertion maps
oneToOneAdditionAssertionMap = expectToBe;
oneToManyAdditionAssertionMap = [expectToBe, expectToBe];
manyToOneAdditionAssertionMap = [[oneToOneAdditionAssertionMap], [oneToOneAdditionAssertionMap]];
manyToManyAdditionAssertionMap = [oneToManyAdditionAssertionMap, oneToManyAdditionAssertionMap];

// Tasks
oneToOneAdditionTask = (resources) => buildTask(
      oneToOneAdditionCallback(resources), 
      oneToOneAssertionMap, 
      oneToOneAdditionExpectation
);
oneToManyAdditionTask = (resources) => buildTask(
  oneToManyAdditionCallback(resources), 
  oneToManyAssertionMap, 
  oneToManyAdditionExpectation
);
manyToOneAdditionTask = (resources) => buildTask(
  manyToOneAdditionCallback(resources), 
  manyToOneAssertionMap, 
  manyToOneAdditionExpectation
);
manyToManyAdditionTask = (resources) => buildTask(
  manyToManyAdditionCallback(resources), 
  manyToManyAssertionMap, 
  manyToManyAdditionExpectation
);

// Ideas: 
// 1. Wrap (setup, prepare, teardown) to new-defined concept "bunware"
// 2. Set (setup, prepare, teardown) default to (emptyCallback, identityCallback, emptyCallback)

// Scripts
setup = emptyCallback;
prepare = identityCallback;
teardown = emptyCallback;

// // Scenes
// oneToOneAdditionScene = buildScene(setup, prepare,  oneToOne AdditionTask, teardown);
// oneToManyAdditionScene = buildScene(setup, prepare, oneToManyAdditionTask, teardown);
// manyToOneAdditionScene = buildScene(setup, prepare,  manyToOneAdditionTask, teardown);
// manyToManyAdditionScene = buildScene(setup, prepare, manyToManyAdditionTask, teardown);

// // Multiple scenes with single assertion
// additionTasks = additionExpectations.map(
//   (additionExpectation_) =>  {
//     return (augmented_fixture) => buildTask(
//       addCallback(augmented_fixture), expectToBe, additionExpectation_
//       );
//   }
// );

// additionScenes = additionTasks.map(
//   (task) => buildScene(setup, prepare, task, teardown)
// );

additionRehearsals = [
  buildRehearsal(
    "must sum numbers using assert", 
    () => assert(addItem)
  ),
  buildRehearsal(
    "must sum numbers using batchAssert", 
    () => batchAssert(addItems)
  ),
  buildRehearsal(
    "must sum numbers using atest",
    () => atest(oneToOneAdditionFixture, oneToOneAdditionScene)
  ),
    buildRehearsal(
    "must sum numbers using batchAtest",
    () => batchAtest(oneToManyAdditionFixture, oneToManyAdditionScene)
  )
];

// additionAuditions = [buildAudition("add", () => rehearse(additionRehearsals))];
