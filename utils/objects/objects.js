import _, { zip } from 'lodash'

export const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key]);
  return result;
}, {});

export const initObject = (keys, init_value) => {
  return Object.fromEntries(
    zip(keys, _.repeat(init_value, keys.length))
  )
}
