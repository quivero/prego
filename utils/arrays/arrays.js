import _ from 'lodash';
import Iter from 'es-iter';

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
    if (cyclicSort(treatment_, i) === control_) {
      return true;
    }
  }

  return false;
};

export const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const removeArrayDuplicates = (list) => {  
  let unique = [];  
  
  list.forEach((item) => {  
    let has_item=false 
    
    unique.forEach((unique_item) => {
      has_item=has_item || arraysEqual(item, unique_item)
    })
    
    if(!has_item){
        unique.push(item);
    }  
  });

  return unique
}

export const getUniques = (vec) => Array.from(new Set(vec));

export const extendedVenn = (sets) => {
  const keys = Object.keys(sets);
  const extended_venn = {};
  let comb_sets_inter = {};
  let comb_sets_union = {};
  let comb_sets_excl = {};

  for (const i of _.rangeRight(1, keys.length + 1)) {
    for (const comb_keys of new Iter(keys).combinations(i)) {
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
      comb_sets_union = 
        ev_keys_i_to_n.length === 0 ? []
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
