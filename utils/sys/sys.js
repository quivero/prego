import { agentMorganReporter, log_message } from "../logging/logger.js";
import _ from "lodash";

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const throwError = (msg) => {
  log_message(agentMorganReporter, "error", msg);
  throw Error(msg);
};

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const warn = (msg) => {
  log_message(agentMorganReporter, "warn", msg);
};

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
