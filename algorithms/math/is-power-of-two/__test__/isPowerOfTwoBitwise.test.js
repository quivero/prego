import isPowerOfTwoBitwise from "../isPowerOfTwoBitwise";

let trivia, expected, result;

describe("isPowerOfTwoBitwise", () => {
  it("should check if the number is made by multiplying twos", () => {
    trivia = [
      [ isPowerOfTwoBitwise(-1),   false ],
      [ isPowerOfTwoBitwise(0),    false ],
      [ isPowerOfTwoBitwise(1),    true  ],
      [ isPowerOfTwoBitwise(2),    true  ],
      [ isPowerOfTwoBitwise(3),    false ],
      [ isPowerOfTwoBitwise(4),    true  ],
      [ isPowerOfTwoBitwise(5),    false ],
      [ isPowerOfTwoBitwise(6),    false ],
      [ isPowerOfTwoBitwise(7),    false ],
      [ isPowerOfTwoBitwise(8),    true  ],
      [ isPowerOfTwoBitwise(10),   false ],
      [ isPowerOfTwoBitwise(12),   false ],
      [ isPowerOfTwoBitwise(16),   true  ],
      [ isPowerOfTwoBitwise(31),   false ],
      [ isPowerOfTwoBitwise(64),   true  ],
      [ isPowerOfTwoBitwise(1024), true  ],
      [ isPowerOfTwoBitwise(1023), false ],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });
});
