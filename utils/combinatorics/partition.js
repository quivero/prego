// Javascript program to generate all unique partitions of an integer
import { arraysEqual } from '../arrays/arrays.js';

// Function to generate all unique partitions of an integer
export const partitions = (n) => {
  // An array to store a partition
  const p = new Array(n);
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
  while (k > 0) {
    // print current partition
    const elem = [];

    for (let i = 0; i < k; i += 1) {
      elem.push(p[i]);
    }

    elem.sort();

    is_inside = false;
    for (const partition of partitions_dict[k + 1]) {
      console.log(arraysEqual(partition, elem));

      is_inside = is_inside && arraysEqual(partition, elem);
    }

    // Generate next partition

    // Find the rightmost non-one value in p[]. Also, update
    // the rem_val so that we know how much value can be accommodated
    let rem_val = 0;

    while (k >= 0 && p[k] === 1) {
      rem_val += p[k];
      k -= 1;
    }

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
};
