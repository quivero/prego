"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @abstract decimal part of a number
 *
 * @param {Number} number
 * @return {Number}
 */
exports.decimalPart = function (number) { return number - Math.floor(number); };
/**
 * @abstract xor operator
 *
 * @param {boolean} a
 * @param {boolean} b
 * @return {boolean}
 */
exports.xor = function (a, b) {
    if (![0, 1].includes(a) || ![0, 1].includes(b)) {
        throw Error('Variables a and b must be either boolean or numbers 0/1!');
    }
    return Boolean(a * (1 - b) + b * (1 - a));
};
/**
 * @abstract transformation map of spherical to cartesian coordinates
 *
 * @param {boolean} a
 * @param {boolean} b
 * @return {boolean}
 */
exports.sphericalToCartesian = function (coords, R) {
    var prodsin = function (arr) {
        return arr.reduce(function (prod_, angle) { return prod_ * Math.sin(angle); }, 1);
    };
    var s2cRecur = function (index, coords, R) {
        var curr_coord = coords[index];
        return R * prodsin(coords.slice(0, index)) * Math.cos(curr_coord);
    };
    var curr_coord = coords[coords.length - 1];
    return coords
        .map(function (coord, index) { return s2cRecur(index, coords, R); }).concat([
        R * prodsin(coords.slice(0, coords.length - 1)) * Math.sin(curr_coord)
    ]);
};
