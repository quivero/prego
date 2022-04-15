"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper class for visited vertex metadata.
 */
var VisitMetadata = /** @class */ (function () {
    function VisitMetadata(_a) {
        var discoveryTime = _a.discoveryTime, lowDiscoveryTime = _a.lowDiscoveryTime;
        this.discoveryTime = discoveryTime;
        this.lowDiscoveryTime = lowDiscoveryTime;
        // We need this in order to check graph root node, whether it has two
        // disconnected children or not.
        this.independentChildrenCount = 0;
    }
    return VisitMetadata;
}());
exports.default = VisitMetadata;
