import _ from "lodash";
import {
  assert,
  batchAssert,
  atest,
  batchAtest,
  buildExercise,
  buildScript,
  buildScene,
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
export let validAtestScript;
let setup, prepare, exercise, teardown;

export let validAtestFixture = "42";
const resultFunction = (fixture_) => fixture_;
let expectedAtestResult = "42";

setup = () => {};

prepare = (fixture_) => fixture_;

exercise = (resources) => {
  return buildExercise(
    resultFunction(resources),
    expectedAtestResult,
    (result, expected) => expect(result).toBe(expected)
  );
};

teardown = () => {};

validAtestScript = buildScript(setup, prepare, exercise, teardown);

/*-------------------------
 | assert design
 *-------------------------*/
const add = (a, b) => a + b;

let addItem, addItems;
export let addScenes, addRehearsals;

addItem = [add(1, 2), 3, expectToBe];
addItems = [addItem, [add(2, 3), 5, expectToBe]];

export let additionScript_1, additionScript_2;
let exercise_1, exercise_2;

const addCallback = (fixture_) => fixture_.a + fixture_.b;

export const additionFixture_1 = { a: 1, b: 2 };
export const additionFixture_2 = { a: 2, b: 3 };

const expectedAddResult_1 = 3;
const expectedAddResult_2 = 5;

setup = emptyCallback;
prepare = identityCallback;

exercise_1 = (resources) =>
  buildExercise(addCallback(resources), expectedAddResult_1, expectToBe);
exercise_2 = (resources) =>
  buildExercise(addCallback(resources), expectedAddResult_2, expectToBe);

teardown = emptyCallback;

additionScript_1 = buildScript(setup, prepare, exercise_1, teardown);
additionScript_2 = buildScript(setup, prepare, exercise_2, teardown);

addScenes = [
  buildScene("must sum numbers using assert", () => assert(addItem)),
  buildScene("must sum numbers using batchAssert", () => batchAssert(addItems)),
  buildScene("must sum numbers using batchAssert", () => batchAssert(addItems)),
  buildScene("must sum numbers using atest", () =>
    atest(additionFixture_1, additionScript_1)
  ),
  buildScene("must sum numbers using batchAtest", () => {
    const fixtures = [additionFixture_1, additionFixture_2];
    const scenarios = [additionScript_1, additionScript_2];

    batchAtest(fixtures, scenarios);
  }),
];

addRehearsals = [buildRehearsal("add", () => rehearse(addScenes))];
