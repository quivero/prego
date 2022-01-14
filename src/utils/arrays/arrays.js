
export const getAllIndexes = (arr, val) => {
    var indexes = [], i;
    
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    
    return indexes;
}

export const cyclicSort = (array, index) => {
    if(array.length < index){
        console.error('Error: Provided index '+index+' greater than array length '+array.length);
    }
    
    let head = array.slice(index);
    let tail = array.slice(0, index);

    return head.concat(tail);
}

export const isCyclicEqual = (control_, treatment_) => {
    let control_len = control_.length;
    let treatment_len = treatment_.length;

    if(control_len != treatment_len){
        return false;
    }

    for(let i=0; i<treatment_len; i++){
        if(cyclicSort(treatment_, i) == control_){
            return true
        }
    }

    return false;
}

export const getUniques = (vec) => {
    return Array.from(new Set(vec));
}