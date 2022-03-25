// Javascript program to generate all unique partitions of an integer
import 'lodash.combinations';
import _ from 'lodash';

import {
  hasElement,
  ones,
  sort,
  getUniques
} from '../arrays/arrays.js';

/*
 * @abstract returns unique partitions of an integer with 
 *
 * @param {Integer} number
 * @param {Integer} n_summands
 * @return {Array} partitions
 */
export const partitions = (number, num_summands) => {
 if (number <= 0 || num_summands <= 0) {
   throw Error('Number of points and summands MUST be greater than 0 and natural.');
 }

 if (number < num_summands) {
   throw Error('Number of points MUST be greater than number of blobs.');
 }

 if (num_summands === 1) {
   return [number];
 }
 
 let program_counter = 0;
 let is_swap;
 let curr_partition = [number - num_summands + 1].concat(ones(num_summands - 1));
 let curr_partition_uniques = getUniques(curr_partition);
 let hasNegativeElements = (arr) => arr.filter((elem) => elem <= 0).length > 0
 
 const partitions = [[...curr_partition]];
 let is_new_partition = false;

 for (let i = 1; i < num_summands; i += 1) {
   program_counter = 0;

   while (program_counter <= i - 1) {
     is_swap = false;

     while (!is_swap) {
       curr_partition[program_counter] -= 1;
       curr_partition[program_counter + 1] += 1;

       is_swap = curr_partition[program_counter + 1] >= curr_partition[program_counter];

       is_new_partition = !hasElement(partitions, sort([...curr_partition]))
                          && !hasNegativeElements(curr_partition);
       if (is_new_partition) {
         partitions.push(sort([...curr_partition]));
       }
     }

     curr_partition_uniques = getUniques(curr_partition);
     program_counter += 1;
   }
 }

 return partitions;
};

/**
 * @abstract returns integer and subsequent elements partitions 
 *
 * @param {Integer} n_points
 * @param {Integer} n_blobs
 * @return {Array} [partition, spread_possibilities]
 */
export function* partitionTree(number, num_summands) {
  
  // Guard elements
  if (number <= 0 || num_summands <= 0) {
    throw Error('Number of points and blobs MUST be greater than 0.');
  }
  
  if (number < num_summands) {
    throw Error('Number of points MUST be greater than number of blobs.');
  }

  // One summand term
  if(num_summands === 1) {
    yield [[1], [number], [number], [number]]
  } else {
    let element = -1;
    let partition_uniques = []
    
    // For each partition
    for(const partition_ of partitions(number, num_summands)) {
      partition_uniques = getUniques(_.flatten([partition_]));
      
      // Every unique element requires a spread term
      for(let i = 1; i <= partition_uniques.length; i = i + 1) {
        element = partition_uniques[i];
        
        // Span lower terms than each partition element 
        for(let i = 1; i <= element; i = i + 1) {
          for(const tree_node of partitionTree(element, i)) {
            yield {
              partition: partition_, 
              element: element, 
              size: i, 
              tree_node: tree_node
            };  
          }
        }
      }
    }
  }
}

/**
 * @abstract returns
 *
 * @param {Array} points
 * @param {Array} card_vec
 * @return {Array} blob_combs
 */
export const cardvecCombinations = (points, card_vec) => {
  const elem_0 = card_vec[0];
  const blob_combs = [];
  let blob_comb = [];
  let elem_1_combs = [];

  if (points.length !== card_vec.reduce((a, b) => a + b)) {
    throw Error('The sum of card_vec elements MUST be equal to points cardinality');
  }

  if (card_vec.length === 1) {
    return [points];
  }

  for (const elem_0_comb of _.combinations(points, elem_0)) {
    blob_comb = [elem_0_comb];

    elem_1_combs = cardvecCombinations(_.difference(points, elem_0_comb), card_vec.slice(1));
    
    blob_comb.push(elem_1_combs);
    blob_combs.push(blob_comb);
  }

  return blob_combs;
};

/*
export const constellationSeeker = (points, n_blobs, origins) => {
  if (points.length < n_blobs) {
    throw Error('Number of points MUST be greater than number of blobs');
  }
  
  let comb = [];

  for (const comb_vec of partitions(points.length, n_blobs)) {
    comb = cardvecCombinations(points_, comb_vec);
  }

  return [];
};
*/
