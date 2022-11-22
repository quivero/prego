import { agentMorganReporter, log_message } from "../logging/logger.js";

/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const throwError = (msg) => {
    log_message(agentMorganReporter, 'error', msg);
    throw Error(msg);
};

function typeOf(value) {
    var type = typeof value;

    switch(type) {
        case 'object':
        return value === null ? 'null' : Object.prototype.toString.call(value).
            match(/^\[object (.*)\]$/)[1]

        case 'function':
        return 'Function';

        default:
        return type;
    }
}