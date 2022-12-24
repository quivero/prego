import _ from "lodash";
import "lodash.combinations";

import { objectReduce } from "../objects/objects.js";

import { throwError } from "../sys/sys.js";

const SET_DELIMITER = ",";

/**
 * @abstract returns an array of ones with length n
 *
 * @param {Integer} n
 * @return {Array} ones
 */
export const ones = (n) => Array(n).fill(1);

/**
 * @abstract returns a vector with element each between given min_val and max_val
 *
 * @param {Number} min_val
 * @return {Number} max_val
 */
export const randMinMax = (min_val, max_val) => {
  return (max_val - min_val) * Math.random() + min_val;
};

/**
 * @abstract returns a random vector between min_val and max_val
 *
 * @param {Integer} n
 * @return {Array} ones
 */
export const nRandMinMax = (n, min_val, max_val) => {
  let n_array = [];

  for (let i = 0; i < n; i += 1) {
    n_array.push(randMinMax(min_val, max_val));
  }

  return n_array;
};

/**
 * @abstract returns a vector with element each between given min_val and max_val
 *
 * @param {Integer} n
 * @return {Array} ones
 */
export const nRandMinsMaxs = (min_max_vec) => {
  let n_array = [];
  let msg = "";
  let n = min_max_vec.length;

  for (let i = 0; i < n; i += 1) {
    if (min_max_vec[i].length !== 2) {
      throwError(
        "Entry " +
          String(i) +
          " have 2 entries. We found " +
          String(min_max_vec[i].length) +
          "!"
      );
      return;
    }

    let min_val = min_max_vec[i][0];
    let max_val = min_max_vec[i][1];

    if (typeof min_val !== "number" && typeof max_val !== "number") {
      throwError("Min and max values must be numbers!");
      return;
    }

    if (min_val > max_val) {
      throwError("error", "Min value must be lower than Max value!");
      return;
    }

    n_array.push(randMinMax(min_val, max_val));
  }

  return n_array;
};

/**
 * @abstract returns an array of indexes with val
 *
 * @param {Array} arr
 * @param {Number} val
 * @return {Array} indexes
 */
export const getAllIndexes = (arr, val) => {
  const indexes = [];
  let i;

  for (i = 0; i < arr.length; i += 1) {
    if (arr[i] === val) {
      indexes.push(i);
    }
  }

  return indexes;
};

/**
 * @abstract returns array with elements equal to array tuple
 *
 * @param {Array} array_1
 * @param {Array} array_2
 * @return {Array}
 */
export const zip = (arr_1, arr_2) => {
  if (arr_1.length !== arr_2.length) {
    throwError("Arrays must have the same length.");
  }

  const arr_tuple = arr_1.map((e, i) => [e, arr_2[i]]);

  return arr_tuple;
};

/**
 * @abstract returns dictionary with number prime factors
 *
 * @param {Integer} number
 * @return {object}
 */
export const countDict = (arr) => {
  const obj = {};

  for (const i of _.range(arr.length)) {
    obj[arr[i]] = (obj[arr[i]] || 0) + 1;
  }

  return obj;
};

/**
 * @abstract returns a shifted word cyclily
 *
 * @param {Array} array
 * @param {Integer} index
 * @return {Array} shifted_array
 */
export const cyclicSort = (array, index) => {
  if (array.length < index) {
    const category = "Error";
    const subject = `Provided index ${index}`;
    const condition = `greater than array length ${array.length}`;

    throwError(`${category} : ${subject} ${condition}`);
  }

  const head = array.slice(index);
  const tail = array.slice(0, index);

  return head.concat(tail);
};

/**
 * @abstract returns true if control and treatment words are equal
 * in some sshifted way
 *
 * @param {Array} array
 * @param {Integer} index
 * @return {Array} shifted_array
 */
export const isCyclicEqual = (control_, treatment_) => {
  if (control_.length !== treatment_.length) {
    return false;
  }

  for (let i = 0; i < treatment_.length; i += 1) {
    if (_.isEqual(cyclicSort(treatment_, i), control_)) {
      return true;
    }
  }

  return false;
};

