import * as React from 'react';
import Web3 from 'web3';
import Loading from '../components/common/Loading';

interface Web3Interface {
  web3: Web3;
  accounts: string[];
  networkId: number;
}

interface Web3ProviderProps {
  networkId: number;
  web3: Web3;
  accounts: string[];
}

const Web3Context = React.createContext<Web3Interface>({} as any);

export const Web3Provider: React.FC<Web3ProviderProps> = ({ web3, networkId, accounts, children }) => {
  if (!web3 || !networkId) {
    return <Loading/>;
  }

  return (
    <Web3Context.Provider value={{ web3: web3, networkId: networkId, accounts: accounts }}>
      { children }
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3Interface = () => React.useContext<Web3Interface>(Web3Context);
