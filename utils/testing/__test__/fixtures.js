import _ from 'lodash'
import {
    buildAssertion,
    buildScenario,
    batchAssert
} from '../assertions'

/*
 * assert fixtures
 */
export const assertFixtures = [
    [ 42,         (result) => expect(result).toBeDefined()            ],
    [ "42", "42", (result, expected) => expect(result).toBe(expected) ],
];

// Valid samples
export const validAssertLength1Item = assertFixtures[0];
export const validAssertLength2Item = assertFixtures[1];

// Error-prone samples
export const invalidAssertItemLength = [ '42' ];
export const invalidAssertCallbackItem = [ '42', '42' ];

/*
 * atest fixtures
 */
export let validAtestScenario;
let setup, prepare, exercise, verify, teardown;

export let validAtestFixture = '42';
const resultFunction = (fixture_) => fixture_;
let expectedAtestResult = '42';

setup = () => {};

prepare = (fixture_) => fixture_;

exercise = (resources) => {
    return buildAssertion(
        resultFunction(resources),
        expectedAtestResult,
        (result, expected) => expect(result).toBe(expected)
    );
};

teardown = () => {};

validAtestScenario = buildScenario(setup, prepare, exercise, teardown);
