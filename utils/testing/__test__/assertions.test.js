
import { 
  assert, 
  batchAssert, 
  atest,
  batchAtest
} from '../assertions'

import { 
  assertFixtures,
  validAssertLength1Item,
  validAssertLength2Item,
  invalidAssertItemLength,
  invalidAssertCallbackItem ,
  validAtestFixture,
  validAtestScenario
} from './fixtures'

let fixtures, scenarios;

describe(
  'assert', 
  () => {
      it(
          'should assert on result-callback pattern', 
          () => {
              expect.assertions(1);
              assert(validAssertLength1Item);
          }
      );

      it(
          'should assert on result-expected-callback pattern', 
          () => {
              expect.assertions(1);
              assert(validAssertLength2Item);
          }
      );

      it(
          'should throw error on item with length different than 2 or 3', 
          () => {    
              const invalidArgumentFunction = () => assert(invalidAssertItemLength);
              expect(invalidArgumentFunction).toThrow(Error);
          }
      );

      it(
          'should throw error on invalid callback function', 
          () => {
              const invalidCallbackFunction = () => assert(invalidAssertCallbackItem);
              expect(invalidCallbackFunction).toThrow(Error);
          }
      );
  }
);

describe(
  'batchAssert', 
  () => {
      it(
          'should assert asserts in batch', 
          () => {
              expect.assertions(assertFixtures.length);
              batchAssert(assertFixtures)
          }
      )
  }
)

describe(
  'atest', 
  () => {
      it(
          'should assert atest', 
          () => atest(validAtestFixture, validAtestScenario)
      );
  }
);


describe(
  'batchAtest', 
  () => {
      it(
          'should assert atest', 
          () => {
              fixtures = [ validAtestFixture, validAtestFixture ];
              scenarios = [ validAtestScenario, validAtestScenario ]

              batchAtest(fixtures, scenarios)
          }
      )
  }
)
