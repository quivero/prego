import {
    expectToBeDefined,
    expectToBeUndefined,
    expectToHaveBeenCalled,
    expectToHaveReturned,
    expectToBeFalsy,
    expectToBeNull,
    expectToBeTruthy,
    expectToBeNaN,
    expectToBe,
    expectToBeEqual,
    expectToStrictEqual,
    expectToHaveBeenCalledTimes,
    expectToHaveReturnedTimes,
    expectToHaveReturnedWith,
    expectToHaveLastReturnedWith,
    expectToHaveLength,
    expectToContain,
    expectToContainEqual,
    expectToEqual,
    expectToBeGreaterThan,
    expectToBeGreaterThanOrEqual,
    expectToBeLessThan,
    expectToBeLessThanOrEqual,
    expectToBeInstanceOf,
    expectToMatch,
    expectToMatchObject
  } from "../expectTo"

  describe(
    "expectTo", 
    () => {
        it("assert defined values", () => expectToBeDefined(42))
        it("assert undefined values", () => expectToBeUndefined(undefined))
        it("assert toHaveReturned", 
        () => {
          const drink = jest.fn(() => true);
      
          drink();
          expectToHaveReturned(drink)
        })
        it("assert call and call number", 
          () => {
            const eat = jest.fn(() => false);
            const drink = jest.fn(() => true);
            const feast = (drinkCallback, eatCallback) => eatCallback() && drinkCallback();
            
            feast(eat, drink);
            
            expectToHaveBeenCalled(eat);
            expectToHaveBeenCalled(drink);
            expectToHaveBeenCalledTimes(eat, 1);
            expectToHaveBeenCalledTimes(drink, 1);
          }
        )
        it("assert returned times", () => {
            const drink = jest.fn(() => true);

            drink();
            drink();

            expectToHaveReturnedTimes(drink, 2);
        });
        it("assert returned value", () => {    
            const beverage = {name: 'La Croix'};
            const drink = jest.fn(beverage => beverage.name);
          
            drink(beverage);
          
            expectToHaveReturnedWith(drink, 'La Croix');
        });
        test('assert last returned value', () => {
            const beverage1 = {name: 'La Croix (Lemon)'};
            const beverage2 = {name: 'La Croix (Orange)'};
            const drink = jest.fn(beverage => beverage.name);
          
            drink(beverage1);
            drink(beverage2);
          
            expectToHaveLastReturnedWith(drink, 'La Croix (Orange)');
        });
        test('the house has my desired features', () => {
          const houseForSale = {
            bath: true,
            bedrooms: 4,
            kitchen: {
              amenities: ['oven', 'stove', 'washer'],
              area: 20,
              wallColor: 'white',
            },
          };
          const desiredHouse = {
            bath: true,
            kitchen: {
              amenities: ['oven', 'stove', 'washer'],
              wallColor: expect.stringMatching(/white|yellow/),
            },
          };
          
          expectToMatchObject(houseForSale, desiredHouse);
        });
        it("assert length", () => {
            expectToHaveLength([1, 2, 3], 3);
            expectToHaveLength('abc', 3);
            expectToHaveLength('', 0);
        });
        it("assert contain item", () => {
            expectToContain([1, 2, 3], 1);
        });
        it("assert contain equal item", () => {
          expectToContainEqual([1, {"foo": 'bar'}, 3], {"foo": 'bar'});
      });
        it("assert equality", () => expectToEqual(42, 42));
        it("assert greater than", () => expectToBeGreaterThan(42, 42-0.1));
        it("assert greater or equal than", () => expectToBeGreaterThanOrEqual(42, 42));
        it("assert less than", () => expectToBeLessThan(42, 42+0.1));
        it("assert less or equal than", () => expectToBeLessThanOrEqual(42, 42));
        it("assert less or equal than", () => expectToBeLessThanOrEqual(42, 42));
        it("assert instanceOf", () => {
            class A {}
            expectToBeInstanceOf(new A(), A);
            expectToBeInstanceOf(() => {}, Function);
        });
        it('assert match', () => {
            const long_string = 'the quick fox jumped over the lazy dog';
            
            expectToMatch(long_string, /lazy dog/);
            expectToMatch(long_string, new RegExp('lazy dog'));
          });
        it("assert truthy", () => expectToBeTruthy(true));
        it("assert falsy", () => expectToBeFalsy(false));
        it("assert null", () => expectToBeNull(null));
        it("assert NaN", () => expectToBeNaN(NaN));
        it("assert result toBe expectation", () => expectToBe(42, 42));
        it("assert result toBeEqual expectation", () => expectToBeEqual(42, 42));
        it("assert result toBeEqual expectation", () => expectToStrictEqual(42, 42));
    }
  );
  