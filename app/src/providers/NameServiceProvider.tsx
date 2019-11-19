import * as React from 'react';
import { ContractListType } from '../helper/eth';
import Web3 from 'web3';
import { Ens } from 'web3-eth-ens';
import { Contract } from 'web3-eth-contract';
import ENSRegistry from '../contracts/ENSRegistry.json';
import ENSResolver from '../contracts/ENSResolver.json';
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
  nameFromAddress: Function;
  addressFromName: Function;
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
  return {
    abi: json.abi,
    address: address || '0x0000000000000000000000000000000000000000',
  };
};

const nameFromAddress = (address: string): Promise<string> => {
  const { ethereum } = window as any;
  const web3 = new Web3(ethereum);
  const lookup = address.toLowerCase().substr(2) + '.addr.reverse';
  const hash = namehash.hash(lookup);
  return web3.eth.net.getId()
    .then((n) => getABIAndAddress(n, ENSRegistry as any))
    .then(({abi, address}) => new web3.eth.Contract(abi, address))
    .then((ens: Contract) => ens.methods.resolver(hash).call())
    .then((resolverAddr: any) => {
      return {
        abi: (ENSResolver as any).abi,
        addr: resolverAddr,
      };
    })
    .then(({abi, addr}: any) => new web3.eth.Contract(abi, addr))
    .then((resolver: any) => resolver.methods.name(hash).call())
    .catch((err: any) => {
      console.log(err);
      return '';
    });
};

const addressFromName = (name: string): Promise<string> => {
  const { ethereum } = window as any;
  const web3 = new Web3(ethereum);
  const hash = namehash.hash(name);
  return web3.eth.net.getId()
    .then((n) => getABIAndAddress(n, ENSRegistry as any))
    .then(({abi, address}) => new web3.eth.Contract(abi, address))
    .then((ens: Contract) => ens.methods.resolver(hash).call())
    .then((resolverAddr: any) => {
      return {
        abi: (ENSResolver as any).abi,
        addr: resolverAddr,
      };
    })
    .then(({abi, addr}: any) => new web3.eth.Contract(abi, addr))
    .then((resolver: any) => resolver.methods.addr(hash).call())
    .catch((err: any) => {
      console.log(err);
      return '';
    });
};

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

  return (
    <NameServiceContext.Provider value={{ ens: ens!!, addressFromName: addressFromName, nameFromAddress: nameFromAddress}}>
      { children }
    </NameServiceContext.Provider>
  );
};

export const useNameServiceContext: () => NameService = () => React.useContext<NameService>(NameServiceContext);
