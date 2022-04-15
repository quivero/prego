"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
require("lodash.combinations");
var lodash_1 = require("lodash");
var objects_js_1 = require("../objects/objects.js");
/**
 * @abstract returns an array of ones with length n
 *
 * @param {Integer} n
 * @return {Array} ones
 */
exports.ones = function (n) { return Array(n).fill(1); };
/**
 * @abstract returns an array of indexes with val
 *
 * @param {Array} arr
 * @param {Number} val
 * @return {Array} indexes
 */
exports.getAllIndexes = function (arr, val) {
    var indexes = [];
    var i;
    for (i = 0; i < arr.length; i += 1) {
        if (arr[i] === val) {
            indexes.push(i);
        }
    }
    return indexes;
};
exports.countDict = function (arr) {
    var obj = {};
    for (var _i = 0, _a = lodash_1.default.range(arr.length); _i < _a.length; _i++) {
        var i = _a[_i];
        obj[arr[i]] = (obj[arr[i]] || 0) + 1;
    }
    return obj;
};
/**
 * @abstract returns a shifted word cyclily
 *
 * @param {Array} array
 * @param {Integer} index
 * @return {Array} shifted_array
 */
exports.cyclicSort = function (array, index) {
    if (array.length < index) {
        var category = 'Error';
        var subject = "Provided index " + index;
        var condition = "greater than array length " + array.length;
        console.error(category + " : " + subject + " " + condition);
    }
    var head = array.slice(index);
    var tail = array.slice(0, index);
    return head.concat(tail);
};
/**
 * @abstract returns true if control and treatment words are equal
 * in some sshifted way
 *
 * @param {Array} array
 * @param {Integer} index
 * @return {Array} shifted_array
 */
exports.isCyclicEqual = function (control_, treatment_) {
    if (control_.length !== treatment_.length) {
        return false;
    }
    for (var i = 0; i < treatment_.length; i += 1) {
        if (lodash_1.default.isEqual(exports.cyclicSort(treatment_, i), control_)) {
            return true;
        }
    }
    return false;
};
/**
 * @abstract returns a sorted array of integers. The possible types are below:
 * - 0: descending
 * - 1: ascending
 *
 * @param {Array} array
 * @param {Integer} type
 * @return {Array} sorted_array
 */
exports.sort = function (arr, sort_type) {
    if (sort_type === void 0) { sort_type = 0; }
    arr.sort(function (a, b) { return a - b; });
    if (sort_type == 0) {
        arr.reverse();
    }
    else if (sort_type == 1) {
        // Do nothing
    }
    else {
        throw Error('Sorting types are 0 and 1 for descending and ascending order.');
    }
    return arr;
};
/**
 * @abstract returns true if array has provided element
 *
 * @param {Array} array
 * @param {Object} elem
 * @return {boolean} has_element
 */
exports.hasElement = function (arr, elem) {
    for (var i = 0; i <= arr.length; i += 1) {
        if (lodash_1.default.isEqual(arr[i], elem)) {
            return true;
        }
    }
    return false;
};
/**
 * @abstract returns array with removed provided elements
 *
 * @param {Array} arr
 * @param {Object} elems
 * @return {Array} arr_without_elems
 */
exports.removeElements = function (arr, elems_to_del) {
    elems_to_del.forEach(function (elem_to_del) {
        arr = arr.filter(function (elem) { return elem_to_del !== elem; });
    });
    return arr;
};
/**
 * @abstract returns true if array has provided element
 *
 * @param {Array} a
 * @param {Array} b
 * @param {Array} c
 * @return {array} cartesian_product
 */
exports.cartesianProduct = function (a, b) {
    var c = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        c[_i - 2] = arguments[_i];
    }
    var f = function (a, b) { return [].concat.apply([], a.map(function (a) { return b.map(function (b) { return [].concat(a, b); }); })); };
    return b ? exports.cartesianProduct.apply(void 0, __spreadArrays([f(a, b)], c)) : a;
};
/**
 * @abstract
 *
 * @param {Array} list
 * @return {Array} unique_list
 */
