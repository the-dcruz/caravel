import shortid from 'shortid';
import { compose } from 'redux';
import persistState from 'redux-localstorage';

export function addToObject(state, arrKey, obj) {
  const newObject = Object.assign({}, state[arrKey]);
  const copiedObject = Object.assign({}, obj);

  if (!copiedObject.id) {
    copiedObject.id = shortid.generate();
  }
  newObject[copiedObject.id] = copiedObject;
  return Object.assign({}, state, { [arrKey]: newObject });
}

export function alterInObject(state, arrKey, obj, alterations) {
  const newObject = Object.assign({}, state[arrKey]);
  newObject[obj.id] = Object.assign({}, newObject[obj.id], alterations);
  return Object.assign({}, state, { [arrKey]: newObject });
}

export function alterInArr(state, arrKey, obj, alterations) {
  // Finds an item in an array in the state and replaces it with a
  // new object with an altered property
  const idKey = 'id';
  const newArr = [];
  state[arrKey].forEach((arrItem) => {
    if (obj[idKey] === arrItem[idKey]) {
      newArr.push(Object.assign({}, arrItem, alterations));
    } else {
      newArr.push(arrItem);
    }
  });
  return Object.assign({}, state, { [arrKey]: newArr });
}

export function removeFromArr(state, arrKey, obj, idKey = 'id') {
  const newArr = [];
  state[arrKey].forEach((arrItem) => {
    if (!(obj[idKey] === arrItem[idKey])) {
      newArr.push(arrItem);
    }
  });
  return Object.assign({}, state, { [arrKey]: newArr });
}

export function getFromArr(arr, id) {
  let obj;
  arr.forEach((o) => {
    if (o.id === id) {
      obj = o;
    }
  });
  return obj;
}

export function addToArr(state, arrKey, obj) {
  const newObj = Object.assign({}, obj);
  if (!newObj.id) {
    newObj.id = shortid.generate();
  }
  const newState = {};
  newState[arrKey] = [...state[arrKey], newObj];
  return Object.assign({}, state, newState);
}

export function enhancer() {
  let enhancerWithPersistState = compose(persistState());
  if (process.env.NODE_ENV === 'dev') {
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    /* eslint-enable */
    enhancerWithPersistState = composeEnhancers(persistState());
  }
  return enhancerWithPersistState;
}
