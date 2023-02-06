import { fulfill, isCondition } from "../artifacts";

describe("isCondition", () => {
    it("must throw TypeError on false condition", () => {
      const condition = 42 === "42"; // false
      const conditionCallback = (arg) => {};
      const args = {};
      const error_msg = "Wrong!";
      const errorClass = TypeError;

      const isConditionFn = () =>
        isCondition(condition, conditionCallback, args, error_msg, errorClass);

      expect(isConditionFn).toThrow(TypeError);
    });

    it("must throw Error on missing errorClass", () => {
      const condition = 42 === "42"; // false
      const conditionCallback = (arg) => arg;
      const args = 7;
      const error_msg = "Wrong!";

      const isConditionFn = () =>
        isCondition(condition, conditionCallback, args, error_msg);

        expect(isConditionFn).toThrow(Error);
    });

    it("must return on true condition", () => {
      const condition = 42 === 42; // true
      const conditionCallback = (arg) => arg;
      const args = 7;
      const error_msg = "Wrong!";
      const errorClass = Error;

      const result = isCondition(
        condition,
        conditionCallback,
        args,
        error_msg,
        errorClass
      );

      expect(result).toBe(args);
    });
    it("must return argument on true condition", () => {
      const condition = 42 === 42; // true
      const args = 7;
      const errorMsg = "It does not fulfill!";
      const errorClass = Error;

      const result = fulfill(args, condition, errorMsg, errorClass);

      expect(result).toBe(args);
    });
    it("must throw Error on false condition", () => {
      const condition = 42 !== 42; // false
      const args = 7;
      const errorMsg = "It does not fulfill!";
      const errorClass = TypeError;

      const fulfillWithErrorClassFn = () => fulfill(args, condition, errorMsg, errorClass);
      const fulfillWithoutErrorClassFn = () => fulfill(args, condition, errorMsg);

      expect(fulfillWithErrorClassFn).toThrow(TypeError);
      expect(fulfillWithoutErrorClassFn).toThrow(Error);
    });
  });
