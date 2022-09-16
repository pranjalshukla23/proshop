import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './bootstrap.min.css';
import {store} from './app/store';
import {Provider} from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <React.StrictMode>
        {/*wrap components which require access to redux with provider*/}
        <Provider store={store}>
        <App/>
        </Provider>
      </React.StrictMode>

);


