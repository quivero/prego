/**
 * Generate token with length
 *
 * @param int length
 *
 * @return string
 */
export const generateToken = (length) => {
    let result           = '';
    const characters     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
 }