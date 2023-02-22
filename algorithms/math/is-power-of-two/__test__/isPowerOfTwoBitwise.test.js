import { isPowerOfTwoBitwiseUseCases } from "./fixtures";

describe(
  "isPowerOfTwoBitwise", 
  () => {
    test.each(isPowerOfTwoBitwiseUseCases)(
      "should check if the number is made by multiplying twos", 
      (result, expected) => expect(result).toBe(expected)
    );
  }
);
