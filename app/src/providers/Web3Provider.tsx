import * as React from 'react';
import Web3 from 'web3';
import ArtifactRegistry from '../contracts/ArtifactRegistry.json';
import { ContractListType } from '../helper/eth';

interface Web3Interface {
  web3: Web3;
  accounts: Array<string>;
  contracts: ContractListType;
}

interface Web3ProviderProps {
  networkId: number;
  accounts: Array<string>;
}

const Web3Context = React.createContext<Web3Interface>({} as any);

export const Web3Provider: React.FC<Web3ProviderProps> = ({ networkId, accounts, children }) => {
  const web3 = new Web3(Web3.givenProvider || 'ws://127.0.0.1:8545');

  const artifactRegistryContractAddress = (ArtifactRegistry.networks as any)[networkId.toString()].address;
  const artifactRegistry = new web3.eth.Contract(ArtifactRegistry.abi, artifactRegistryContractAddress);

  // TODO: Update these to have the actual contracts when refactoring
  const contracts = {
    Governance: null,
    ArtifactApplication: null,
    ArtifactRegistry: artifactRegistry,
    Artists: null,
    Ens: null,
  };

  return (
    <Web3Context.Provider value={{ web3: web3, accounts: accounts, contracts: contracts }}>
      { children }
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3Interface = () => React.useContext<Web3Interface>(Web3Context);
