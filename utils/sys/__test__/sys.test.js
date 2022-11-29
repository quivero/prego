import { throwError, typeOf, warn } from "../sys.js";
import { log_message } from "../../logging/logger.js";

jest.mock("../../logging/logger.js");

describe("sys", () => {
  it("should throw error", () => {
    function throwErrorFn() {
      return throwError("Fire!");
    }

    expect(throwErrorFn).toThrowError();
  });

  it("should warn a message", () => {
    warn("It is warm.")

    expect(log_message).toHaveBeenCalled();
  });

  it("should return data types", () => {
    expect(typeOf('string')).toBe('string');
    expect(typeOf(42)).toBe('number');
    expect(typeOf({})).toBe('object');
    expect(typeOf(() => {})).toBe('function');
    expect(typeOf(null)).toBe('null');
  });
});
