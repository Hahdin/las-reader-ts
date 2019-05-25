// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import session from '../reducers/tmpltReducer'
// import { State as SessionState} from '../types'
// import thunk from 'redux-thunk'
// import { composeWithDevTools } from "redux-devtools-extension";


// export interface RootState {
//    session: SessionState
// }
// const rootReducer = combineReducers<RootState>({ session})
// export type AppState = ReturnType<typeof rootReducer>;
// const middlewares = [thunk];
// const middleWareEnhancer = applyMiddleware(...middlewares);
// export default createStore(rootReducer, composeWithDevTools(middleWareEnhancer))

import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import  chartReducer  from "./chart/reducers";
import  fileReducer  from "./files/reducers";

const rootReducer = combineReducers({
  chart: chartReducer,
  files: fileReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middlewares = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  );

  return store;
}
