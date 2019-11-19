import * as React from 'react';

import { ContractProps } from '../helper/eth';

import Web3 from 'web3';
import { Web3Provider } from '../providers/Web3Provider';
import { NameServiceProvider } from '../providers/NameServiceProvider';
import { RegistryProvider } from '../providers/RegistryProvider';
import { SessionProvider } from '../providers/SessionProvider';

import Router from './Router';

export interface AppProps extends ContractProps {
  web3: Web3;
  networkId: number;
}

const ContractProvider: React.FC = ({ children }) => {
  return (
    <NameServiceProvider>
      <RegistryProvider>
        {children}
      </RegistryProvider>
    </NameServiceProvider>
  );
};

const App: React.FC<AppProps> = (props) => {
  return (
    <Web3Provider networkId={props.networkId} accounts={props.accounts}>
      <ContractProvider>
        <SessionProvider address={props.accounts[0]} contracts={props.contracts}>
          <Router {...props}/>
        </SessionProvider>
      </ContractProvider>
    </Web3Provider>
  );
};

export default App;
