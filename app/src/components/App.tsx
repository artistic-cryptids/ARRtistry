import * as React from 'react';

import { Web3Provider } from '../providers/Web3Provider';
import { NameServiceProvider } from '../providers/NameServiceProvider';
import { SessionProvider } from '../providers/SessionProvider';
import { ContractProvider } from '../providers/ContractProvider';
import { KeyProvider } from '../providers/KeyProvider';

import Router from './Router';
import SplashScreen from './SplashScreen';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <NameServiceProvider>
        <ContractProvider>
          <SessionProvider>
            <KeyProvider>
              <SplashScreen hide/>
              <Router/>
            </KeyProvider>
          </SessionProvider>
        </ContractProvider>
      </NameServiceProvider>
    </Web3Provider>
  );
};

export default App;
