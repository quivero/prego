import _ from "lodash";
import { zip } from "lodash";
import { assert, batchAssert, atest } from "../assertions";
import {
  buildScene, buildOrganization, buildAct, buildRehearsal, buildPlay,
} from "../build";

import { emptyCallback, identityCallback } from "../defaults";

import { expectToBeDefined, expectToBe } from "../expectTo";

/*-------------------------
 | assert design
 *-------------------------*/
export const assertFixtures = [
  [42, expectToBeDefined],
  ["42", expectToBe, "42"],
];

// Valid samples
export const validAssertLength2Item = assertFixtures[0];
export const validAssertLength3Item = assertFixtures[1];

// Error-prone samples
export const invalidAssertItemLength = ["42"];
export const invalidAssertCallbackItem = ["42", "42"];

/*-------------------------
 | atest design
 *-------------------------*/
export let validAtestAct;
let setup, prepare, perform, teardown, organization;

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

organization = buildOrganization(setup, prepare, teardown);
validAtestAct = buildAct(perform, organization);

export const validOrganizations = [
  {},
  { setup: () => {} },
  { prepare: (x) => x },
  { teardown: () => {} },
  { setup: () => {}, prepare: (x) => x },
  { setup: () => {}, teardown: () => {} },
  { prepare: () => {}, teardown: () => {} },
  { setup: () => {}, prepare: (x) => x, teardown: () => {} }
];

export const invalidOrganization = { setup_: () => {} };
export const invalidOrganizations = [...validOrganizations, invalidOrganization];

/*-------------------------
 | assert design
 *-------------------------*/
const add = (a, b) => a + b;
const addCallback = (fixture) => add(fixture.a, fixture.b);

let addItem, addItems;

addItem = [ add(1, 2), expectToBe, 3 ];
addItems = [addItem, [ add(2, 3), expectToBe, 5 ]];

export let additionFixtures;
export let additionScenes;
export let additionPlays;

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

// Fixtures
oneToOneAdditionFixture = { a: 1, b: 2 };
oneToManyAdditionFixture = [ oneToOneAdditionFixture, { a: 2, b: 3 } ];
manyToOneAdditionFixture = [
  [oneToOneAdditionFixture], [oneToOneAdditionFixture],
];
manyToManyAdditionFixture = [
  oneToManyAdditionFixture, oneToManyAdditionFixture,
];

// Expectations
oneToOneAdditionExpectation = 3;
oneToManyAdditionExpectation = [ oneToOneAdditionExpectation, 5 ];
oneToManyAdditionExpectation = [
  [oneToOneAdditionExpectation], [oneToOneAdditionExpectation],
];
manyToManyAdditionExpectation = [
  oneToManyAdditionExpectation, oneToManyAdditionExpectation,
];

// Assertion maps
oneToOneAdditionAssertionMap = expectToBe;
oneToManyAdditionAssertionMap = [ expectToBe, expectToBe ];
manyToOneAdditionAssertionMap = [
  [ oneToOneAdditionAssertionMap ], [ oneToOneAdditionAssertionMap ],
];
manyToManyAdditionAssertionMap = [
  oneToManyAdditionAssertionMap,
  oneToManyAdditionAssertionMap,
];

// Perform callbacks
oneToOneAdditionPerform = (augmented_fixture_) => [
  add(augmented_fixture_.a, augmented_fixture_.b),
  oneToOneAdditionAssertionMap, oneToOneAdditionExpectation,
];

oneToManyAdditionPerform = (augmented_fixture_) =>
  zip(
    augmented_fixture_.map(addCallback),
    oneToManyAdditionAssertionMap, oneToManyAdditionExpectation
  );

manyToOneAdditionPerform = [ oneToOneAdditionPerform, oneToOneAdditionPerform ];

manyToManyAdditionPerform = [ oneToManyAdditionPerform, oneToManyAdditionPerform, ];

// Scripts
setup = emptyCallback;
prepare = identityCallback;
teardown = emptyCallback;

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
  )
];

additionPlays = [
  buildPlay("add", additionRehearsals)
];