/**
 * @abstract returns a sorted array of integers. The possible types are below:
 * - 0: descending
 * - 1: ascending
 *
 * @param {Array} array
 * @param {Integer} type
 * @return {Array} sorted_array
 */
export const sort = (arr, sort_type = 0) => {
  arr.sort((a, b) => a - b);

  if (sort_type == 0) {
    arr.reverse();
  } else if (sort_type == 1) {
    // Do nothing
  } else {
    throwError("Sorting types are 0 and 1 for descending and ascending order.");
  }

  return arr;
};

/**
 * @abstract returns dictionary with found sequential blobs
 *
 * @param {Array} arr
 * @return {object}
 */
export const sequentialArrayBlobs = (arr) => {
  const blobs = {};
  let counter = 0;
  let head_index = 0;

  // Sort number array in ascending order
  arr = sort(arr, 1);

  if (arr.length === 1) {
    return { 0: arr };
  }
  for (const index of _.range(arr.length)) {
    if (index > 0) {
      if (arr[index] - arr[index - 1] > 1) {
        blobs[counter] = arr.slice(head_index, index);
        head_index = index;
        counter += 1;
      }

      if (index === arr.length - 1) {
        blobs[counter] = arr.slice(head_index, index + 1);
      }
    }
  }

  return blobs;
};

/**
 * @abstract returns true if array has provided element
 *
 * @param {Array} array
 * @param {Object} elem
 * @return {boolean} has_element
 */
export const hasElement = (arr, elem) => {
  for (let i = 0; i <= arr.length; i += 1) {
    if (_.isEqual(arr[i], elem)) {
      return true;
    }
  }

  return false;
};

/**
 * @abstract returns array with removed provided elements
 *
 * @param {Array} arr
 * @param {Object} elems
 * @return {Array} arr_without_elems
 */
export const removeElements = (arr, elems_to_del) => {
  elems_to_del.forEach((elem_to_del) => {
    arr = arr.filter((elem) => elem_to_del !== elem);
  });

  return arr;
};

/**
 * @abstract returns true if array has provided element
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Array} c
 * @return {array} cartesian_product
 */
export const cartesianProduct = (a, b, ...c) => {
  const f = (a, b) => [].concat(...a.map((a) => b.map((b) => [].concat(a, b))));

  return b ? cartesianProduct(f(a, b), ...c) : a;
};

/**
 * @abstract
 *
 * @param {Array} list
 * @return {Array} unique_list
 */
export const removeArrayDuplicates = (list) => {
  const unique = [];
  list.forEach((item) => {
    let has_item = false;

    unique.forEach((unique_item) => {
      has_item = has_item || _.isEqual(item, unique_item);
    });

    if (!has_item) {
      unique.push(item);
    }
  });

  return unique;
};

export function* mSetsOfnTuples(array, n, m) {
  if (m > Math.floor(array.length / n)) {
    throwError(
      "Size of array must be greater or equal to the product of n by m"
    );
  }

  let curr_comb = [];

  for (const head_comb of _.combinations(array, n)) {
    curr_comb = [head_comb];

    if (m === 1) {
      yield curr_comb;
    } else {
      for (const tail_comb of mSetsOfnTuples(
        _.difference(array, head_comb),
        n,
        m - 1
      )) {
        yield curr_comb.concat(tail_comb);
      }
    }
  }
}

