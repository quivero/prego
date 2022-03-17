import 'lodash.combinations';
import _ from 'lodash';

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
  const keys = Object.keys(sets);
  
  let comb_sets_inter = {};
  let comb_sets_union = {};
  let comb_sets_excl = {};

  let cum_union_sofar = []

  for (const i of _.rangeRight(1, keys.length + 1)) {
    for (const comb_keys of new _.combinations(keys, i)) {
      const comb_sets = comb_keys.map((key) => sets[key]);

      // Intersection of elements
      comb_sets_inter = Object
        .values(comb_sets)
        .reduce((acc, arr) => arr.filter(
          Set.prototype.has,
          new Set(acc),
        ));

      // No intersection means no exclusive value
      if (comb_sets_inter.length === 0) {
        break;
      }

      comb_sets_excl = _.difference(comb_sets_inter, cum_union_sofar);
      cum_union_sofar = _.uniq(
        _.union(cum_union_sofar, comb_sets_excl)
      )

      if (comb_sets_excl.length !== 0) {
        yield [comb_keys.toString(), comb_sets_excl];
        
      }
    }
  }
};
