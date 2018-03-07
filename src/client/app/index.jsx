import React from 'react';
import ReactDOM from 'react-dom';
import { reducer as formReducer } from 'redux-form';
import { ApolloLink, concat } from 'apollo-link';

import { createStore, combineReducers, compose } from 'redux';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { print } from 'graphql/language/printer'
import registerServiceWorker from './registerServiceWorker';

import { createApolloFetchUpload } from 'apollo-fetch-upload'
//import './index.css';
import authReducer from '../reducers/authReducer';
import { AUTH_SIGNIN , SET_ROLE } from '../actions';
import RequireAuth from '../containers/RequireAuth';
import App from '../components/App/App';
import DOMAIN_PATH ,{REMOTE_DOMAIN_PATH} from './config'
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const httpLink = new HttpLink({ uri :  DOMAIN_PATH});
const apolloFetchUpload = createApolloFetchUpload({
  uri: DOMAIN_PATH
})
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('token') || null,
    }
  });

  return forward(operation);
})

const client = new ApolloClient({
  networkInterface: {
  query: request => apolloFetchUpload({
    ...request,
    query: print(request.query)
  })
},
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })

});

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers();
const store = createStore(combineReducers({
    form: formReducer,
    auth: authReducer,
  }), enhancer);

if (token && role) {
  // We need to update application state if the token exists
  store.dispatch({ type: AUTH_SIGNIN });
  store.dispatch({type : SET_ROLE , role :role});
}

ReactDOM.render(<Provider store={store}>
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider></Provider>, document.getElementById('app'));
registerServiceWorker();
