
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