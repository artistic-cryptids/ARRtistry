import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from '../components/App';
import Web3 from 'web3';

it('renders without crashing', () => {
  const doDapp = async (): Promise<void> => {
    console.log('beabadoobeeeee');

    const web3 = new Web3('ws://127.0.0.1:8545');
    // this is recommended way of doing it
    // but it stopped working when i removed drizzle
    // const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');
    const contracts = {};
    const accounts = [];

    ReactDOM.render(
      <App web3={ web3 } contracts={ contracts } accounts={ accounts }/>,
      document.getElementById('root'),
    );
  };

  doDapp();
});
