import 'lodash.combinations';
import _ from 'lodash';

import {
  objectReduce,
  objectMap,
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
  if(m > Math.floor(array.length/n)) {
    throw Error('Size of array must be greater or equal to the product of n by m');
  }

  let curr_comb = [];

  for (let head_comb of _.combinations(array, n)) {
    curr_comb = [head_comb]
    
    if(m === 1) {
      yield curr_comb
    } else {
      for (
        let tail_comb of mSetsOfnTuples(_.difference(array, head_comb), n, m-1)
      ) {
        yield curr_comb.concat(tail_comb)
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
export function* hyperIndexes(len, dim) {
  if (len <= 0 || dim <= 0) {
    throw Error('Dimension and length must be positive natural numbers!');
  }
  
  let triang_tuple = []

  for(let ref_index of _.range(0, len)) {
    if (dim === 1) {
      yield ref_index
    } else {
      triang_tuple = [ref_index];
      
      for(let tail_triang_tuple of hyperIndexes(len, dim-1)) {
        yield triang_tuple.concat(tail_triang_tuple);
      }
    }
  }
}

/**
 * @abstract returns each tuple [key, elems] of the Euler diagram
 * systematic in a generator-wise fashion
 *
 * @param {Array} sets
 * @return {Array} keys_elems
 */
export function* euler(sets) {
  if (Object.values(sets).length === 1) yield Object.entries(sets)[0];
  if (Object.values(sets).length === 0) throw Error('There must at least ONE set!');

  sets = objectMap(sets, (set_key, set) => sort(set, 1));

  const sets_keys_fun = (sets_) => Object
    .keys(sets_)
    .filter((key) => sets_[key].length !== 0);

  let compl_sets_keys = [];
  let comb_str = '';
  let celements = [];
  let comb_intersec_key = '';
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
          {},
        ),
      )
      ) {
        comb_str = comb_elements[0];
        celements = comb_elements[1];

        comb_excl = _.difference(celements, sets[set_key]);
        if (comb_excl.length !== 0) {
          // Exclusive elements of group except current analysis set
          yield [comb_str, comb_excl];

          comb_str.split(',').forEach(
            (ckey) => {
              sets[ckey] = _.difference(sets[ckey], comb_excl);
            },
          );

          sets[set_key] = _.difference(sets[set_key], comb_excl);
        }

        comb_intersec = _.intersection(celements, sets[set_key]);
        if (comb_intersec.length !== 0) {
          // Intersection of analysis element and exclusive group
          comb_intersec_key = [set_key].concat(comb_str.split(',')).join(',');

          yield [comb_intersec_key, comb_intersec];

          comb_str.split(',').forEach(
            (ckey) => {
              sets[ckey] = _.difference(sets[ckey], comb_intersec);
            },
          );

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

/**
 * @abstract returns each tuple [key, elems] of the extended venn
 * systematic in a generator-wise fashion
 *
 * @param {Array} sets
 * @return {Array} keys_elems
 */
export function* venn(sets) {
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

  let keys = keys_fun(sets);

  // Traverse the combination lattice
  for (const chunk_card of _.range(1, keys.length + 1)) {
    for (const comb_keys of new _.combinations(keys, chunk_card)) {
      // In case any of the sets under analysis is empty
      if (hasElement([...comb_keys.map((key) => sets[Number(key)])], [])) continue;

      // Intersection of elements
      comb_sets_inter = _.intersection(...comb_keys.map((key) => sets[Number(key)]));

      compl_set_elems = _.uniq(_.flatten(
        _.difference(keys, comb_keys).map((set_key) => sets[set_key]),
      ));

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

export const spreadEuler = (lists) => Object.fromEntries([...euler(lists)]);

export const spreadVenn = (lists) => Object.fromEntries([...venn(lists)]);
