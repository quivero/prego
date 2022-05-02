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
  primeFactors,
} from '../../utils/numbers/numbers.js';

/**
 * @abstract Iterative improvement based on 3 exchange.
 *
 * @param {Array} points
 * @param {Array} card_vec
 * @return {Array} blob_combs
 */
const nopt = (tour, distance_fun, blob_card, compare_card) => {
  if (compare_card > Math.floor(tour.length/blob_card)) {
    const blob_msg = `${compare_card} blobs`;
    const size_msg = `size ${blob_card}`;
    const set_msg = `a set of size ${tour.length}`;
    
    const error_msg = `It is not possible to build ${blob_msg} of ${size_msg} from ${set_msg}`;
    
    throw Error(error_msg);
  }
  
  for (
    const index_tuple_sets of mSetsOfnTuples(
      _.range(tour.length), compare_card, blob_card
      )
    ) {
    for (
      const index_tuple of upperTriangularHyperindexes(
        tour.length, compare_card
        )
    ) {
      
    }
  }

  return tour;
};