/**
 * @abstract returns array unique values
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export const getUniques = (vec) => Array.from(new Set(vec));

/**
 * @abstract returns upper triangular indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export function* fullPolytopeIndexesFn(length, curr_dim, dim) {
  for (const i of _.range(0, length)) {
    if (curr_dim === 1) {
      yield i;
    } else {
      for (const tail_indexes of fullPolytopeIndexesFn(
        length,
        curr_dim - 1,
        dim
      )) {
        yield [i].concat(tail_indexes);
      }
    }
  }
}

/**
 * @abstract returns upper triangular indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export function* upperTriangularIndexesFn(length, curr_dim, dim, index = 0) {
  for (const i of _.range(index, length)) {
    if (curr_dim === 1) {
      yield i;
    } else {
      for (const tail_indexes of upperTriangularIndexesFn(
        length,
        curr_dim - 1,
        dim,
        i
      )) {
        yield [i].concat(tail_indexes);
      }
    }
  }
}

/**
 * @abstract returns polytopic structure indexes from formation function
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export function* hyperIndexes(length, dim, formationFn) {
  if (dim <= 0 || length <= 0) {
    throwError("Dimension and length must be positive natural numbers!");
  }

  for (const indexes of formationFn(length, dim, dim)) {
    yield indexes;
  }
}

/**
 * @abstract returns full polytopic indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export function* fullPolytopeHyperindexes(length, dim) {
  yield* hyperIndexes(length, dim, fullPolytopeIndexesFn);
}

/**
 * @abstract returns triangular polytopic indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export function* upperTriangularHyperindexes(length, dim) {
  yield* hyperIndexes(length, dim, upperTriangularIndexesFn);
}

/**
 * @abstract returns each tuple [key, elems] of the Euler diagram
 * systematic in a generator-wise fashion
 *
 * @param {Array} sets
 * @return {Array} keys_elems
 */
export function* euler(sets) {
  let is_unique = true;
  for (let set_key in sets) {
    is_unique &=
      sets[set_key].length == removeArrayDuplicates(sets[set_key]).length;
  }

  if (!is_unique) {
    throwError("Each array must NOT have duplicates!");
  }

  if (Object.values(sets).length === 1) yield Object.entries(sets)[0];

  if (Object.values(sets).length === 0)
    throwError("There must at least ONE set!");

  const sets_keys_fun = (sets_) =>
    Object.keys(sets_).filter((key) => sets_[key].length !== 0);

  let compl_sets_keys = [];
  let comb_str = "";
  let celements = [];
  let comb_intersec_key = "";
  let comb_intersec = [];
  let comb_excl = [];

  let sets_keys = sets_keys_fun(sets);
  
  // Traverse the combination lattice
  for (const set_key of sets_keys) {
    compl_sets_keys = _.difference(sets_keys, [set_key])
      .filter((compl_set_key) => sets[compl_set_key].length !== 0)
      .map((compl_set_key) => String(compl_set_key));

    if (compl_sets_keys.length !== 0 && sets[set_key].length !== 0) {
      for (const comb_elements of euler(
        objectReduce(
          compl_sets_keys,
          (result, __, compl_set_key) => {
            result[compl_set_key] = sets[compl_set_key];
            return result;
          },
          {}
        )
      )) {
        comb_str = comb_elements[0];
        celements = comb_elements[1];

        comb_excl = _.difference(celements, sets[set_key]);
        if (comb_excl.length !== 0) {
          // Exclusive elements of group except current analysis set
          yield [comb_str, comb_excl];

          comb_str.split(SET_DELIMITER).forEach((ckey) => {
            sets[ckey] = _.difference(sets[ckey], comb_excl);
          });

          sets[set_key] = _.difference(sets[set_key], comb_excl);
        }

        comb_intersec = _.intersection(celements, sets[set_key]);
        if (comb_intersec.length !== 0) {
          // Intersection of analysis element and exclusive group
          comb_intersec_key = [set_key]
            .concat(comb_str.split(SET_DELIMITER))
            .join(",");

          yield [comb_intersec_key, comb_intersec];

          comb_str.split(SET_DELIMITER).forEach((ckey) => {
            sets[ckey] = _.difference(sets[ckey], comb_intersec);
          });

          sets[set_key] = _.difference(sets[set_key], comb_intersec);
        }

        sets_keys = sets_keys_fun(sets);
      }

      if (sets[set_key].length !== 0) {
        yield [String(set_key), sets[set_key]];
      }
    }
  }
}

export const spreadEuler = (lists) => Object.fromEntries([...euler(lists)]);
