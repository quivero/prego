import _ from "lodash";
import {
  objectMap,
  objectReduce,
  objectFilter,
  objectDifference,
  objectIntersection,
  objectEqual,
  objectInit,
  objectFlatten,
  objectHasKey,
  objectHasKeys,
} from "../objects.js";

describe("objects", () => {
  it("should return an object initializer", () => {
    const newObject = objectInit(["a", "b"], []);

    expect(_.isEqual(Object.keys(newObject), ["a", "b"])).toBe(true);
  });

  it("should return twice the object value", () => {
    const myObject = { a: 1, b: 2, c: 3 };
    const newObject = objectMap(myObject, (key, value) => value * 2);

    expect(JSON.stringify(newObject)).toBe('{"a":2,"b":4,"c":6}');
  });

  it("should return filtered object", () => {
    const object_ = objectInit(["a", "b"], 1);
    object_.a = 2;

    const newObject = objectFilter(object_, (key, value) => value === 2);

    expect(JSON.stringify(newObject)).toBe(JSON.stringify({ a: 2 }));
  });

  it("should return boolean on key existence", () => {
    expect(objectHasKey({ a: 1, b: 2 }, "a")).toEqual(true);

    expect(objectHasKey({ a: 1, b: 2 }, "c")).toEqual(false);
  });

  it("should return boolean on keys existence", () => {
    const object = { a: 1, b: 2, c: 3 };
    
    expect(objectHasKeys(object, ['a'])).toEqual(true);
    expect(objectHasKeys(object, ['a', 'b'])).toEqual(true);
    expect(objectHasKeys(object, ['d'])).toEqual(false);
    expect(objectHasKeys(object, ['a', 'd'])).toEqual(false);
  });
  
  it("should return filtered object", () => {
    expect(
      objectFlatten({
        a: 1,
        b: {
          c: 3,
          d: {
            e: 4,
            f: 5,
          },
        },
      })
    ).toEqual({
      a: 1,
      "b.c": 3,
      "b.d.e": 4,
      "b.d.f": 5,
    });
  });

  it("should return reduced object by certain function", () => {
    const object_ = objectInit(["a", "b"], 1);

    const newObject = objectReduce(
      object_,
      (result, key, value) => {
        result[key] = 2 * value;
        return result;
      },
      {}
    );

    expect(JSON.stringify(newObject)).toBe(JSON.stringify({ a: 2, b: 2 }));
  });

  it("should return the difference between two objects", () => {
    const obj_1 = { a: 1, b: 2 };
    const obj_2 = { b: 1, c: 2 };

    const diff_object = objectDifference(
      obj_1,
      obj_2,
      (r_key, r_value, l_key, l_value) => r_key === l_key
    );

    expect(diff_object).toEqual({ a: 1 });
  });

  it("should return the intersection between two objects", () => {
    const obj_1 = { a: 1, b: 2 };
    const obj_2 = { b: 1, c: 2 };

    const intersec_object = objectIntersection(
      obj_1,
      obj_2,
      (r_key, r_value, l_key, l_value) => r_key === l_key,
      (r_key, r_value, l_key, l_value) => r_key,
      (r_key, r_value, l_key, l_value) => l_value
    );

    expect(intersec_object).toEqual({ b: 2 });
  });

  it("should return the equality statement between two objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, c: 2 };

    expect(
      objectEqual(obj1, obj2, () => {
        const intersec_keys = _.intersection(
          Object.keys(obj1),
          Object.keys(obj2)
        );

        return objectReduce(
          intersec_keys,
          (is_equal, ikey_id, ikey) => is_equal && obj1[ikey] === obj2[ikey],
          true
        );
      })
    ).toEqual(true);
  });
});
