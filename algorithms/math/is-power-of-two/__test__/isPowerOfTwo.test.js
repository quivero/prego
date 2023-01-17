import isPowerOfTwo from "../isPowerOfTwo";

let trivia, result, expected;

describe('isPowerOfTwo', () => {
  it('should check if the number is made by multiplying twos', () => {
    trivia = [
      [ isPowerOfTwo(-1),    false ],
      [ isPowerOfTwo(0),     false ],
      [ isPowerOfTwo(1),     true  ],
      [ isPowerOfTwo(2),     true  ],
      [ isPowerOfTwo(3),     false ],
      [ isPowerOfTwo(4),     true  ],
      [ isPowerOfTwo(5),     false ],
      [ isPowerOfTwo(6),     false ],
      [ isPowerOfTwo(7),     false ],
      [ isPowerOfTwo(8),     true  ],
      [ isPowerOfTwo(10),    false ],
      [ isPowerOfTwo(12),    false ],
      [ isPowerOfTwo(16),    true  ],
      [ isPowerOfTwo(31),    false ],
      [ isPowerOfTwo(64),    true  ],
      [ isPowerOfTwo(1024),  true  ],
      [ isPowerOfTwo(1023),  false ]
    ]
    
    for(const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });
});
