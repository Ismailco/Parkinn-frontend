import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// import reducer from '../slice/map';

let middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

const store = configureStore({
  reducer: {
    map: reducer,
  },
  middleware: [...middleware],
});

export default store;
