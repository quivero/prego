import 'lodash.combinations';
import 'lodash.multicombinations';

import _ from 'lodash';

import {
  mSetsOfnTuples,
} from '../../utils/arrays/arrays.js';

import {
  throwError,
} from '../../utils/sys/sys.js';

import {
  isPrime,
} from '../../utils/numbers/numbers.js';

export const reduceDistance = (vertices, distance_fun) => {
  const indices_to_keys = this.getVerticesIndicestoKeys();
  let total_distance = 0;

  vertices.forEach(
    (vertex, index) => {
      if (index !== 0) {
        total_distance += distance_fun(vertices[index - 1], vertices[index]);
      }
    },
  );

  return total_distance;
};

/**
 * @abstract Iterative improvement based on 3 exchange.
 *
 * @param {Array} points
 * @param {Array} card_vec
 * @return {Array} blob_combs
 */
/*
const nopt = (vertices, distance_fun, blob_card, compare_card) => {
  if (compare_card > Math.floor(tour.length / blob_card)) {
    const blob_msg = `${compare_card} blobs`;
    const size_msg = `size ${blob_card}`;
    const set_msg = `a set of size ${tour.length}`;
    const task_msg = `build ${blob_msg} of ${size_msg} from ${set_msg}`;

    throwError(task_msg);
  }

  let new_blob_card = -1;
  let new_compare_card = -1;
  const blob_card_primes = {};
  let tour = vertices;

  if (tour.length === 1) {
    return tour;
  }
  for (
    const index_tuple_sets of mSetsOfnTuples(_.range(tour.length), blob_card, compare_card)
  ) {
    // Optimize blobs from within
    new_blob_card = isPrime(blob_card) ? Math.floor(blob_card / 2) : min_blob_card_prime;
    new_compare_card = isPrime(blob_card) ? 2 : blob_card_primes[min_blob_card_prime];

    index_tuple_sets = index_tuple_sets.map(
      (index_tuple_set) => {
        nopt(
          index_tuple_set.map((index) => tour[index]),
          distance_fun,
          new_blob_card,
          new_compare_card,
        );
      },
    );
  }

  return tour;
};
*/
