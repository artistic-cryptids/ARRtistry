import * as React from 'react';

import { ContractProps } from '../helper/eth';

import Web3 from 'web3';
import { SessionProvider } from '../providers/SessionProvider';
import { Web3Provider } from '../providers/Web3Provider';
import Router from './Router';

export interface AppProps extends ContractProps {
  web3: Web3;
  networkId: number;
}

const App: React.FC<AppProps> = (props) => {
  return (
    <Web3Provider networkId={props.networkId} accounts={props.accounts}>
      <SessionProvider address={props.accounts[0]} contracts={props.contracts}>
        <Router {...props}/>
      </SessionProvider>
    </Web3Provider>
  );
};

export default App;
