import 'lodash.combinations';
import _ from 'lodash';

import {
  objectReduce
} from '../objects/objects.js'

export const ones = (n) => Array(n).fill(1);

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

export const isCyclicEqual = (control_, treatment_) => {
  if (control_.length !== treatment_.length) {
    return false;
  }

  for (let i = 0; i < treatment_.length; i += 1) {
    if (arraysEqual(cyclicSort(treatment_, i), control_)) {
      return true;
    }
  }

  return false;
};

export const arraysEqual = (a, b) => {
  const type_equality_clause = typeof (a) === typeof (b);

  if (type_equality_clause) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
};

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

export const hasElement = (arr, elem) => {
  for (let i = 0; i <= arr.length; i += 1) {
    if (arraysEqual(arr[i], elem)) {
      return true;
    }
  }

  return false;
};

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
      has_item = has_item || arraysEqual(item, unique_item);
    });

    if (!has_item) {
      unique.push(item);
    }
  });

  return unique;
};

export const getUniques = (vec) => Array.from(new Set(vec));

export function* extendedVenn(sets) {
  const keys_fun = (sets_) => {
    return Object.keys(sets_).map(
      (key) => Number(key)
    ).filter(
      (key) => sets_[key].length !== 0
    );
  }

  let keys = keys_fun(sets)
  
  let comb_sets_inter = {};
  let comb_sets_excl = {};
  
  let cum_union_sofar = []
  let compl_set_elems = []
  let prev_keys_len = -1
  let curr_keys_len = -1

  for (const chunk_card of _.range(1, keys.length + 1)) {
    keys = keys_fun(sets)
    prev_keys_len = keys.length;

    for (const comb_keys of new _.combinations(keys, chunk_card)) {      
      if(_.difference(comb_keys, keys).length !== 0) {
        break;
      }
      
      // Intersection of elements
      comb_sets_inter = _.intersection(...comb_keys.map((key) => sets[Number(key)]))

      // Empty array
      if (comb_sets_inter.length === 0) continue;
      
      compl_set_elems = _.uniq(_.flatten(
        _.difference(keys, comb_keys).map((set_key) => sets[set_key])
      ))
      
      comb_sets_excl = _.difference(comb_sets_inter, compl_set_elems);
      cum_union_sofar = _.union(cum_union_sofar, comb_sets_excl)
      
      if (comb_sets_excl.length !== 0) {
        yield [comb_keys.toString(), comb_sets_excl];  
      }

      // Verify if there is some empty set 
      prev_keys_len = keys.length;  

      sets = objectReduce(
        sets, 
        (result, key, set_) => {
          result[key] = _.difference(set_, cum_union_sofar)
          return result
        }, {}
      )

      keys = keys_fun(sets)
      
      curr_keys_len = keys.length;
      
      if(curr_keys_len < prev_keys_len && curr_keys_len < chunk_card) {
        break;
      }
    }
  }
};
