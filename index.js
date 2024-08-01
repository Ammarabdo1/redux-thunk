const redux = require('redux');
const axios = require('axios');
const thunkMiddleware = require('redux-thunk').default
// const reduxLogger = require('redux-logger')
// const PromiseMiddleWare = require('redux-promise-middleware')

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
const compose = redux.compose
// const logger = reduxLogger.createLogger()
// const reduxPromiseMiddleware = PromiseMiddleWare.reduxPromiseMiddleware

const initialState = {
  loading: false,
  users: [],
  error: '',
};

const ACTIONS = {
  FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
};

const fetchUsersRequest = () => {
  return {
    type: ACTIONS.FETCH_USER_REQUEST,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: ACTIONS.FETCH_USER_SUCCESS,
    payload: users,
  };
};

const fetchUsersFAILURE = (error) => {
  return {
    type: ACTIONS.FETCH_USER_FAILURE,
    payload: error,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ACTIONS.FETCH_USER_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: '',
      };
    case ACTIONS.FETCH_USER_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
  }
};

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest());
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        const users = res.data.map((user) => user.id);
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        dispatch(fetchUsersFAILURE(error.massage));
      });
  };
};

const store = createStore(reducer ,compose(applyMiddleware(thunkMiddleware)));
store.subscribe(() => {
  console.log(store.getState());
});
store.dispatch(fetchUsers());
// console.log('is run')
