"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 * @abstract returns an object with given keys and initial value
 *
 * @param {Array} keys
 * @param {Object} initial_value
 * @return {Object}
 */
exports.objectInit = function (keys, init_value) {
    var a = [];
    var total = keys.length;
    while (total--)
        a.push(lodash_1.default.cloneDeep(init_value));
    return Object.fromEntries(lodash_1.default.zip(keys, __spreadArrays(a)));
};
/**
 * @abstract returns an object mapped values for keys and value
 *
 * @param {Object} object
 * @param {function} mapFn
 * @return {Object}
 */
exports.objectMap = function (object, mapFn) { return Object.keys(object).reduce(function (result, key) {
    result[key] = mapFn(key, object[key]);
    return result;
}, {}); };
/**
 * @abstract returns a reduced object
 *
 * @param {Object} object
 * @param {function} reduceFn
 * @return {Object}
 */
exports.objectReduce = function (object, reduceFn, init_val) { return Object.entries(lodash_1.default.cloneDeep(object)).reduce(function (result, _a) {
    var key = _a[0], value = _a[1];
    return reduceFn(result, key, value);
}, init_val); };
/**
 * @abstract returns a filtered object
 *
 * @param {Object} object
 * @param {function} filterFn
 * @return {Object}
 */
exports.objectFilter = function (object, filterFn) {
    var object_copy = lodash_1.default.cloneDeep(object);
    Object.entries(object_copy).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (!filterFn(key, value)) {
            delete object_copy[key];
        }
    });
    return object_copy;
};
/**
 * @abstract returns the keys of a filtered object
 *
 * @param {Object} object
 * @param {function} filterFn
 * @return {Object} filtered_object
 */
exports.objectKeyFind = function (object, findFn) { return Object.keys(exports.objectFilter(object, findFn)); };
/**
 * @abstract iterates along an object
 *
 * @param {Object} object
 * @param {function} forEachFn
 */
exports.objectForEach = function (object, forEachFn) {
    exports.objectMap(object, forEachFn);
};
/**
 * @abstract returns the difference between two json objects
 *
 * @param {Object} l_object
 * @param {Object} r_object
 * @param {function} equalFn
 * @return {Object}
 */
exports.objectDifference = function (l_object, r_object, equalFn) { return exports.objectReduce(r_object, function (curr_diff, r_key, r_value) { return exports.objectFilter(curr_diff, function (l_key, l_value) { return !equalFn(r_key, r_value, l_key, l_value); }); }, l_object); };
/**
 * @abstract returns the intersection between two json objects
 *
 * @param {Object} l_object
 * @param {Object} r_object
 * @param {function} equalFn
 * @return {Object}
 */
exports.objectIntersection = function (l_object, r_object, equalFn, keyFn, valueFn) { return exports.objectReduce(r_object, function (curr_intersec, r_key, r_value) {
    exports.objectForEach(l_object, function (l_key, l_value) {
        if (equalFn(r_key, r_value, l_key, l_value)) {
            curr_intersec[keyFn(r_key, r_value, l_key, l_value)] = valueFn(r_key, r_value, l_key, l_value);
        }
    }, {});
    return curr_intersec;
}, {}); };
/**
 * @abstract returns true for two equal json objects
 *
 * @param {Object} l_object
 * @param {Object} r_object
 * @param {function} equalFn
 * @return {Object}
 */
exports.objectEqual = function (l_object, r_object, equalFn) { return equalFn(l_object, r_object); };
