import * as React from 'react';

import { Web3Provider } from '../providers/Web3Provider';
import { NameServiceProvider } from '../providers/NameServiceProvider';
import { RegistryProvider } from '../providers/RegistryProvider';
import { SessionProvider } from '../providers/SessionProvider';
import { ContractProvider } from '../providers/ContractProvider';
import { ArtistProvider } from '../providers/ArtistProvider';

import Router from './Router';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <NameServiceProvider>
        <ContractProvider>
          <ArtistProvider>
            <RegistryProvider>
              <SessionProvider>
                <Router/>
              </SessionProvider>
            </RegistryProvider>
          </ArtistProvider>
        </ContractProvider>
      </NameServiceProvider>
    </Web3Provider>
  );
};

export default App;
