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

export const descendingSort = (arr) => {
  arr.sort((a, b) => a - b).reverse();

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

export const extendedVenn = (sets) => {
  const keys = Object.keys(sets);
  const extended_venn = {};
  let comb_sets_inter = {};
  let comb_sets_union = {};
  let comb_sets_excl = {};

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

      const ev_keys_i_to_n = Object.keys(extended_venn);

      // Intersection of elements
      comb_sets_union = ev_keys_i_to_n.length === 0 ? []
        : ev_keys_i_to_n.reduce((acc, key) => [
          ...new Set(
            [
              ...acc,
              ...extended_venn[key],
            ],
          )], []);

      // Exclusive combination set elements
      comb_sets_excl = _.difference(comb_sets_inter, comb_sets_union);

      if (comb_sets_excl.length !== 0) {
        extended_venn[comb_keys.toString()] = comb_sets_excl;
      }
    }
  }

  return extended_venn;
};
