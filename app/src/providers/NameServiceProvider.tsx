import * as React from 'react';
import Web3 from 'web3';
import ENSRegistry from '../contracts/ENSRegistry.json';
import ENSResolver from '../contracts/ENSResolver.json';
import { AbiItem } from 'web3-utils';

// eslint-disable-next-line
const namehash = require('eth-ens-namehash');

export interface User {
  img: string;
  nickname: string;
  role: string;
  address: string;
  name: string;
}

export interface NameService {
  nameFromAddress: Function;
  addressFromName: Function;
}

interface TruffleArtifact {
  networks: {
    [k: number]: {
      address: string;
    };
  };
  abi: AbiItem[];
}

const getABIAndAddress = (networkId: number, json: TruffleArtifact): { abi: any; address: string } => {
  const deployed = json.networks[networkId];
  const address = deployed && deployed.address;
  return {
    abi: json.abi,
    address: address || '0xe7410170f87102df0055eb195163a03b7f2bff4a',
  };
};

export const NameServiceContext = React.createContext<NameService>({} as any);

export const NameServiceProvider: React.FC = ({ children }) => {
  const [ens, setEns] = React.useState<any>();

  const { ethereum } = window as any;
  const web3 = new Web3(ethereum);

  React.useEffect(() => {
    web3.eth.net.getId()
      .then((n) => getABIAndAddress(n, ENSRegistry as any))
      .then(({ abi, address }) => new web3.eth.Contract(abi, address))
      .then((ens: any) => setEns(ens))
      .catch((err: any) => console.log(err));
  }, [web3]);

  const nameFromAddress = (address: string): Promise<string> => {
    if (ens === undefined) {
      return Promise.resolve('');
    }

    const lookup = address.toLowerCase().substr(2) + '.addr.reverse';
    const hash = namehash.hash(lookup);
    return ens.methods.resolver(hash).call()
      .then((resolverAddr: string) => {
        return {
          abi: (ENSResolver as any).abi,
          addr: resolverAddr,
        };
      })
      .then(({ abi, addr }: any) => new web3.eth.Contract(abi, addr))
      .then((resolver: any) => resolver.methods.name(hash).call())
      .catch((err: any) => {
        console.log(err);
        return '';
      });
  };

  const addressFromName = (name: string): Promise<string> => {
    if (ens === undefined) {
      return Promise.resolve('');
    }

    const hash = namehash.hash(name);
    return ens.methods.resolver(hash).call()
      .then((resolverAddr: string) => {
        return {
          abi: (ENSResolver as any).abi,
          addr: resolverAddr,
        };
      })
      .then(({ abi, addr }: any) => new web3.eth.Contract(abi, addr))
      .then((resolver: any) => resolver.methods.addr(hash).call())
      .catch((err: any) => {
        console.log(err);
        return '';
      });
  };

  return (
    <NameServiceContext.Provider value={{
      addressFromName: addressFromName,
      nameFromAddress: nameFromAddress,
    }}>
      { children }
    </NameServiceContext.Provider>
  );
};

export const useNameServiceContext: () => NameService = () => React.useContext<NameService>(NameServiceContext);
