// Javascript program to generate all unique partitions of an integer
import 'lodash.combinations';
import _ from 'lodash';

import { decimalPart } from '../math/math.js';
import { throwError } from '../sys/sys.js';

/*
 * @abstract returns unique partitions of an integer with
 * Source: https://cs.stackexchange.com/questions/150270/vector-of-1s-and-sum-of-elements
 * @param {Integer} number
 * @param {Integer} n_summands
 * @return {Array} partitions
 */
export const partitions = (n) => {
  if (decimalPart(n) !== 0 || n <= 0) {
    throwError('Given number must be positive and natural!');
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
  let elem_0 = card_vec[0];
  let blob_combs = [];
  let blob_comb = [];
  let elem_1_combs = [];
  let points_diff;
  let error_msg;

  if (points.length !== card_vec.reduce((a, b) => a + b)) {
    error_msg =
      'The sum of card_vec elements MUST be equal to points cardinality';
    throwError(error_msg);
  } else if (card_vec.length === 1) {
    return [points];
  } else {
    for (const elem_0_comb of _.combinations(points, elem_0)) {
      blob_comb = [elem_0_comb];
      points_diff = _.difference(points, elem_0_comb);

      elem_1_combs = cardvecCombinations(points_diff, card_vec.slice(1));

      blob_comb.push(elem_1_combs);
      blob_combs.push(blob_comb);
    }

    return blob_combs;
  }
};
