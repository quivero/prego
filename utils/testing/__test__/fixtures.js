import _ from "lodash";
import { zip } from "lodash";
import {
  assert,
  batchAssert,
  atest,
  batchAtest,
  buildScene,
  buildAct,
  buildAudition,
  buildRehearsal,
  rehearse,
  emptyCallback,
  identityCallback,
} from "../assertions";

import {
  expectToBeDefined,
  expectToBe
} from "../expectTo"

/*-------------------------
 | assert design
 *-------------------------*/
export const assertFixtures = [
  [42, expectToBeDefined],
  ["42", expectToBe, "42"],
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
export let validAtestAct;
let setup, prepare, perform, teardown;

export let validAtestFixture = "42";
const resultFunction = (fixture_) => fixture_;
let expectedAtestResult = "42";

setup = emptyCallback;

prepare = (fixture_) => fixture_;

perform = (resources) => {
  const assertItem = [
    resultFunction(resources),
    expectToBe,
    expectedAtestResult,
  ];

  return [buildScene(assertItem)];
};

teardown = emptyCallback;

validAtestAct = buildAct(setup, prepare, perform, teardown);

/*-------------------------
 | assert design
 *-------------------------*/
const add = (a, b) => a + b;
const addCallback = (fixture) => add(fixture.a, fixture.b);

let addItem, addItems;

addItem = [add(1, 2), expectToBe, 3];
addItems = [addItem, [add(2, 3), expectToBe, 5]];

export let additionFixtures;
export let additionScenes;
export let additionAuditions;

let oneToOneAdditionFixture,
  oneToManyAdditionFixture,
  manyToOneAdditionFixture,
  manyToManyAdditionFixture;

let oneToOneAdditionPerform,
  oneToManyAdditionPerform,
  manyToOneAdditionPerform,
  manyToManyAdditionPerform;

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

let additionRehearsals;

// TODO?: Follow these sketch-guidelines to proceed:
// 1. (
//   fixtures,
//   sceneScripts=(setup, prepare, perform, teardown),
//   sceneIntentions=(assertioMap, ?expectation)
// ) --> tasks --> scenes --> rehearsal
//     a. resource: (
//         script: (setup, prepare, perform, teardown)
//         assertioMap, ?expectation
//     )
//     b. taskCallback: (resource) => buildScene(
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
oneToManyAdditionFixture = [oneToOneAdditionFixture, { a: 2, b: 3 }];
manyToOneAdditionFixture = [
  [oneToOneAdditionFixture],
  [oneToOneAdditionFixture],
];
manyToManyAdditionFixture = [
  oneToManyAdditionFixture,
  oneToManyAdditionFixture,
];

// Expectations
oneToOneAdditionExpectation = 3;
oneToManyAdditionExpectation = [oneToOneAdditionExpectation, 5];
oneToManyAdditionExpectation = [
  [oneToOneAdditionExpectation],
  [oneToOneAdditionExpectation],
];
manyToManyAdditionExpectation = [
  oneToManyAdditionExpectation,
  oneToManyAdditionExpectation,
];

// Assertion maps
oneToOneAdditionAssertionMap = expectToBe;
oneToManyAdditionAssertionMap = [expectToBe, expectToBe];
manyToOneAdditionAssertionMap = [
  [oneToOneAdditionAssertionMap],
  [oneToOneAdditionAssertionMap],
];
manyToManyAdditionAssertionMap = [
  oneToManyAdditionAssertionMap,
  oneToManyAdditionAssertionMap,
];

// Perform callbacks
oneToOneAdditionPerform = (augmented_fixture_) => [
  add(augmented_fixture_.a, augmented_fixture_.b),
  oneToOneAdditionAssertionMap,
  oneToOneAdditionExpectation,
];

oneToManyAdditionPerform = (augmented_fixture_) =>
  zip(
    augmented_fixture_.map(addCallback),
    oneToManyAdditionAssertionMap,
    oneToManyAdditionExpectation
  );

manyToOneAdditionPerform = [oneToOneAdditionPerform, oneToOneAdditionPerform];

manyToManyAdditionPerform = [
  oneToManyAdditionPerform,
  oneToManyAdditionPerform,
];

// Ideas:
// 1. Wrap (setup, prepare, teardown) to new-defined concept "bunware"
// 2. Set (setup, prepare, teardown) default to (emptyCallback, identityCallback, emptyCallback)
// 3. Break map "perform" on task into to new-defined concepts "acts" and "performance"

// Scripts
setup = emptyCallback;
prepare = identityCallback;
teardown = emptyCallback;

// // Scenes
// oneToOneAdditionScene = buildScene(setup, prepare,  oneToOneAdditionPerform, teardown);
// oneToManyAdditionScene = buildScene(setup, prepare, oneToManyAdditionPerform, teardown);
// manyToOneAdditionScene = buildScene(setup, prepare,  manyToOneAdditionTask, teardown);
// manyToManyAdditionScene = buildScene(setup, prepare, manyToManyAdditionTask, teardown);

// // Multiple scenes with single assertion
// additionTasks = additionExpectations.map(
//   (additionExpectation_) =>  {
//     return (augmented_fixture) => buildScene(
//       addCallback(augmented_fixture), expectToBe, additionExpectation_
//       );
//   }
// );

// additionScenes = additionTasks.map(
//   (task) => buildScene(setup, prepare, task, teardown)
// );

additionRehearsals = [
  buildRehearsal("must sum numbers using assert", () => assert(addItem)),
  buildRehearsal("must sum numbers using batchAssert", () =>
    batchAssert(addItems)
  ),
  buildRehearsal("must sum numbers using atest", () =>
    atest(oneToOneAdditionFixture, oneToOneAdditionScene)
  ),
  buildRehearsal("must sum numbers using batchAtest", () =>
    batchAtest(oneToManyAdditionFixture, oneToManyAdditionScene)
  ),
];

// additionAuditions = [buildAudition("add", additionRehearsals)];
