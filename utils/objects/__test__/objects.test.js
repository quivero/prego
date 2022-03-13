import {
  objectMap,
  objectFilter,
  initObject,
} from '../objects.js';

import {
  arraysEqual,
} from '../../arrays/arrays.js';

describe('objects', () => {
  it('should return twice the object value', () => {
    const myObject = { a: 1, b: 2, c: 3 };
    const newObject = objectMap(myObject, (key, value) => value * 2);

    expect(JSON.stringify(newObject)).toBe(
      '{\"a\":2,\"b\":4,\"c\":6}',
    );
  });

  it('should return an object initializer', () => {
    const newObject = initObject(['a', 'b'], []);

    expect(arraysEqual(Object.keys(newObject), ['a', 'b'])).toBe(true);
  });

  it('should return filtered object', () => {
    const object_ = initObject(['a', 'b'], 1);
    object_['a'] = 2

    const newObject = objectFilter(
      object_,
      (key, value) => {
        return value === 2
      }
    )
    
    expect(JSON.stringify(newObject)).toBe(JSON.stringify({'b': 1}));
  });
});
