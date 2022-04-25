// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import reducers from '../reducers'
// import { composeWithDevTools } from 'redux-devtools-extension';

// const store = createStore(
//     reducers,
//     {},
//     composeWithDevTools(
//         applyMiddleware(thunk)
//     )
// );

// export default store;


// import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';

const initialState = {};
const middleware = [thunk];

export const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f,
    ),
);
export const persistor = persistStore(store);
