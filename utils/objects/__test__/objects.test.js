import { objectMap } from '../objects.js';

describe('objects', () => {
  it('should return twice the object value', () => {
    const myObject = { a: 1, b: 2, c: 3 };
    const newObject = objectMap(myObject, (value) => value * 2);

    expect(JSON.stringify(newObject)).toBe(
      '{\"a\":2,\"b\":4,\"c\":6}',
    );
  });
});
