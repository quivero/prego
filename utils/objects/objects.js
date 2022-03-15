import _ from 'lodash';

export const objectInit = (keys, init_value) => {
  const a = [];
  let total = keys.length;

  while (total--) a.push(_.cloneDeep(init_value));

  return Object.fromEntries(
    _.zip(keys, [...a]),
  );
};

export const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(key, object[key]);
  return result;
}, {});

export const objectReduce = (object, reduceFn, init_val) => {
  return Object.entries(_.cloneDeep(object)).reduce(
    (result, 
     [key, value]) => {
      return reduceFn(result, key, value)
     }, init_val
  )
}

export const objectFilter = (object, filterFn) => {
  let object_copy = _.cloneDeep(object);

  Object.entries(object_copy).forEach(
    ([key, value]) => {
      if (!filterFn(key, value)) {
        delete object_copy[key];
      }
    },
  );
  
  return object_copy;
};

export const objectKeyFind = (object, findFn) => Object.keys(objectFilter(object, findFn))
