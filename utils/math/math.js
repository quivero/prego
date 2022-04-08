export const decimalPart = (number) => number - Math.floor(number);

export const xor = (a, b) => {
    if(![0, 1].includes(a) || ![0, 1].includes(b)) {
        throw Error('Variables a and b must be either boolean or numbers 0/1!');
    }

    return a*(1-b) + b*(1-a)
}