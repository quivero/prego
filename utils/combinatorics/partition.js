// Javascript program to generate all unique partitions of an integer
import {
  hasElement,
  ones,
  ascendingSort
} from '../arrays/arrays.js';

// Function to generate all unique partitions of an integer
export const partitions = (n_points, n_blobs) => {
  if(n_points < 0 || n_blobs < 0) {
    throw Error('Number of points and blobs MUST be greater than 0.');
  }
  
  if(n_points < n_blobs - 1) {
    throw Error('Number of points MUST be greater than number of blobs minus 1.');
  }
  
  if(n_blobs === 1) {
    return [n_points]
  }

  let program_counter = 0;
  let is_swap;
  let curr_partition = [n_points-n_blobs+1].concat(ones(n_blobs-1));
  let partitions = [[...curr_partition]];
  let is_new_partition = false;
  
  for(let i = 1; i < n_blobs; i += 1) {
    program_counter = 0;

    while(program_counter <= i-1) {
      is_swap = false;
      
      while(!is_swap) {
        curr_partition[program_counter] -= 1;      
        curr_partition[program_counter+1] += 1;
        
        is_swap = curr_partition[program_counter+1] >= curr_partition[program_counter]

        is_new_partition = !hasElement(partitions, ascendingSort([...curr_partition])) &&
                           !curr_partition.includes(0)
        if(is_new_partition) {
          partitions.push(ascendingSort([...curr_partition]))
        }
      }

      program_counter += 1;
    }
  }
  
  return partitions;
};

