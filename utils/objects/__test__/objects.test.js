import {
  objectMap,
  objectReduce,
  objectFilter,
  objectDifference,
  objectIntersection,
  objectEqual,
  objectInit,
} from '../objects.js';

import _ from 'lodash';

describe('objects', () => {
  it('should return an object initializer', () => {
    const newObject = objectInit(['a', 'b'], []);

    expect(_.isEqual(Object.keys(newObject), ['a', 'b'])).toBe(true);
  });

  it('should return twice the object value', () => {
    const myObject = { a: 1, b: 2, c: 3 };
    const newObject = objectMap(myObject, (key, value) => value * 2);

    expect(JSON.stringify(newObject)).toBe(
      '{\"a\":2,\"b\":4,\"c\":6}',
    );
  });

  it('should return filtered object', () => {
    const object_ = objectInit(['a', 'b'], 1);
    object_.a = 2;

    const newObject = objectFilter(
      object_,
      (key, value) => value === 2,
    );

    expect(JSON.stringify(newObject)).toBe(JSON.stringify({ a: 2 }));
  });

  it('should return reduced object by certain function', () => {
    const object_ = objectInit(['a', 'b'], 1);

    const newObject = objectReduce(
      object_,
      (result, key, value) => {
        result[key] = 2 * value;
        return result;
      },
      {},
    );

    expect(
      JSON.stringify(newObject),
    ).toBe(
      JSON.stringify({ a: 2, b: 2 }),
    );
  });

  it('should return the difference between two objects', () => {
    let obj_1 = {'a': 1, 'b': 2};
    let obj_2 = {'b': 1, 'c': 2};
    
    const diff_object = objectDifference(
      obj_1, obj_2,
      (
        r_key, r_value,
        l_key, l_value
      ) => r_key === l_key
    );
    
    expect(diff_object).toEqual(
      {'a': 1}
    );
  });

  it('should return the intersection between two objects', () => {
    let obj_1 = {'a': 1, 'b': 2};
    let obj_2 = {'b': 1, 'c': 2};

    const intersec_object = objectIntersection(
      obj_1, obj_2,
      (
        r_key, r_value,
        l_key, l_value
      ) => r_key === l_key,
      (
        r_key, r_value,
        l_key, l_value
      ) => r_key,
      (
        r_key, r_value,
        l_key, l_value
      ) => l_value
    );

    expect(intersec_object).toEqual(
      {'b': 2}
    );
  });

  it('should return the equality statement between two objects', () => {
    let obj1 = {'a': 1, 'b': 2};
    let obj2 = {'a': 1, 'c': 2};
    
    expect(
      objectEqual(
        obj1, obj2,
        () => {
          let intersec_keys = _.intersection(
            Object.keys(obj1),
            Object.keys(obj2)
          )
          
          return objectReduce(
            intersec_keys,
            (is_equal, ikey_id, ikey) => is_equal && (obj1[ikey] === obj2[ikey]),
            true)
        }
      )
    ).toEqual(true);
  });
});
