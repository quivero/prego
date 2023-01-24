import _ from "lodash";
import {
    assert,
    batchAssert,
    atest,
    batchAtest,
    buildAssertion,
    buildScenario
} from "../assertions";

const expectToBeDefined = (result) => expect(result).toBeDefined();
const expectToBe = (result, expected) => expect(result).toBe(expected);

/*-------------------------
 | assert design
 *-------------------------*/
export const assertFixtures = [
  [ 42, expectToBeDefined ],
  [ "42", "42", expectToBe ],
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
export let validAtestScenario;
let setup, prepare, exercise, teardown;

export let validAtestFixture = "42";
const resultFunction = (fixture_) => fixture_;
let expectedAtestResult = "42";

setup = () => {};

prepare = (fixture_) => fixture_;

exercise = (resources) => {
  return buildAssertion(
    resultFunction(resources),
    expectedAtestResult,
    (result, expected) => expect(result).toBe(expected),
  );
};

teardown = () => {};

validAtestScenario = buildScenario(setup, prepare, exercise, teardown);

/*-------------------------
 | assert design
 *-------------------------*/
const emptyCallback = () => {};
const identityCallback = (fixture_) => fixture_;
const add = (a, b) => a+b;

let addItem, addItems;
export let addScenes;

addItem = [
    add(1, 2), 3, expectToBe
];
addItems = [
    addItem,
    [ add(2, 3), 5, expectToBe ],
];

export let additionScenario_1, additionScenario_2;
let exercise_1, exercise_2;

const addCallback = (fixture_) => fixture_.a + fixture_.b;

export const additionFixture_1 = { a: 1, b: 2 };
export const additionFixture_2 = { a: 2, b: 3 };

const expectedAddResult_1 = 3;
const expectedAddResult_2 = 5;

setup = emptyCallback;
prepare = identityCallback;

exercise_1 = (resources) =>
  buildAssertion(addCallback(resources), expectedAddResult_1, expectToBe);
exercise_2 = (resources) =>
  buildAssertion(addCallback(resources), expectedAddResult_2, expectToBe);

teardown = emptyCallback;

additionScenario_1 = buildScenario(setup, prepare, exercise_1, teardown);
additionScenario_2 = buildScenario(setup, prepare, exercise_2, teardown);

addScenes = [
  [ "must sum numbers using assert", () => assert(addItem) ],
  [ "must sum numbers using batchAssert", () => batchAssert(addItems) ],
  [
    "must sum numbers using atest",
    () => atest(additionFixture_1, additionScenario_1),
  ],
  [
    "must sum numbers using batchAtest",
    () =>
      batchAtest(
        [ additionFixture_1, additionFixture_2 ],
        [ additionScenario_1, additionScenario_2 ],
      ),
  ],
];
