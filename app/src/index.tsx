import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { Drizzle, DrizzleOptions, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

import Governance from './contracts/Governance.json';
import ArtifactApplication from './contracts/ArtifactApplication.json';
import ArtifactRegistry from './contracts/ArtifactRegistry.json';
import Artists from './contracts/Artists.json';

import './theme.scss';

const options: DrizzleOptions = {
  contracts: [ArtifactApplication, Governance, ArtifactRegistry, Artists],
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
};

const drizzleStore = generateStore({ drizzleOptions: options });
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
  <DrizzleContext.Provider drizzle={ drizzle }>
    <App/>
  </DrizzleContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
