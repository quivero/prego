import { codify, decodify, generateToken } from "../string.js";

describe("string", () => {
  it("should return a hash with given length", () => {
    expect(generateToken(10).length).toBe(10);
  });

  it("should codify and decodify a string", () => {
    expect(codify("42")).toBe("NDI=");
    expect(decodify("NDI=")).toBe("42");
  });
});
