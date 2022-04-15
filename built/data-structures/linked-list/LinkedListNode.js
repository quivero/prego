"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LinkedListNode = /** @class */ (function () {
    function LinkedListNode(value, next) {
        if (next === void 0) { next = null; }
        this.value = value;
        this.next = next;
    }
    LinkedListNode.prototype.toString = function (callback) {
        return callback ? callback(this.value) : "" + this.value;
    };
    return LinkedListNode;
}());
exports.default = LinkedListNode;
