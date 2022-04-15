"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedList_js_1 = require("../linked-list/LinkedList.js");
var Stack = /** @class */ (function () {
    function Stack() {
        // We're going to implement Stack based on LinkedList since these
        // structures are quite similar. Compare push/pop operations of the Stack
        // with prepend/deleteHead operations of LinkedList.
        this.linkedList = new LinkedList_js_1.default();
    }
    /**
     * @return {boolean}
     */
    Stack.prototype.isEmpty = function () {
        // The stack is empty if its linked list doesn't have a head.
        return !this.linkedList.head;
    };
    /**
     * @return {*}
     */
    Stack.prototype.peek = function () {
        if (this.isEmpty()) {
            // If the linked list is empty then there is nothing to peek from.
            return null;
        }
        // Just read the value from the start of linked list without deleting it.
        return this.linkedList.head.value;
    };
    /**
     * @param {*} value
     */
    Stack.prototype.push = function (value) {
        // Pushing means to lay the value on top of the stack. Therefore let's just add
        // the new value at the start of the linked list.
        this.linkedList.prepend(value);
    };
    /**
     * @return {*}
     */
    Stack.prototype.pop = function () {
        // Let's try to delete the first node (the head) from the linked list.
        // If there is no head (the linked list is empty) just return null.
        var removedHead = this.linkedList.deleteHead();
        return removedHead ? removedHead.value : null;
    };
    /**
     * @return {*[]}
     */
    Stack.prototype.toArray = function () {
        return this.linkedList
            .toArray()
            .map(function (linkedListNode) { return linkedListNode.value; });
    };
    /**
     * @param {function} [callback]
     * @return {string}
     */
    Stack.prototype.toString = function (callback) {
        return this.linkedList.toString(callback);
    };
    return Stack;
}());
exports.default = Stack;
