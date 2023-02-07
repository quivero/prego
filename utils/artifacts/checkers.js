

export const isExtensionOf = (childClass, parentClassCandidate) =>
    Object.getPrototypeOf(childClass.prototype) === parentClassCandidate.prototype;
