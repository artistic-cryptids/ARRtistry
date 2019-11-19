import * as React from 'react';
import { ContractListType } from '../helper/eth';
import { nameFromAddress } from '../helper/ensResolver';
import Web3 from 'web3';
import { Ens } from 'web3-eth-ens';
import { Contract } from 'web3-eth-contract';
import ENSRegistry from '../contracts/ENSRegistry.json';
import { AbiItem } from 'web3-utils';

const namehash = require('eth-ens-namehash');

export interface User {
  img: string;
  nickname: string;
  role: string;
  address: string;
  name: string;
}

export interface NameService {
  ens: Contract;
}

interface TruffleArtifact {
  networks: {
    [k: number]: {
      address: string
    }
  }
  abi: AbiItem[];
}

const getABIAndAddress = (networkId: number, json: TruffleArtifact) => {
  const deployed = json.networks[networkId];
  const address = deployed && deployed.address;
  console.log(address)
  return {
    abi: json.abi,
    address: address || '0x0000000000000000000000000000000000000000',
  }
}

export const NameServiceContext = React.createContext<NameService>({} as any);

export const NameServiceProvider: React.FC = ({ children }) => {
  const [ens, setEns] = React.useState<Contract>();

  React.useEffect(() => {
    const { ethereum } = window as any;
    const web3 = new Web3(ethereum);
    web3.eth.net.getId()
      .then((n) => getABIAndAddress(n, ENSRegistry as any))
      .then(({abi, address}) => new web3.eth.Contract(abi, address))
      .then((ens) => setEns(ens));
  }, []);

  if (ens !== undefined) {
    console.log(ens);
    const ownerRes = ens.methods.owner(namehash.hash('blah'));
    console.log(ownerRes);
    console.log(ownerRes.estimateGas());
    console.log(ownerRes.call().then(console.log));
    // ens.methods.owner(namehash.hash('blah')).call();
  }

  return (
    <NameServiceContext.Provider value={{ ens: ens!! }}>
      { children }
    </NameServiceContext.Provider>
  );
};

export const useNameServiceContext: () => NameService = () => React.useContext<NameService>(NameServiceContext);
