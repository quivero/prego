import _ from "lodash";

/**
 * @abstract returns an object with given keys and initial value
 *
 * @param {Array} keys
 * @param {Object} initial_value
 * @return {Object}
 */
export const objectInit = (keys, init_value) => {
  const a = [];
  let total = keys.length;

  while (total--) a.push(_.cloneDeep(init_value));

  return Object.fromEntries(_.zip(keys, [...a]));
};

/**
 * @abstract returns an object mapped values for keys and value
 *
 * @param {Object} object
 * @param {function} mapFn
 * @return {Object}
 */
export const objectMap = (object, mapFn) =>
  _.reduce(
    Object.keys(object),
    (result, key) => {
      result[key] = mapFn(key, object[key]);
      return result;
    }, {});

/**
 * @abstract returns a reduced object
 *
 * @param {Object} object
 * @param {function} reduceFn
 * @return {Object}
 */
export const objectReduce = (object, reduceFn, init_val) =>
  _.reduce(
    Object.entries(_.cloneDeep(object)),
    (result, [key, value]) => reduceFn(result, key, value),
    init_val
  );

/**
 * @abstract returns a filtered object
 *
 * @param {Object} object
 * @param {function} filterFn
 * @return {Object}
 */
export const objectFilter = (object, filterFn) => {
  const object_copy = _.cloneDeep(object);

  Object.entries(object_copy).forEach(([key, value]) => {
    if (!filterFn(key, value)) {
      delete object_copy[key];
    }
  });

  return object_copy;
};

/**
 * @abstract returns the keys of a filtered object
 *
 * @param {Object} object
 * @param {function} filterFn
 * @return {Object} filtered_object
 */
export const objectKeyFind = (object, findFn) =>
  Object.keys(objectFilter(object, findFn));

/**
 * @abstract iterates along an object
 *
 * @param {Object} object
 * @param {function} forEachFn
 */
export const objectForEach = (object, forEachFn) => {
  objectMap(object, forEachFn);
};

/**
 * @abstract returns the difference between two json objects
 *
 * @param {Object} l_object
 * @param {Object} r_object
 * @param {function} equalFn
 * @return {Object}
 */
export const objectDifference = (l_object, r_object, equalFn) =>
  objectReduce(
    r_object,
    (curr_diff, r_key, r_value) =>
      objectFilter(
        curr_diff,
        (l_key, l_value) => !equalFn(r_key, r_value, l_key, l_value)
      ),
    l_object
  );

/**
 * @abstract returns the intersection between two json objects
 *
 * @param {Object} l_object
 * @param {Object} r_object
 * @param {function} equalFn
 * @return {Object}
 */
export const objectIntersection = (
  l_object,
  r_object,
  equalFn,
  keyFn,
  valueFn
) =>
  objectReduce(
    r_object,
    (curr_intersec, r_key, r_value) => {
      objectForEach(
        l_object,
        (l_key, l_value) => {
          if (equalFn(r_key, r_value, l_key, l_value)) {
            curr_intersec[keyFn(r_key, r_value, l_key, l_value)] = valueFn(
              r_key,
              r_value,
              l_key,
              l_value
            );
          }
        },
        {}
      );

      return curr_intersec;
    },
    {}
  );

/**
 * @abstract returns true for two equal json objects
 *
 * @param {Object} l_object
 * @param {Object} r_object
 * @param {function} equalFn
 * @return {Object}
 */
export const objectEqual = (l_object, r_object, equalFn) =>
  equalFn(l_object, r_object);

/**
 * @abstract Declare a flatten function that takes
 * object as parameter and returns the flatten object
 *
 * @param {Object} obj
 * @return {Object}
 */
export const objectFlatten = (obj) => {
  // The object which contains the
  // final result
  const result = {};

  // loop through the object "ob"
  for (const i in obj) {
    // We check the type of the i using typeof() function and recursively call the function again
    if (typeof obj[i] === "object" && !Array.isArray(obj[i])) {
      const temp = objectFlatten(obj[i]);
      for (const j in temp) {
        // Store temp in result
        result[`${i}.${j}`] = temp[j];
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = obj[i];
    }
  }
  return result;
};

/**
 * @abstract JSON object has $key string among keys
 *
 *
 * @param {Object} object
 * @param {String} key
 * @return {Object}
 */
export const objectHasKey = (object, key) => Object.keys(object).includes(key);


/**
 * @abstract JSON object has $key string among keys
 *
 *
 * @param {Object} object
 * @param {String} key
 * @return {Object}
 */
export const objectHasKeys = (object, keys) => {
  return _.reduce(
    keys,
    (ObjecthasKeysSoFar, key) => ObjecthasKeysSoFar && objectHasKey(object, key), 
    true
  )
}


