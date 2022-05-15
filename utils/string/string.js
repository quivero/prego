/**
 * Generate token with length
 *
 * @param int length
 *
 * @return string
 */
export const generateToken = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

/**
 * @abstract convert string to hash code
 *
 * @param {String} str
 *
 * @return String
 */
export const codify = (str) => new Buffer(str).toString('base64');

/**
 * @abstract convert string to hash code
 *
 * @param {String} str
 *
 * @return String
 */
export const decodify = (hash) => new Buffer(hash, 'base64').toString('ascii');
