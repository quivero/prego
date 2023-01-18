
export const assert = (item) => {
    let result, expected;
    const item_length = item.length;
    
    if(item_length === 2 || item_length === 3) {
        const callback = item[item_length-1];
        
        if(typeof callback === 'function') {
            switch(item_length){
                case 2:
                    result = item[0];
        
                    callback(result);
        
                    break;
                    
                case 3:
                    result = item[0];
                    expected = item[1];
        
                    callback(result, expected);
        
                    break;
            }

        } else {
            const callbackValidity = 'Last element on item must be a callback function!';
            
            throw Error(callbackValidity);
        }

    } else {
        const description = 'Test element may have structure: ';
        const schemas = '[result, assertion_callback] or [result, expected, assertion_callback]';

        throw Error(description + schemas);
    }   
}

export const batchAssert = (items) => items.forEach(item => assert(item));