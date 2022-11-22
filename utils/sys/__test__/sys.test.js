import { throwError } from "../sys.js";

jest.mock("../../logging/logger.js");

describe("numbers", () => {
  it("should throw error", () => {
    function throwErrorFn() {
      return throwError("Fire!");
    }

    expect(throwErrorFn).toThrowError();
  });
});
