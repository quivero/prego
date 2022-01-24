/**
 * Helper class for visited vertex metadata.
 */
export default class VisitMetadata {
  constructor({ discoveryTime, lowDiscoveryTime }) {
    this.discoveryTime = discoveryTime;
    this.lowDiscoveryTime = lowDiscoveryTime;
    // We need this in order to check graph root node, whether it has two
    // disconnected children or not.
    this.independentChildrenCount = 0;
  }
}
