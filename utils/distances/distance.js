import {
    decimalPart
} from "../math/math.js"

import _ from 'lodash'

export const nNormDistanceFn = (coordinate_1, coordinate_2, n) => {
    if(n < 1 || decimalPart(n) !== 0) {
        throw Error('The exponent n must be non-zero natural!');
    }

    let coord_diffs = _.zip(coordinate_1, coordinate_2).map(
        (coord_tuple) => Math.abs(coord_tuple[1]-coord_tuple[0])
    )
    
    if(n === Infinity) {
        return Math.max(coord_diffs);
    } else {
        return Math.pow(
            coord_diffs.reduce(
                (curr_dist, coord_diff) => curr_dist + Math.pow(Math.abs(coord_diff), n), 0
            ), 1/n
        )
    }
}