import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './semantic-ui.custom.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
);

registerServiceWorker();