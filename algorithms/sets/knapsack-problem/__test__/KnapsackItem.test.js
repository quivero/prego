import KnapsackItem from "../KnapsackItem";

let trivia, result, expected;

describe("KnapsackItem", () => {
  it("should create knapsack item and count its total weight and value", () => {
    const knapsackItem = new KnapsackItem({ value: 3, weight: 2 });

    trivia = [
      [knapsackItem.value, 3],
      [knapsackItem.weight, 2],
      [knapsackItem.quantity, 1],
      [knapsackItem.valuePerWeightRatio, 1.5],
      [knapsackItem.toString(), "v3 w2 x1"],
      [knapsackItem.totalValue, 3],
      [knapsackItem.totalWeight, 2],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }

    knapsackItem.quantity = 0;

    trivia = [
      [knapsackItem.value, 3],
      [knapsackItem.weight, 2],
      [knapsackItem.quantity, 0],
      [knapsackItem.valuePerWeightRatio, 1.5],
      [knapsackItem.toString(), "v3 w2 x0"],
      [knapsackItem.totalValue, 0],
      [knapsackItem.totalWeight, 0],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }

    knapsackItem.quantity = 2;

    trivia = [
      [knapsackItem.value, 3],
      [knapsackItem.weight, 2],
      [knapsackItem.quantity, 2],
      [knapsackItem.valuePerWeightRatio, 1.5],
      [knapsackItem.toString(), "v3 w2 x2"],
      [knapsackItem.totalValue, 6],
      [knapsackItem.totalWeight, 4],
    ];

    for (const item of trivia) {
      result = item[0];
      expected = item[1];

      expect(result).toBe(expected);
    }
  });
});
