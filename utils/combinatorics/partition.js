// Javascript program to generate all unique partitions of an integer
import { getUniques } from '../arrays/arrays.js';

// Function to generate all unique partitions of an integer
export const partitions = (n, size) => {
  // An array to store a partition
  const p = new Uint8Array(n);
  const partitions_dict = {};

  for (let i = 0; i < n; i += 1) {
    partitions_dict[i + 1] = [];
  }

  // Index of last element in a partition
  let k = 0;

  // Initialize first partition as number itself
  p[k] = n;

  // This loop first prints current partition, then generates next
  // partition. The loop stops when the current partition has all 1s
  while (getUniques(p) !== 1) {
    if(k==size){
      // print current partition
      console.log(Array.from(p.subarray(0, k+1)))
    }
    
    // Generate next partition

    // Find the rightmost non-one value in p[]. Also, update
    // the rem_val so that we know how much value can be accommodated
    let rem_val = 0;

    while (k >= 0 && p[k] === 1) {
      rem_val += p[k];
      k -= 1;
    }

    // If k < 0, all the values are 1 so
    // there are no more partitions
    if (k < 0) 
        break;
    
    // Decrease the p[k] found above and adjust the rem_val
    p[k] -= 1;
    rem_val += 1;

    // If rem_val is more, then the sorted order is violated. Divide rem_val in
    // different values of size p[k] and copy these values at different positions
    // after p[k]
    while (rem_val > p[k]) {
      p[k + 1] = p[k];
      rem_val -= p[k];
      k += 1;
    }

    // Copy rem_val to next position and increment position
    p[k + 1] = rem_val;
    k += 1;    
  }

  return partitions_dict
};
