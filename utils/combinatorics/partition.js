// Javascript program to generate all unique partitions of an integer
import "lodash.combinations";
import _ from "lodash";

import { hasElement, ones, sort, getUniques } from "../arrays/arrays.js";

import { decimalPart } from "../math/math.js";

/*
 * @abstract returns unique partitions of an integer with
 * Source: https://cs.stackexchange.com/questions/150270/vector-of-1s-and-sum-of-elements
 * @param {Integer} number
 * @param {Integer} n_summands
 * @return {Array} partitions
 */
export const partitions = (n) => {
  if (decimalPart(n) !== 0 || n <= 0) {
    throw Error("Given number must be positive and natural!");
  }

  const all_partitions = [];
  const buffer = [..._.repeat(0, n)].map((str) => Number(str));

  // sum(buffer[index:]) will be s. Each entry will be at most m
  const partitions_recursive = (start, s, m) => {
    if (s === 0) {
      all_partitions.push([...buffer.slice(0, start)]);
    }

    for (const part of _.range(1, Math.min(s, m) + 1)) {
      buffer[start] = part;
      partitions_recursive(start + 1, s - part, Math.min(m, part));
    }
  };

  partitions_recursive(0, n, n);
  return all_partitions;
};

/**
 * @abstract returns
 *
 * @param {Array} points
 * @param {Array} card_vec
 * @return {Array} blob_combs
 */
export const cardvecCombinations = (points, card_vec) => {
  const elem_0 = card_vec[0];
  const blob_combs = [];
  let blob_comb = [];
  let elem_1_combs = [];

  if (points.length !== card_vec.reduce((a, b) => a + b)) {
    throw Error(
      "The sum of card_vec elements MUST be equal to points cardinality"
    );
  }

  if (card_vec.length === 1) {
    return [points];
  }

  for (const elem_0_comb of _.combinations(points, elem_0)) {
    blob_comb = [elem_0_comb];

    elem_1_combs = cardvecCombinations(
      _.difference(points, elem_0_comb),
      card_vec.slice(1)
    );

    blob_comb.push(elem_1_combs);
    blob_combs.push(blob_comb);
  }

  return blob_combs;
};

/*
export const constellationSeeker = (points, n_blobs, origins) => {
  if (points.length < n_blobs) {
    throw Error('Number of points MUST be greater than number of blobs');
  }

  let comb = [];

  for (const comb_vec of partitions(points.length, n_blobs)) {
    comb = cardvecCombinations(points_, comb_vec);
  }

  return [];
};
*/
