import Knapsack from "../Knapsack";
import KnapsackItem from "../KnapsackItem";

let trivia, result, expected;

describe("Knapsack", () => {
  it("should solve 0/1 knapsack problem", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 3 }),
      new KnapsackItem({ value: 5, weight: 4 }),
      new KnapsackItem({ value: 7, weight: 5 }),
    ];

    const maxKnapsackWeight = 7;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    trivia = [
      [knapsack.totalValue, 9],
      [knapsack.totalWeight, 7],
      [knapsack.selectedItems.length, 2],
      [knapsack.selectedItems[0].toString(), "v5 w4 x 1"],
      [knapsack.selectedItems[1].toString(), "v4 w3 x 1"],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });

  it("should solve 0/1 knapsack problem regardless of items order", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 5, weight: 4 }),
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 7, weight: 5 }),
      new KnapsackItem({ value: 4, weight: 3 }),
    ];

    const maxKnapsackWeight = 7;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    trivia = [
      [knapsack.totalValue, 9],
      [knapsack.totalWeight, 7],
      [knapsack.selectedItems.length, 2],
      [knapsack.selectedItems[0].toString(), "v5 w4 x 1"],
      [knapsack.selectedItems[1].toString(), "v4 w3 x 1"],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });

  it("should solve 0/1 knapsack problem with impossible items set", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 5, weight: 40 }),
      new KnapsackItem({ value: 1, weight: 10 }),
      new KnapsackItem({ value: 7, weight: 50 }),
      new KnapsackItem({ value: 4, weight: 30 }),
    ];

    const maxKnapsackWeight = 7;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    trivia = [
      [knapsack.totalValue, 0],
      [knapsack.totalWeight, 0],
      [knapsack.selectedItems.length, 0],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });

  it("should solve 0/1 knapsack problem with all equal weights", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 5, weight: 1 }),
      new KnapsackItem({ value: 1, weight: 1 }),
      new KnapsackItem({ value: 7, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 1 }),
      new KnapsackItem({ value: 4, weight: 1 }),
    ];

    const maxKnapsackWeight = 3;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveZeroOneKnapsackProblem();

    trivia = [
      [knapsack.totalValue, 16],
      [knapsack.totalWeight, 3],
      [knapsack.selectedItems.length, 3],
      [knapsack.selectedItems[0].toString(), "v4 w1 x 1"],
      [knapsack.selectedItems[1].toString(), "v5 w1 x 1"],
      [knapsack.selectedItems[2].toString(), "v7 w1 x 1"],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });

  it("should solve unbound knapsack problem", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 84, weight: 7 }), // v/w ratio is 12
      new KnapsackItem({ value: 5, weight: 2 }), // v/w ratio is 2.5
      new KnapsackItem({ value: 12, weight: 3 }), // v/w ratio is 4
      new KnapsackItem({ value: 10, weight: 1 }), // v/w ratio is 10
      new KnapsackItem({ value: 20, weight: 2 }), // v/w ratio is 10
    ];

    const maxKnapsackWeight = 15;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveUnboundedKnapsackProblem();

    trivia = [
      [knapsack.totalValue, 84 + 20 + 12 + 10 + 5],
      [knapsack.totalWeight, 15],
      [knapsack.selectedItems.length, 5],
      [knapsack.selectedItems[0].toString(), "v84 w7 x 1"],
      [knapsack.selectedItems[1].toString(), "v20 w2 x 1"],
      [knapsack.selectedItems[2].toString(), "v10 w1 x 1"],
      [knapsack.selectedItems[3].toString(), "v12 w3 x 1"],
      [knapsack.selectedItems[4].toString(), "v5 w2 x 1"],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });

  it("should solve unbound knapsack problem with items in stock", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 84, weight: 7, itemsInStock: 3 }), // v/w ratio is 12
      new KnapsackItem({ value: 5, weight: 2, itemsInStock: 2 }), // v/w ratio is 2.5
      new KnapsackItem({ value: 12, weight: 3, itemsInStock: 1 }), // v/w ratio is 4
      new KnapsackItem({ value: 10, weight: 1, itemsInStock: 6 }), // v/w ratio is 10
      new KnapsackItem({ value: 20, weight: 2, itemsInStock: 8 }), // v/w ratio is 10
    ];

    const maxKnapsackWeight = 17;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveUnboundedKnapsackProblem();

    [knapsack.totalValue, 84 + 84 + 20 + 10],
      [knapsack.totalWeight, 17],
      [knapsack.selectedItems.length, 3],
      [knapsack.selectedItems[0].toString(), "v84 w7 x 2"],
      [knapsack.selectedItems[1].toString(), "v20 w2 x 1"],
      [knapsack.selectedItems[2].toString(), "v10 w1 x 1"];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });

  it("should solve unbound knapsack problem with items in stock and max weight more than sum of all items", () => {
    const possibleKnapsackItems = [
      new KnapsackItem({ value: 84, weight: 7, itemsInStock: 3 }), // v/w ratio is 12
      new KnapsackItem({ value: 5, weight: 2, itemsInStock: 2 }), // v/w ratio is 2.5
      new KnapsackItem({ value: 12, weight: 3, itemsInStock: 1 }), // v/w ratio is 4
      new KnapsackItem({ value: 10, weight: 1, itemsInStock: 6 }), // v/w ratio is 10
      new KnapsackItem({ value: 20, weight: 2, itemsInStock: 8 }), // v/w ratio is 10
    ];

    const maxKnapsackWeight = 60;

    const knapsack = new Knapsack(possibleKnapsackItems, maxKnapsackWeight);

    knapsack.solveUnboundedKnapsackProblem();

    [knapsack.totalValue, 3 * 84 + 2 * 5 + 1 * 12 + 6 * 10 + 8 * 20],
      [knapsack.totalWeight, 3 * 7 + 2 * 2 + 1 * 3 + 6 * 1 + 8 * 2],
      [knapsack.selectedItems.length, 5],
      [knapsack.selectedItems[0].toString(), "v84 w7 x 3"],
      [knapsack.selectedItems[1].toString(), "v20 w2 x 8"],
      [knapsack.selectedItems[2].toString(), "v10 w1 x 6"],
      [knapsack.selectedItems[3].toString(), "v12 w3 x 1"],
      [knapsack.selectedItems[4].toString(), "v5 w2 x 2"];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });
});
