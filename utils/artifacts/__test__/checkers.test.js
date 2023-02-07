import { isExtensionOf } from "../checkers";

let result, expectation;

describe("isExtensionOf", () => {
  it("must assert TypeError as Error extension", () => {
    result = isExtensionOf(TypeError, Error);
    expectation = true;

    expect(result).toBe(expectation);
  });
});
