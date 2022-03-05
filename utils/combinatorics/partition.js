// Javascript program to generate all unique partitions of an integer
import 'lodash.combinations';
import _ from 'lodash';

import {
  hasElement,
  ones,
  descendingSort,
} from '../arrays/arrays.js';

// Function to generate all unique partitions of an integer
export const partitions = (n_points, n_blobs) => {
  if (n_points < 0 || n_blobs < 0) {
    throw Error('Number of points and blobs MUST be greater than 0.');
  }

  if (n_points < n_blobs - 1) {
    throw Error('Number of points MUST be greater than number of blobs minus 1.');
  }

  if (n_blobs === 1) {
    return [n_points];
  }

  let program_counter = 0;
  let is_swap;
  const curr_partition = [n_points - n_blobs + 1].concat(ones(n_blobs - 1));
  const partitions = [[...curr_partition]];
  let is_new_partition = false;

  for (let i = 1; i < n_blobs; i += 1) {
    program_counter = 0;

    while (program_counter <= i - 1) {
      is_swap = false;

      while (!is_swap) {
        curr_partition[program_counter] -= 1;
        curr_partition[program_counter + 1] += 1;

        is_swap = curr_partition[program_counter + 1] >= curr_partition[program_counter];

        is_new_partition = !hasElement(partitions, descendingSort([...curr_partition]))
                           && !curr_partition.includes(0);
        if (is_new_partition) {
          partitions.push(descendingSort([...curr_partition]));
        }
      }

      program_counter += 1;
    }
  }

  return partitions;
};

export const cardvecCombinations = (points, card_vec) => {
  let elem_0 = card_vec[0]
  let blob_combs = []
  let blob_comb = []
  let elem_1_combs = []
  
  if(points.length !== card_vec.reduce((a, b) => {return a+b})){
    throw Error('The sum of card_vec elements MUST be equal to points cardinality')
  }
  
  if(card_vec.length===1) {
    return [points]
  }

  for(let elem_0_comb of _.combinations(points, elem_0)) {
    
    blob_comb = [elem_0_comb]
    
    elem_1_combs = cardvecCombinations(
      _.difference(points, elem_0_comb), card_vec.slice(1)
    )
    
    blob_comb.push(elem_1_combs)
    blob_combs.push(blob_comb)
  }
  
  return blob_combs
}

/* 
export const constellationSeeker = (points, origin) => {
  if(origin in points) {
    throw Error('Origin MUST be within points!')
  }

  return []
}
*/