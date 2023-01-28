import { throwError, typeOf, warn, isCondition } from "../sys.js";
import { log_message } from "#utils/logging/logger.js";

jest.mock("#utils/logging/logger.js");

let expected, result, trivia;

describe("throwError/warn", () => {
  it("should throw error", () => {
    const throwErrorFn = () => {
      return throwError("Fire!");
    }

    expect(throwErrorFn).toThrowError();
  });

  it("should warn a message", () => {
    warn("It is warm.");

    expect(log_message).toHaveBeenCalled();
  });
});

describe(
  "throwError/warn", 
  () => {
    it("should return data types", () => {
      trivia = [
        [typeOf("string"), "string"],
        [typeOf(42), "number"],
        [typeOf({}), "object"],
        [typeOf(() => {}), "function"],
        [typeOf(null), "null"],
      ];
    
      for (const item of trivia) {
        result = item[0];
        expected = item[1];
    
        expect(result).toBe(expected);
      }
    });
  }
);

describe(
  "isCondition", () => {
    it("should throw TypeError on false condition", () => {
      const condition = 42 === '42'; // false
      const conditionCallback = (arg) => {};
      const args = {};
      const error_msg = 'Wrong!';
      const errorClass = TypeError;
      
      const isConditionFn = () => isCondition(
        condition, conditionCallback, args, error_msg, errorClass
      );
      
      expect(isConditionFn).toThrowError(TypeError);
    });
  
    it("should throw Error on missing errorClass", () => {
      const condition = 42 === '42'; // false
      const conditionCallback = (arg) => arg;
      const args = 7;
      const error_msg = 'Wrong!';
      
      const isConditionFn = () => isCondition(
        condition, conditionCallback, args, error_msg
      );
      
      expect(isConditionFn).toThrowError(Error);
    });

    it("should return on true condition", () => {
      const condition = 42 === 42; // true
      const conditionCallback = (arg) => arg;
      const args = 7;
      const error_msg = 'Wrong!';
      const errorClass = Error;
      
      const result = isCondition(
        condition, conditionCallback, args, error_msg, errorClass
      );

      expect(result).toBe(args);
    });
  }
)