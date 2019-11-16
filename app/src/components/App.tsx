import * as React from 'react';

import { ContractProps } from '../helper/eth';

import Web3 from 'web3';
import { SessionProvider } from '../providers/SessionProvider';
import Router from './Router';

export interface AppProps extends ContractProps {
  web3: Web3;
  name: string;
}

const App: React.FC<AppProps> = (props) => {
  return (
    <SessionProvider address={props.accounts[0]} name={props.name}>
      <Router {...props}/>
    </SessionProvider>
  );
};

export default App;