exports.removeArrayDuplicates = function (list) {
    var unique = [];
    list.forEach(function (item) {
        var has_item = false;
        unique.forEach(function (unique_item) {
            has_item = has_item || lodash_1.default.isEqual(item, unique_item);
        });
        if (!has_item) {
            unique.push(item);
        }
    });
    return unique;
};
function mSetsOfnTuples(array, n, m) {
    var curr_comb, _i, _a, head_comb, _b, _c, tail_comb;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (m > Math.floor(array.length / n)) {
                    throw Error('Size of array must be greater or equal to the product of n by m');
                }
                curr_comb = [];
                _i = 0, _a = lodash_1.default.combinations(array, n);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                head_comb = _a[_i];
                curr_comb = [head_comb];
                if (!(m === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, curr_comb];
            case 2:
                _d.sent();
                return [3 /*break*/, 7];
            case 3:
                _b = 0, _c = mSetsOfnTuples(lodash_1.default.difference(array, head_comb), n, m - 1);
                _d.label = 4;
            case 4:
                if (!(_b < _c.length)) return [3 /*break*/, 7];
                tail_comb = _c[_b];
                return [4 /*yield*/, curr_comb.concat(tail_comb)];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _b++;
                return [3 /*break*/, 4];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}
exports.mSetsOfnTuples = mSetsOfnTuples;
/**
 * @abstract returns array unique values
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
exports.getUniques = function (vec) { return Array.from(new Set(vec)); };
/**
 * @abstract returns upper triangular indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
function fullPolytopeIndexesFn(length, curr_dim, dim) {
    var _i, _a, i, _b, _c, tail_indexes;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _i = 0, _a = lodash_1.default.range(0, length);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                i = _a[_i];
                if (!(curr_dim === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, i];
            case 2:
                _d.sent();
                return [3 /*break*/, 7];
            case 3:
                _b = 0, _c = fullPolytopeIndexesFn(length, curr_dim - 1, dim);
                _d.label = 4;
            case 4:
                if (!(_b < _c.length)) return [3 /*break*/, 7];
                tail_indexes = _c[_b];
                return [4 /*yield*/, [i].concat(tail_indexes)];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _b++;
                return [3 /*break*/, 4];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}
exports.fullPolytopeIndexesFn = fullPolytopeIndexesFn;
/**
 * @abstract returns upper triangular indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
function upperTriangularIndexesFn(length, curr_dim, dim, index) {
    var _i, _a, i, _b, _c, tail_indexes;
    if (index === void 0) { index = 0; }
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _i = 0, _a = lodash_1.default.range(index, length);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                i = _a[_i];
                if (!(curr_dim === 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, i];
            case 2:
                _d.sent();
                return [3 /*break*/, 7];
            case 3:
                _b = 0, _c = upperTriangularIndexesFn(length, curr_dim - 1, dim, i);
                _d.label = 4;
            case 4:
                if (!(_b < _c.length)) return [3 /*break*/, 7];
                tail_indexes = _c[_b];
                return [4 /*yield*/, [i].concat(tail_indexes)];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _b++;
                return [3 /*break*/, 4];
            case 7:
                _i++;
                return [3 /*break*/, 1];
            case 8: return [2 /*return*/];
        }
    });
}
exports.upperTriangularIndexesFn = upperTriangularIndexesFn;
/**
 * @abstract returns polytopic structure indexes from formation function
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
function hyperIndexes(length, dim, formationFn) {
    var _i, _a, indexes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (dim <= 0 || length <= 0) {
                    throw Error('Dimension and length must be positive natural numbers!');
                }
                _i = 0, _a = formationFn(length, dim, dim);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                indexes = _a[_i];
                return [4 /*yield*/, indexes];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
exports.hyperIndexes = hyperIndexes;
/**
 * @abstract returns full polytopic indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
function fullPolytopeHyperindexes(length, dim) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [5 /*yield**/, __values(hyperIndexes(length, dim, fullPolytopeIndexesFn))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.fullPolytopeHyperindexes = fullPolytopeHyperindexes;
/**
 * @abstract returns triangular polytopic indexes
 *
 * @param {Array} vec
 * @return {Array} arr_with_uniques
 */
