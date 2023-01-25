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
let addItem, addItems;
let additionFixture, additionFixtures;
let additionExpectation, additionExpectations;
let additionTask, additionTasks;
let additionScene, additionScenes;
let additionRehearsals;

export let additionAuditions;

const add = (a, b) => a + b;

addItem = [add(1, 2), 3, expectToBe];
addItems = [addItem, [add(2, 3), 5, expectToBe]];

const addCallback = (fixture_) => add(fixture_.a, fixture_.b);

// Fixture-expectation tuple
additionFixture = { a: 1, b: 2 };
additionExpectation = 3;

// Fixture-expectation tuples
additionFixtures = [additionFixture, { a: 2, b: 3 }];
additionExpectations = [additionExpectation, 5];

// Script
setup = emptyCallback;
prepare = identityCallback;
teardown = emptyCallback;

// Single scene
additionTask = (resources) => buildTask(
                                addCallback(resources),
                                additionExpectation,
                                expectToBe
                              );

additionScene = buildScene(setup, prepare, additionTask, teardown);

// Multiple scenes
additionTasks = additionExpectations.map(
  (additionExpectation_) =>  {
    return (resources) => buildTask(
      addCallback(resources), additionExpectation_, expectToBe
    );
  }
);

additionScenes = additionTasks.map(
  (additionTask_) => buildScene(setup, prepare, additionTask_, teardown)
);

additionRehearsals = [
  buildRehearsal(
    "must sum numbers using assert",
    () => assert(addItem)
  ),
  buildRehearsal("must sum numbers using batchAtest", () =>
    batchAtest(additionFixtures, additionScenes)
  ),
  buildRehearsal(
    "must sum numbers using atest",
    () => atest(additionFixture, additionScene)),
    buildRehearsal(
    "must sum numbers using batchAtest",
    () => batchAtest(additionFixtures, additionScenes)
  )
];

additionAuditions = [buildAudition("add", () => rehearse(additionRehearsals))];
