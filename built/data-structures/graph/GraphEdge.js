"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphEdge = /** @class */ (function () {
    /**
     * @param {GraphVertex} startVertex
     * @param {GraphVertex} endVertex
     * @param {number} [weight=1]
     */
    function GraphEdge(startVertex, endVertex, weight) {
        if (weight === void 0) { weight = 0; }
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.weight = weight;
    }
    /**
     * @return {string}
     */
    GraphEdge.prototype.getKey = function () {
        var startVertexKey = this.startVertex.getKey();
        var endVertexKey = this.endVertex.getKey();
        return startVertexKey + "_" + endVertexKey;
    };
    /**
     * @return {GraphEdge}
     */
    GraphEdge.prototype.reverse = function () {
        var tmp = this.startVertex;
        this.startVertex = this.endVertex;
        this.endVertex = tmp;
        return this;
    };
    /**
     * @return {string}
     */
    GraphEdge.prototype.toString = function () {
        return this.getKey();
    };
    return GraphEdge;
}());
exports.default = GraphEdge;
