"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _length;
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_js_1 = require("../linked-list/LinkedList.js");
var Queue = /** @class */ (function () {
    function Queue() {
        _length.set(this, void 0);
        // We're going to implement Queue based on LinkedList since the two
        // structures are quite similar. Namely, they both operate mostly on
        // the elements at the beginning and the end. Compare enqueue/dequeue
        // operations of Queue with append/deleteHead operations of LinkedList.
        this.linkedList = new LinkedList_js_1.default();
        __classPrivateFieldSet(this, _length, 0);
    }
    Object.defineProperty(Queue.prototype, "length", {
        get: function () {
            return this.linkedList.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {boolean}
     */
    Queue.prototype.isEmpty = function () {
        return !this.linkedList.head;
    };
    /**
     * Read the element at the front of the queue without removing it.
     * @return {*}
     */
    Queue.prototype.peek = function () {
        if (!this.linkedList.head) {
            return null;
        }
        return this.linkedList.head.value;
    };
    /**
     * Add a new element to the end of the queue (the tail of the linked list).
     * This element will be processed after all elements ahead of it.
     * @param {*} value
     */
    Queue.prototype.enqueue = function (value) {
        this.linkedList.append(value);
    };
    /**
     * Remove the element at the front of the queue (the head of the linked list).
     * If the queue is empty, return null.
     * @return {*}
     */
    Queue.prototype.dequeue = function () {
        var removedHead = this.linkedList.deleteHead();
        return removedHead ? removedHead.value : null;
    };
    /**
     * @param [callback]
     * @return {string}
     */
    Queue.prototype.toString = function (callback) {
        // Return string representation of the queue's linked list.
        return this.linkedList.toString(callback);
    };
    return Queue;
}());
exports.default = Queue;
_length = new WeakMap();
