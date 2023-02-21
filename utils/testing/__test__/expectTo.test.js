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
  expectToMatchObject,
  expectToHaveProperty,
  expectToBeCloseTo,
  expectToHaveBeenLastCalledWith,
  expectToHaveBeenCalledWith,
  expectToHaveBeenNthCalledWith,
  notArrayContainingAsyMatch,
  closeToAsyMatch,
  stringContainingAsyMatch,
  arrayContainingAsyMatch,
  objectContainingAsyMatch,
  anyAsyMatch,
  notObjectContainingAsyMatch,
  notStringContainingAsyMatch,
  stringMatchingAsyMatch,
  notStringMatchingAsyMatch,
  expectToThrow,
} from "../expectTo";

let candidate, expectation;

describe("expectTo", () => {
  it("assert defined values", () => expectToBeDefined(42));
  it("assert undefined values", () => expectToBeUndefined(undefined));
  it("assert toHaveReturned", () => {
    const drink = jest.fn(() => true);

    drink();
    expectToHaveReturned(drink);
  });
  it("assert call and call number", () => {
    const eat = jest.fn(() => false);
    const drink = jest.fn(() => true);
    const feast = (drinkCallback, eatCallback) =>
      eatCallback() && drinkCallback();

    feast(eat, drink);

    expectToHaveBeenCalled(eat);
    expectToHaveBeenCalled(drink);
    expectToHaveBeenCalledTimes(eat, 1);
    expectToHaveBeenCalledTimes(drink, 1);
  });
  it("assert returned times", () => {
    const drink = jest.fn(() => true);

    drink();
    drink();

    expectToHaveReturnedTimes(drink, 2);
  });
  it("assert returned value", () => {
    const beverage = { name: "La Croix" };
    const drink = jest.fn((beverage) => beverage.name);

    drink(beverage);

    expectToHaveReturnedWith(drink, "La Croix");
  });
  test("assert last returned value", () => {
    const beverage1 = { name: "La Croix (Lemon)" };
    const beverage2 = { name: "La Croix (Orange)" };
    const drink = jest.fn((beverage) => beverage.name);

    drink(beverage1);
    drink(beverage2);

    expectToHaveLastReturnedWith(drink, "La Croix (Orange)");
  });
  test("the house has my desired features", () => {
    const houseForSale = {
      bath: true,
      bedrooms: 4,
      kitchen: {
        amenities: ["oven", "stove", "washer"],
        area: 20,
        wallColor: "white",
      },
    };
    const desiredHouse = {
      bath: true,
      kitchen: {
        amenities: ["oven", "stove", "washer"],
        wallColor: expect.stringMatching(/white|yellow/),
      },
    };

    expectToMatchObject(houseForSale, desiredHouse);
  });
  it("assert error throw", () => {
    const errorThrower = () => {
      throw Error("Fire!");
    };

    expectToThrow(errorThrower, Error);
  });

  it("assert asymmetric objectContaining matcher", () => {
    // Source: https://stackoverflow.com
    // Route: /questions/45692456/whats-the-difference-between-tomatchobject-and-objectcontaining

    candidate = { position: { x: 0, y: 0 } };

    // objectContaining, with nested object, containing full props/values
    expectation = objectContainingAsyMatch({
      position: { x: anyAsyMatch(Number), y: anyAsyMatch(Number) },
    });

    expectToEqual(candidate, expectation);

    // objectContaining, with nested object, containing partial props/values
    expectToEqual(
      candidate,
      notObjectContainingAsyMatch({ position: { x: expect.any(Number) } })
    );

    // objectContaining, with nested object, also declared with objectContaining,
    // containing partial props/values
    expectation = objectContainingAsyMatch({
      position: objectContainingAsyMatch({ x: anyAsyMatch(Number) }),
    });

    expectToEqual(candidate, expectation);
  });

  it("assert length", () => {
    expectToHaveLength([1, 2, 3], 3);
    expectToHaveLength("abc", 3);
    expectToHaveLength("", 0);
  });
  it("assert contain item", () => {
    expectToContain([1, 2, 3], 1);
  });
  it("assert contain equal item", () => {
    expectToContainEqual([1, { foo: "bar" }, 3], { foo: "bar" });
  });
  it("assert equality", () => expectToEqual(42, 42));
  it("assert greater than", () => expectToBeGreaterThan(42, 42 - 0.1));
  it("assert greater or equal than", () =>
    expectToBeGreaterThanOrEqual(42, 42));
  it("assert less than", () => expectToBeLessThan(42, 42 + 0.1));
  it("assert less or equal than", () => expectToBeLessThanOrEqual(42, 42));
  it("assert less or equal than", () => expectToBeLessThanOrEqual(42, 42));
  it("assert instanceOf", () => {
    class A {}
    expectToBeInstanceOf(new A(), A);
    expectToBeInstanceOf(() => {}, Function);
  });
  it("assert match", () => {
    const long_string = "the quick fox jumped over the lazy dog";

    expectToMatch(long_string, /lazy dog/);
    expectToMatch(long_string, new RegExp("lazy dog"));
  });
  it("assert truthy", () => expectToBeTruthy(true));
  it("assert falsy", () => expectToBeFalsy(false));
  it("assert null", () => expectToBeNull(null));
  it("assert NaN", () => expectToBeNaN(NaN));
  it("assert candidate toBe expectation", () => expectToBe(42, 42));
  it("assert candidate toBeEqual expectation", () => expectToBeEqual(42, 42));
  it("assert candidate toBeEqual expectation", () =>
    expectToStrictEqual(42, 42));
  it("assert candidate expectToHaveProperty expectation", () => {
    const object = { a: 1, b: 2 };

    expectToHaveProperty(object, "a");
    expectToHaveProperty(object, "b");
  });
  it("assert candidate toBeEqual expectation", () =>
    expectToBeCloseTo(3.14, 3.15, 1));
  it("assert call with on argument", () => {
    const functionCaller = (functionCall, arg) => {
      functionCall(arg);
    };

    const string = "ackbar";
    const f = jest.fn();

    functionCaller(f, string);

    expectToHaveBeenCalledWith(f, string);
  });
  it("assert last call with on argument", () => {
    const functionCaller = (functionCall, arg_1, arg_2) => {
      functionCall(arg_1);
      functionCall(arg_2);
    };

    const string_1 = "ackbar";
    const string_2 = "Boba Fett";

    const f = jest.fn();

    functionCaller(f, string_1, string_2);

    expectToHaveBeenLastCalledWith(f, string_2);
  });
  it("assert Nth call with argument", () => {
    const functionCaller = (functionCall, arg_1, arg_2) => {
      functionCall(arg_1);
      functionCall(arg_2);
    };

    const string_1 = "ackbar";
    const string_2 = "Boba Fett";

    const expectation_1 = { callIndex: 1, args: [string_1] };
    const expectation_2 = { callIndex: 2, args: [string_2] };

    const f = jest.fn();

    functionCaller(f, string_1, string_2);

    expectToHaveBeenNthCalledWith(f, expectation_1);
    expectToHaveBeenNthCalledWith(f, expectation_2);
  });
  it("assert Nth call with argument", () => {
    const functionCaller = (functionCall, arg_1, arg_2) => {
      functionCall(arg_1);
      functionCall(arg_2);
    };

    const string_1 = "ackbar";
    const string_2 = "Boba Fett";

    const expectation_1 = { callIndex: 1, args: [string_1] };
    const expectation_2 = { callIndex: 2, args: [string_2] };

    const f = jest.fn();

    functionCaller(f, string_1, string_2);

    expectToHaveBeenNthCalledWith(f, expectation_1);
    expectToHaveBeenNthCalledWith(f, expectation_2);
  });
  it("assert asymmetric matcher", () => {
    candidate = {
      title: "0.1 + 0.2",
      sum: 0.1 + 0.2,
    };

    expectation = {
      title: "0.1 + 0.2",
      sum: closeToAsyMatch(0.3, 5),
    };

    expectToEqual(candidate, expectation);
  });
  it("assert asymmetric matcher arrayContainingAsyMatch", () => {
    candidate = ["Alice", "Bob", "Charlie"];

    for (const name of candidate) {
      expectToEqual(candidate, arrayContainingAsyMatch([name]));
    }
  });
  it("assert asymmetric matcher notArrayContainingAsyMatch", () => {
    candidate = ["Alice", "Bob", "Charlie"];
    expectation = notArrayContainingAsyMatch(["Denise"]);

    expectToEqual(candidate, expectation);
  });
  it("assert asymmetric matcher stringContainingAsyMatch", () => {
    candidate = "Hello world!";
    expectation = stringContainingAsyMatch("world");

    expectToEqual(candidate, expectation);
  });
  it("assert asymmetric matcher stringContainingAsyMatch", () => {
    candidate = "Hello world!";
    expectation = notStringContainingAsyMatch("Mars");

    expectToEqual(candidate, expectation);
  });
  it("assert asymmetric matcher notObjectContainingAsyMatch", () => {
    candidate = { bar: "baz" };
    expectation = { foo: anyAsyMatch(String) };

    expectToEqual(candidate, notObjectContainingAsyMatch(expectation));
  });
  it("assert asymmetric matcher stringMatchingAsyMatch", () => {
    candidate = "Hello world!";
    expectation = stringMatchingAsyMatch("world");

    expectToEqual(candidate, expectation);
  });
  it("assert asymmetric matcher notStringMatchingAsyMatch", () => {
    candidate = "Hello world!";
    expectation = notStringMatchingAsyMatch("Mars");

    expectToEqual(candidate, expectation);
  });
});
