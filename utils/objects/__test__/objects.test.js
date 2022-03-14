import {
  objectMap,
  objectReduce,
  objectFilter,
  objectInit,
} from '../objects.js';

import {
  arraysEqual,
} from '../../arrays/arrays.js';

describe('objects', () => {
  it('should return an object initializer', () => {
    const newObject = objectInit(['a', 'b'], []);

    expect(arraysEqual(Object.keys(newObject), ['a', 'b'])).toBe(true);
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
    object_['a'] = 2

    const newObject = objectFilter(
      object_,
      (key, value) => {
        return value === 2
      }
    )
    
    expect(JSON.stringify(newObject)).toBe(JSON.stringify({'a': 2}));
  });

  it('should return reduced object by certain function', () => {
    const object_ = objectInit(['a', 'b'], 1);

    const newObject = objectReduce(
      object_,
      (result, key, value) => {
        result[key] = 2*value
        return result
      }, {}
    )
    
    expect(
      JSON.stringify(newObject)
    ).toBe(
      JSON.stringify({'a': 2, 'b': 2})
    );
  });
});
