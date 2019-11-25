import * as React from 'react';

import { Web3Provider } from '../providers/Web3Provider';
import { NameServiceProvider } from '../providers/NameServiceProvider';
import { SessionProvider } from '../providers/SessionProvider';
import { ContractProvider } from '../providers/ContractProvider';

import Router from './Router';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <NameServiceProvider>
        <ContractProvider>
          <SessionProvider>
            <Router/>
          </SessionProvider>
        </ContractProvider>
      </NameServiceProvider>
    </Web3Provider>
  );
};

export default App;
