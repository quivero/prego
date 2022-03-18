import _ from 'lodash';

/**
 * @abstract returns an object with given keys and initial value
 * 
 * @param {Array} keys
 * @param {Object} initial_value
 * @param {Object} init_object
 */
export const objectInit = (keys, init_value) => {
  const a = [];
  let total = keys.length;

  while (total--) a.push(_.cloneDeep(init_value));

  return Object.fromEntries(
    _.zip(keys, [...a]),
  );
};

/**
 * @abstract returns an object mapped values for keys and value
 * 
 * @param {Object} object
 * @param {function} mapFn
 * @param {Object} mapped_object
 */
export const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(key, object[key]);
  return result;
}, {});

export const objectReduce = (object, reduceFn, init_val) => Object.entries(_.cloneDeep(object)).reduce((
  result,
  [key, value],
) => reduceFn(result, key, value), init_val);

/**
 * @abstract returns a filtered object
 * 
 * @param {Object} object
 * @param {function} filterFn
 * @param {Object} filtered_object
 */
export const objectFilter = (object, filterFn) => {
  const object_copy = _.cloneDeep(object);

  Object.entries(object_copy).forEach(
    ([key, value]) => {
      if (!filterFn(key, value)) {
        delete object_copy[key];
      }
    },
  );

  return object_copy;
};

/**
 * @abstract returns the keys of a filtered object
 * 
 * @param {Object} object
 * @param {function} filterFn
 * @param {Object} filtered_object
 */
export const objectKeyFind = (object, findFn) => Object.keys(objectFilter(object, findFn));
