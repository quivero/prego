import RedBlackTree from '../RedBlackTree';

describe('RedBlackTree', () => {
  it('should always color first inserted node as black', () => {
    const tree = new RedBlackTree();

    const firstInsertedNode = tree.insert(10);

    expect(tree.isNodeColored(firstInsertedNode)).toBeTrue();
    expect(tree.isNodeBlack(firstInsertedNode)).toBeTrue();
    expect(tree.isNodeRed(firstInsertedNode)).toBeFalse();

    expect(tree.toString()).toBe('10');
    expect(tree.root.height).toBe(0);
  });

  it('should always color new leaf node as red', () => {
    const tree = new RedBlackTree();

    const firstInsertedNode = tree.insert(10);
    const secondInsertedNode = tree.insert(15);
    const thirdInsertedNode = tree.insert(5);

    expect(tree.isNodeBlack(firstInsertedNode)).toBeTrue();
    expect(tree.isNodeRed(secondInsertedNode)).toBeTrue();
    expect(tree.isNodeRed(thirdInsertedNode)).toBeTrue();

    expect(tree.toString()).toBe('5,10,15');
    expect(tree.root.height).toBe(1);
  });

  it('should balance itself', () => {
    const tree = new RedBlackTree();

    tree.insert(5);
    tree.insert(10);
    tree.insert(15);
    tree.insert(20);
    tree.insert(25);
    tree.insert(30);

    expect(tree.toString()).toBe('5,10,15,20,25,30');
    expect(tree.root.height).toBe(3);
  });

  it('should balance itself when parent is black', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);

    expect(tree.isNodeBlack(node1)).toBeTrue();

    const node2 = tree.insert(-10);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeRed(node2)).toBeTrue();

    const node3 = tree.insert(20);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeRed(node2)).toBeTrue();
    expect(tree.isNodeRed(node3)).toBeTrue();

    const node4 = tree.insert(-20);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();

    const node5 = tree.insert(25);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();

    const node6 = tree.insert(6);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();

    expect(tree.toString()).toBe('-20,-10,6,10,20,25');
    expect(tree.root.height).toBe(2);

    const node7 = tree.insert(4);

    expect(tree.root.left.value).toEqual(node2.value);

    expect(tree.toString()).toBe('-20,-10,4,6,10,20,25');
    expect(tree.root.height).toBe(3);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeRed(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeBlack(node4)).toBeTrue();
    expect(tree.isNodeBlack(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();
    expect(tree.isNodeBlack(node6)).toBeTrue();
    expect(tree.isNodeRed(node7)).toBeTrue();
  });

  it('should balance itself when uncle is red', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(-20);
    const node5 = tree.insert(6);
    const node6 = tree.insert(15);
    const node7 = tree.insert(25);
    const node8 = tree.insert(2);
    const node9 = tree.insert(8);

    expect(tree.toString()).toBe('-20,-10,2,6,8,10,15,20,25');
    expect(tree.root.height).toBe(3);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeRed(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeBlack(node4)).toBeTrue();
    expect(tree.isNodeBlack(node5)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();
    expect(tree.isNodeRed(node7)).toBeTrue();
    expect(tree.isNodeRed(node8)).toBeTrue();
    expect(tree.isNodeRed(node9)).toBeTrue();

    const node10 = tree.insert(4);

    expect(tree.toString()).toBe('-20,-10,2,4,6,8,10,15,20,25');
    expect(tree.root.height).toBe(3);

    expect(tree.root.value).toBe(node5.value);

    expect(tree.isNodeBlack(node5)).toBeTrue();
    expect(tree.isNodeRed(node1)).toBeTrue();
    expect(tree.isNodeRed(node2)).toBeTrue();
    expect(tree.isNodeRed(node10)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();
    expect(tree.isNodeRed(node7)).toBeTrue();
    expect(tree.isNodeBlack(node4)).toBeTrue();
    expect(tree.isNodeBlack(node8)).toBeTrue();
    expect(tree.isNodeBlack(node9)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
  });

  it('should do left-left rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(7);
    const node5 = tree.insert(15);

    expect(tree.toString()).toBe('-10,7,10,15,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();

    const node6 = tree.insert(13);

    expect(tree.toString()).toBe('-10,7,10,13,15,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node5)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();
    expect(tree.isNodeRed(node3)).toBeTrue();
  });

  it('should do left-right rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(7);
    const node5 = tree.insert(15);

    expect(tree.toString()).toBe('-10,7,10,15,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();

    const node6 = tree.insert(17);

    expect(tree.toString()).toBe('-10,7,10,15,17,20');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node6)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();
    expect(tree.isNodeRed(node3)).toBeTrue();
  });

  it('should do recoloring, left-left and left-right rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(-20);
    const node5 = tree.insert(6);
    const node6 = tree.insert(15);
    const node7 = tree.insert(30);
    const node8 = tree.insert(1);
    const node9 = tree.insert(9);

    expect(tree.toString()).toBe('-20,-10,1,6,9,10,15,20,30');
    expect(tree.root.height).toBe(3);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeRed(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeBlack(node4)).toBeTrue();
    expect(tree.isNodeBlack(node5)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();
    expect(tree.isNodeRed(node7)).toBeTrue();
    expect(tree.isNodeRed(node8)).toBeTrue();
    expect(tree.isNodeRed(node9)).toBeTrue();

    tree.insert(4);

    expect(tree.toString()).toBe('-20,-10,1,4,6,9,10,15,20,30');
    expect(tree.root.height).toBe(3);
  });

  it('should do right-left rotation', () => {
    const tree = new RedBlackTree();

    const node1 = tree.insert(10);
    const node2 = tree.insert(-10);
    const node3 = tree.insert(20);
    const node4 = tree.insert(-20);
    const node5 = tree.insert(6);
    const node6 = tree.insert(30);

    expect(tree.toString()).toBe('-20,-10,6,10,20,30');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node3)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();

    const node7 = tree.insert(25);

    const rightNode = tree.root.right;
    const rightLeftNode = rightNode.left;
    const rightRightNode = rightNode.right;

    expect(rightNode.value).toBe(node7.value);
    expect(rightLeftNode.value).toBe(node3.value);
    expect(rightRightNode.value).toBe(node6.value);

    expect(tree.toString()).toBe('-20,-10,6,10,20,25,30');
    expect(tree.root.height).toBe(2);

    expect(tree.isNodeBlack(node1)).toBeTrue();
    expect(tree.isNodeBlack(node2)).toBeTrue();
    expect(tree.isNodeBlack(node7)).toBeTrue();
    expect(tree.isNodeRed(node4)).toBeTrue();
    expect(tree.isNodeRed(node5)).toBeTrue();
    expect(tree.isNodeRed(node3)).toBeTrue();
    expect(tree.isNodeRed(node6)).toBeTrue();
  });

  it('should do left-left rotation with left grand-parent', () => {
    const tree = new RedBlackTree();

    tree.insert(20);
    tree.insert(15);
    tree.insert(25);
    tree.insert(10);
    tree.insert(5);

    expect(tree.toString()).toBe('5,10,15,20,25');
    expect(tree.root.height).toBe(2);
  });

  it('should do right-right rotation with left grand-parent', () => {
    const tree = new RedBlackTree();

    tree.insert(20);
    tree.insert(15);
    tree.insert(25);
    tree.insert(17);
    tree.insert(19);

    expect(tree.toString()).toBe('15,17,19,20,25');
    expect(tree.root.height).toBe(2);
  });

  it('should throw an error when trying to remove node', () => {
    const removeNodeFromRedBlackTree = () => {
      const tree = new RedBlackTree();

      tree.remove(1);
    };

    expect(removeNodeFromRedBlackTree).toThrow();
  });
});
