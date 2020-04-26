import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App'

import './theme.scss';

const render = async (): Promise<void> => {
  ReactDOM.render(
    <App/>,
    document.getElementById('root'),
  );
};

render();
