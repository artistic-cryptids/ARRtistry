import * as React from 'react';

import { Web3Provider } from '../providers/Web3Provider';
import { NameServiceProvider } from '../providers/NameServiceProvider';
import { SessionProvider } from '../providers/SessionProvider';
import { ContractProvider } from '../providers/ContractProvider';
import { KeyProvider } from '../providers/KeyProvider';
import { ArrProvider } from '../providers/ArrProvider';
import { TokenProvider } from '../providers/TokenProvider';
import { RegisterSaleCompleteProvider } from '../providers/RegisterSaleCompleteProvider';

import Router from './Router';
import SplashScreen from './SplashScreen';

const BlockingProviders: React.FC = ({ children }) => {
  return (
    <Web3Provider>
      <NameServiceProvider>
        <ContractProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ContractProvider>
      </NameServiceProvider>
    </Web3Provider>
  );
};

const NonBlockingProviders: React.FC = ({ children }) => {
  return (
    <KeyProvider>
      <ArrProvider>
        <TokenProvider>
          <RegisterSaleCompleteProvider>
            {children}
          </RegisterSaleCompleteProvider>
        </TokenProvider>
      </ArrProvider>
    </KeyProvider>
  );
};

const App: React.FC = () => {
  return (
    <BlockingProviders>
      <SplashScreen hide/>
      <NonBlockingProviders>
        <Router/>
      </NonBlockingProviders>
    </BlockingProviders>
  );
};

export default App;
