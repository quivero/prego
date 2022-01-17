export const clone = (reference) => {
    let proto = Object.getPrototypeOf(reference);
    let model = Object.create(proto);
    
    return Object.assign(model, reference)
}