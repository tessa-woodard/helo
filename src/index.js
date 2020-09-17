import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import store from './ducks/store';
import App from './App';

import './reset.css';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>, document.getElementById('root'));

serviceWorker.unregister()