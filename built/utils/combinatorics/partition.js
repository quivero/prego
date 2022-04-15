"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Javascript program to generate all unique partitions of an integer
require("lodash.combinations");
var lodash_1 = require("lodash");
var math_js_1 = require("../math/math.js");
/*
 * @abstract returns unique partitions of an integer with
 * Source: https://cs.stackexchange.com/questions/150270/vector-of-1s-and-sum-of-elements
 * @param {Integer} number
 * @param {Integer} n_summands
 * @return {Array} partitions
 */
exports.partitions = function (n) {
    if (math_js_1.decimalPart(n) !== 0 || n <= 0) {
        throw Error('Given number must be positive and natural!');
    }
    var all_partitions = [];
    var buffer = __spreadArrays(lodash_1.default.repeat(0, n)).map(function (str) { return Number(str); });
    // sum(buffer[index:]) will be s. Each entry will be at most m
    var partitions_recursive = function (start, s, m) {
        if (s === 0) {
            all_partitions.push(__spreadArrays(buffer.slice(0, start)));
        }
        for (var _i = 0, _a = lodash_1.default.range(1, Math.min(s, m) + 1); _i < _a.length; _i++) {
            var part = _a[_i];
            buffer[start] = part;
            partitions_recursive(start + 1, s - part, Math.min(m, part));
        }
    };
    partitions_recursive(0, n, n);
    return all_partitions;
};
/**
 * @abstract returns
 *
 * @param {Array} points
 * @param {Array} card_vec
 * @return {Array} blob_combs
 */
exports.cardvecCombinations = function (points, card_vec) {
    var elem_0 = card_vec[0];
    var blob_combs = [];
    var blob_comb = [];
    var elem_1_combs = [];
    if (points.length !== card_vec.reduce(function (a, b) { return a + b; })) {
        throw Error('The sum of card_vec elements MUST be equal to points cardinality');
    }
    if (card_vec.length === 1) {
        return [points];
    }
    for (var _i = 0, _a = lodash_1.default.combinations(points, elem_0); _i < _a.length; _i++) {
        var elem_0_comb = _a[_i];
        blob_comb = [elem_0_comb];
        elem_1_combs = exports.cardvecCombinations(lodash_1.default.difference(points, elem_0_comb), card_vec.slice(1));
        blob_comb.push(elem_1_combs);
        blob_combs.push(blob_comb);
    }
    return blob_combs;
};
/*
export const constellationSeeker = (points, n_blobs, origins) => {
  if (points.length < n_blobs) {
    throw Error('Number of points MUST be greater than number of blobs');
  }

  let comb = [];

  for (const comb_vec of partitions(points.length, n_blobs)) {
    comb = cardvecCombinations(points_, comb_vec);
  }

  return [];
};
*/
