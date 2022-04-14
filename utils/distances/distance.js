import _ from 'lodash';
import {
  decimalPart,
} from '../math/math.js';

export const nNormDistanceFn = (coordinate_1, coordinate_2, n) => {
    const coord_diffs = _.zip(coordinate_1, coordinate_2).map(
        (coord_tuple) => Math.abs(coord_tuple[1] - coord_tuple[0]),
    );
    
    if (n === Infinity) {
        return Math.max(...coord_diffs);
    }   

    if (n < 1 || decimalPart(n) !== 0) {
        throw Error('The exponent n must be non-zero natural!');
    }

    return coord_diffs.reduce((curr_dist, coord_diff) => curr_dist + Math.abs(coord_diff) ** n, 0) ** (1 / n);
};
