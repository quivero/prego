import _, { zip } from 'lodash'

export const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key]);
  return result;
}, {});

export const initObject = (keys, init_value) => {
  let a = [], total = keys.length;
  
  while(total--) a.push([]);

  return Object.fromEntries(
    zip(keys, [...a])
  )
}
