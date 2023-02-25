import { reporter, log_message, log } from "../logging/logger.js";
import _ from "lodash";

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const throwError = (msg) => {
  log_message(reporter, "error", msg);
  throw Error(msg);
};

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const warn = (msg) => log("warn", msg);

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const raise = (msg, errorClass=Error) => {
  log("error", msg);
  throw new errorClass(msg);
};

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const report = (msg) => log("info", msg);

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const joke = (msg) => log("silly", msg);

export const typeOf = (value) => {
  const type = typeof value;

  switch (type) {
    case "object":
      return value === null
        ? "null"
        : _.lowerCase(
            Object.prototype.toString.call(value).match(/^\[object (.*)\]$/)[1]
          );

    case "function":
      return "function";

    default:
      return type;
  }
};
