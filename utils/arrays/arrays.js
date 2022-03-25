import 'lodash.combinations';
import _ from 'lodash';

import {
  objectReduce,
  objectKeyFind,
} from '../objects/objects.js';

/**
 * @abstract returns an array of ones with length n
 *
 * @param {Integer} n
 * @return {Array} ones
 */
export const ones = (n) => Array(n).fill(1);

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
 * @abstract returns a shifted word cyclily
 *
 * @param {Array} array
 * @param {Integer} index
 * @return {Array} shifted_array
 */
export const cyclicSort = (array, index) => {
  if (array.length < index) {
    const category = 'Error';
    const subject = `Provided index ${index}`;
    const condition = `greater than array length ${array.length}`;

    console.error(`${category} : ${subject} ${condition}`);
  }

  const head = array.slice(index);
  const tail = array.slice(0, index);

  return head.concat(tail);
};

/**
 * @abstract returns a shifted cyclicly word
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
 * @abstract returns true for equal arrays
 *
 * @param {Array} array_a
 * @param {Array} array_b
 * @return {boolean} is_equal
 */
export const arraysEqual = (a, b) => {
  const type_equality_clause = typeof (a) === typeof (b);

  if (type_equality_clause) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
};

/**
 * @abstract returns a sorted array of integers
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
    throw Error('Sorting types are 0 and 1 for descending and ascending order.');
  }

  return arr;
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
  elems_to_del.forEach(
    (elem_to_del) => {
      arr = arr.filter((elem) => elem_to_del !== elem);
    },
  );

  return arr;
};

// Cartesian product of arrays
export const cartesianProduct = (a, b, ...c) => {
  const f = (a, b) => [].concat(...a.map((a) => b.map((b) => [].concat(a, b))));

  return b ? cartesianProduct(f(a, b), ...c) : a;
};

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

/**
 * @abstract returns
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
export const getUniques = (vec) => Array.from(new Set(vec));

/**
 * @abstract returns each tuple [key, elems] of the extended venn
 * systematic in a generator-wise fashion
 *
 * @param {Array} sets
 * @return {Array} keys_elems
 */
export function* extendedVenn(sets) {
  const keys_fun = (sets_) => Object.keys(sets_).map(
    (key) => Number(key),
  ).filter(
    (key) => sets_[key].length !== 0,
  );

  let comb_sets_inter = {};
  let comb_sets_excl = {};

  let cum_union_sofar = [];
  let compl_set_elems = [];
  let prev_keys_len = -1;
  let curr_keys_len = -1;
  let comb_key = '';
  
  let keys = keys_fun(sets);
  
  let i = 0;

  // Traverse the combination lattice
  for (const chunk_card of _.range(1, keys.length + 1)) {
    for (const comb_keys of new _.combinations(keys, chunk_card)) {
      // In case any of the sets under analysis is empty
      if(hasElement([...comb_keys.map((key) => sets[Number(key)])], [])) continue;
      
      // Intersection of elements
      comb_sets_inter = _.intersection(...comb_keys.map((key) => sets[Number(key)]))

      compl_set_elems = _.uniq(_.flatten(
        _.difference(keys, comb_keys).map((set_key) => sets[set_key]),
      ));
      
      let comb_key = comb_keys.join(',')
      
      comb_sets_excl = _.difference(comb_sets_inter, compl_set_elems);
      cum_union_sofar = _.union(cum_union_sofar, comb_sets_excl);

      if (comb_sets_excl.length !== 0) {
        yield [comb_keys.toString(), comb_sets_excl];
      }

      // Verify if there is some empty set
      prev_keys_len = keys.length;

      sets = objectReduce(
        sets,
        (result, key, set_) => {
          result[key] = _.difference(set_, cum_union_sofar);
          return result;
        },
        {},
      );

      keys = keys_fun(sets);

      curr_keys_len = keys.length;
      
      // If any set turned empty, break inner-loop. The chunk cardinality
      // in the inner-loop may be greater than the available non-empty sets. 
      // Therefore, it is also a necessary condition. Both together are 
      // sufficient for integers
      if (curr_keys_len < prev_keys_len && curr_keys_len < chunk_card) {
        break;
      }
    }
  }
}

export const spreadExtendedVenn = (lists) => Object.fromEntries([...extendedVenn(lists)])


