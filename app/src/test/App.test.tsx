import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../components/App';
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';

it('renders without crashing', () => {
  const options = {
    contracts: [],
    web3: {
      fallback: {
        type: 'ws',
        url: 'ws://127.0.0.1:8545',
      },
    },
  };

  const drizzleStore = generateStore(options);
  const drizzle = new Drizzle(options, drizzleStore);
  const div = document.createElement('div');
  ReactDOM.render(
    <DrizzleContext.Provider drizzle={ drizzle }>,
      <App/>
    </DrizzleContext.Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
