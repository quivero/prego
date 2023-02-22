import isPowerOfTwo from "../isPowerOfTwo";
import isPowerOfTwoBitwise from "../isPowerOfTwoBitwise";

export const isPowerOfTwoUseCases = [
  [isPowerOfTwo(-1), false],
  [isPowerOfTwo(0), false],
  [isPowerOfTwo(1), true],
  [isPowerOfTwo(2), true],
  [isPowerOfTwo(3), false],
  [isPowerOfTwo(4), true],
  [isPowerOfTwo(5), false],
  [isPowerOfTwo(6), false],
  [isPowerOfTwo(7), false],
  [isPowerOfTwo(8), true],
  [isPowerOfTwo(10), false],
  [isPowerOfTwo(12), false],
  [isPowerOfTwo(16), true],
  [isPowerOfTwo(31), false],
  [isPowerOfTwo(64), true],
  [isPowerOfTwo(1024), true],
  [isPowerOfTwo(1023), false],
]

export const isPowerOfTwoBitwiseUseCases = [
  [isPowerOfTwoBitwise(-1), false],
  [isPowerOfTwoBitwise(0), false],
  [isPowerOfTwoBitwise(1), true],
  [isPowerOfTwoBitwise(2), true],
  [isPowerOfTwoBitwise(3), false],
  [isPowerOfTwoBitwise(4), true],
  [isPowerOfTwoBitwise(5), false],
  [isPowerOfTwoBitwise(6), false],
  [isPowerOfTwoBitwise(7), false],
  [isPowerOfTwoBitwise(8), true],
  [isPowerOfTwoBitwise(10), false],
  [isPowerOfTwoBitwise(12), false],
  [isPowerOfTwoBitwise(16), true],
  [isPowerOfTwoBitwise(31), false],
  [isPowerOfTwoBitwise(64), true],
  [isPowerOfTwoBitwise(1024), true],
  [isPowerOfTwoBitwise(1023), false],
]