function upperTriangularHyperindexes(length, dim) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [5 /*yield**/, __values(hyperIndexes(length, dim, upperTriangularIndexesFn))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
exports.upperTriangularHyperindexes = upperTriangularHyperindexes;
/**
 * @abstract returns each tuple [key, elems] of the Euler diagram
 * systematic in a generator-wise fashion
 *
 * @param {Array} sets
 * @return {Array} keys_elems
 */
function euler(sets) {
    var sets_keys_fun, compl_sets_keys, comb_str, celements, comb_intersec_key, comb_intersec, comb_excl, sets_keys, _i, sets_keys_1, set_key, _a, _b, comb_elements;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(Object.values(sets).length === 1)) return [3 /*break*/, 2];
                return [4 /*yield*/, Object.entries(sets)[0]];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2:
                if (Object.values(sets).length === 0)
                    throw Error('There must at least ONE set!');
                sets = objects_js_1.objectMap(sets, function (set_key, set) { return exports.sort(set, 1); });
                sets_keys_fun = function (sets_) { return Object
                    .keys(sets_)
                    .filter(function (key) { return sets_[key].length !== 0; }); };
                compl_sets_keys = [];
                comb_str = '';
                celements = [];
                comb_intersec_key = '';
                comb_intersec = [];
                comb_excl = [];
                sets_keys = sets_keys_fun(sets);
                _i = 0, sets_keys_1 = sets_keys;
                _c.label = 3;
            case 3:
                if (!(_i < sets_keys_1.length)) return [3 /*break*/, 13];
                set_key = sets_keys_1[_i];
                compl_sets_keys = lodash_1.default.difference(sets_keys, [set_key])
                    .filter(function (compl_set_key) { return sets[compl_set_key].length !== 0; })
                    .map(function (compl_set_key) { return String(compl_set_key); });
                if (!(compl_sets_keys.length !== 0 && sets[set_key].length !== 0)) return [3 /*break*/, 12];
                _a = 0, _b = euler(objects_js_1.objectReduce(compl_sets_keys, function (result, __, compl_set_key) {
                    result[compl_set_key] = sets[compl_set_key];
                    return result;
                }, {}));
                _c.label = 4;
            case 4:
                if (!(_a < _b.length)) return [3 /*break*/, 10];
                comb_elements = _b[_a];
                comb_str = comb_elements[0];
                celements = comb_elements[1];
                comb_excl = lodash_1.default.difference(celements, sets[set_key]);
                if (!(comb_excl.length !== 0)) return [3 /*break*/, 6];
                // Exclusive elements of group except current analysis set
                return [4 /*yield*/, [comb_str, comb_excl]];
            case 5:
                // Exclusive elements of group except current analysis set
                _c.sent();
                comb_str.split(',').forEach(function (ckey) {
                    sets[ckey] = lodash_1.default.difference(sets[ckey], comb_excl);
                });
                sets[set_key] = lodash_1.default.difference(sets[set_key], comb_excl);
                _c.label = 6;
            case 6:
                comb_intersec = lodash_1.default.intersection(celements, sets[set_key]);
                if (!(comb_intersec.length !== 0)) return [3 /*break*/, 8];
                // Intersection of analysis element and exclusive group
                comb_intersec_key = [set_key].concat(comb_str.split(',')).join(',');
                return [4 /*yield*/, [comb_intersec_key, comb_intersec]];
            case 7:
                _c.sent();
                comb_str.split(',').forEach(function (ckey) {
                    sets[ckey] = lodash_1.default.difference(sets[ckey], comb_intersec);
                });
                sets[set_key] = lodash_1.default.difference(sets[set_key], comb_intersec);
                _c.label = 8;
            case 8:
                sets_keys = sets_keys_fun(sets);
                _c.label = 9;
            case 9:
                _a++;
                return [3 /*break*/, 4];
            case 10:
                if (!(sets[set_key].length !== 0)) return [3 /*break*/, 12];
                return [4 /*yield*/, [String(set_key), sets[set_key]]];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 3];
            case 13: return [2 /*return*/];
        }
    });
}
exports.euler = euler;
/**
 * @abstract returns each tuple [key, elems] of the extended venn
 * systematic in a generator-wise fashion
 *
 * @param {Array} sets
 * @return {Array} keys_elems
 */
function venn(sets) {
    var keys_fun, comb_sets_inter, comb_sets_excl, cum_union_sofar, compl_set_elems, prev_keys_len, curr_keys_len, keys, _i, _a, chunk_card, _b, _c, comb_keys;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                keys_fun = function (sets_) { return Object.keys(sets_).map(function (key) { return Number(key); }).filter(function (key) { return sets_[key].length !== 0; }); };
                comb_sets_inter = {};
                comb_sets_excl = {};
                cum_union_sofar = [];
                compl_set_elems = [];
                prev_keys_len = -1;
                curr_keys_len = -1;
                keys = keys_fun(sets);
                _i = 0, _a = lodash_1.default.range(1, keys.length + 1);
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                chunk_card = _a[_i];
                _b = 0, _c = new lodash_1.default.combinations(keys, chunk_card);
                _d.label = 2;
            case 2:
                if (!(_b < _c.length)) return [3 /*break*/, 6];
                comb_keys = _c[_b];
                // In case any of the sets under analysis is empty
                if (exports.hasElement(__spreadArrays(comb_keys.map(function (key) { return sets[Number(key)]; })), []))
                    return [3 /*break*/, 5];
                // Intersection of elements
                comb_sets_inter = lodash_1.default.intersection.apply(lodash_1.default, comb_keys.map(function (key) { return sets[Number(key)]; }));
                compl_set_elems = lodash_1.default.uniq(lodash_1.default.flatten(lodash_1.default.difference(keys, comb_keys).map(function (set_key) { return sets[set_key]; })));
                comb_sets_excl = lodash_1.default.difference(comb_sets_inter, compl_set_elems);
                cum_union_sofar = lodash_1.default.union(cum_union_sofar, comb_sets_excl);
                if (!(comb_sets_excl.length !== 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, [comb_keys.toString(), comb_sets_excl]];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                // Verify if there is some empty set
                prev_keys_len = keys.length;
                sets = objects_js_1.objectReduce(sets, function (result, key, set_) {
                    result[key] = lodash_1.default.difference(set_, cum_union_sofar);
                    return result;
                }, {});
                keys = keys_fun(sets);
                curr_keys_len = keys.length;
                // If any set turned empty, break inner-loop. The chunk cardinality
                // in the inner-loop may be greater than the available non-empty sets.
                // Therefore, it is also a necessary condition. Both together are
                // sufficient for integers
                if (curr_keys_len < prev_keys_len && curr_keys_len < chunk_card) {
                    return [3 /*break*/, 6];
                }
                _d.label = 5;
            case 5:
                _b++;
                return [3 /*break*/, 2];
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}
exports.venn = venn;
exports.spreadEuler = function (lists) { return Object.fromEntries(__spreadArrays(euler(lists))); };
exports.spreadVenn = function (lists) { return Object.fromEntries(__spreadArrays(venn(lists))); };
