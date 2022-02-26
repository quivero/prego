// Javascript program to generate all unique partitions of an integer
import { arraysEqual } from '../arrays/arrays.js';

// Function to generate all unique partitions of an integer
export const partitions = (n) => {
    
    // An array to store a partition
    let p = new Array(n); 
    let partitions={}
    
    for(let i=0; i<n; i++){
        partitions[i+1]=[]
    }
    console.log(partitions)
    // Index of last element in a partition
    let k = 0; 
    
    // Initialize first partition as number itself
    p[k] = n;

    // This loop first prints current partition, then generates next
    // partition. The loop stops when the current partition has all 1s
    while (true){
        // print current partition
        let elem=[]
        
        for(let i=0; i<k; i++){
            elem.push(p[i])
        }

        elem.sort();
        
        is_inside=false;
        for(let partition of partitions[k+1]){
            console.log(arraysEqual(partition, elem))
            
            is_inside = is_inside && arraysEqual(partition, elem);
        }
        
        // Generate next partition
        
        // Find the rightmost non-one value in p[]. Also, update 
        // the rem_val so that we know how much value can be accommodated
        let rem_val = 0;
        
        while (k >= 0 && p[k] == 1){
            rem_val += p[k];
            k--;
        }
        
        // If k < 0, all the values are 1 so there are no more partitions
        if (k < 0){ 
            return;
        }

        // Decrease the p[k] found above and adjust the rem_val
        p[k]--;
        rem_val++;
  
        // If rem_val is more, then the sorted order is violated. Divide rem_val in
        // different values of size p[k] and copy these values at different positions
        // after p[k]
        while (rem_val > p[k]){
            p[k + 1] = p[k];
            rem_val = rem_val - p[k];
            k++;
        }
  
        // Copy rem_val to next position and increment position
        p[k + 1] = rem_val;
        k++;
    }
}
  