/**
 * @abstract throw an error with prescribed unable task message
 *
 * @param {String} task_msg
 */
export const throwError = (task_msg) => {
  throw Error(`It is not possible ${task_msg}`);
};
