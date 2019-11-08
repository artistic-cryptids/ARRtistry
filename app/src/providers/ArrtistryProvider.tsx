import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'

import { Governance } from '../contracts/Governance';
import { ArtifactRegistry } from '../contracts/ArtifactRegistry';
import { Artists } from '../contracts/Artists';
import { ArtifactApplication } from '../contracts/ArtifactApplication';
import { readFileSync } from 'fs';
import { join } from 'path';
import Web3 from 'web3';

export interface User {
  address: string;
  accounts: string[];
}

export interface Contracts {
  Governance: Governance;
  ArtifactApplication: ArtifactApplication;
  ArtifactRegistry: ArtifactRegistry;
  Artists: Artists;
}

export interface Arrtistry {
  contracts: Contracts;
  user: User;
  web3: Web3;
}

//TODO: Remove this and just use context
export interface CommonProps {
  contracts: Contracts;
  accounts: string[];
}

export const ArrtistryContext = React.createContext<Arrtistry>({} as Arrtistry)

async function loadContract(
  web3: Web3,
  contractName: string
) {
  const dirPath = join(__dirname, "../contracts");

  const abi = JSON.parse(readFileSync(join(dirPath, contractName + ".json"), "utf-8"));
  return new web3.eth.Contract(abi);
}

export const ArrtistryProvider: React.FC = props => {

  const { _web3 } = window as any
  const [web3, setWeb3] = useState<Web3>(new Web3(_web3.currentProvider || 'ws://127.0.0.1:8545'));
  // Hack to get around lack of optional chaining, this is known to be nonnull
  // by call
  const [contracts, setContracts] = useState<Contracts>({
    Governance: {} as Governance,
    ArtifactApplication: {} as ArtifactApplication,
    ArtifactRegistry: {} as ArtifactRegistry,
    Artists: {} as Artists,
  });
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const setContract = async (name: string) => {
      setContracts({
        ...contracts,
        [name]: await loadContract(web3, name)
      });
    }

    setContract('Governance');
    setContract('ArtifactApplication');
    setContract('ArtifactRegistry');
    setContract('Artists');
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      const accounts = await web3.eth.getAccounts();
      setUser({
        ...user,
        accounts: accounts,
        address: accounts[0]
      });
    }
    updateUser();
  }, []);


  return (
    <ArrtistryContext.Provider value={{web3: web3, contracts: contracts, user: user}}>
      { props.children }
    </ArrtistryContext.Provider>
  )
}

export const useArrtistryContext = () => React.useContext(ArrtistryContext)
