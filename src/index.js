import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from './store/store';
import { App } from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
