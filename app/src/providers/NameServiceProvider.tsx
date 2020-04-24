import * as React from 'react';
import ENSRegistry from '../contracts/ENSRegistry.json';
import ENSResolver from '../contracts/ENSResolver.json';
import { useWeb3Context } from './Web3Provider';
import { getABIAndAddress } from '../helper/eth';
import SplashScreen from '../components/SplashScreen';

// eslint-disable-next-line
const namehash = require('eth-ens-namehash');

export interface User {
  img: string;
  nickname: string;
  role: string;
  address: string;
  name: string;
}

export interface ENS2Address extends Function {
  (ens: string): Promise<string>;
}

export interface Address2ENS extends Function {
  (address: string): Promise<string>;
}

export interface NameService {
  nameFromAddress: Address2ENS;
  addressFromName: ENS2Address;
}

export const NameServiceContext = React.createContext<NameService>({} as any);

export const NameServiceProvider: React.FC = ({ children }) => {
  const [ens, setEns] = React.useState<any>();
  const { web3, networkId } = useWeb3Context();

  React.useEffect(() => {
    const { abi, address } = getABIAndAddress(
      networkId,
      ENSRegistry as any,
      '0xe7410170f87102df0055eb195163a03b7f2bff4a',
    );
    const ens = new web3.eth.Contract(abi, address);

    console.log('Name service provided', address);

    setEns(ens);
  }, [web3, networkId]);

  const getResolverForHash = (hash: string): Promise<any> => {
    return ens.methods.resolver(hash).call()
      .then((resolverAddr: string) => {
        return {
          abi: (ENSResolver as any).abi,
          addr: resolverAddr,
        };
      })
      .then(({ abi, addr }: any) => new web3.eth.Contract(abi, addr))
      .catch((err: any) => {
        throw new Error(`Could not create resolver contract: ${err}`);
      });
  };

  const nameFromAddress: Address2ENS = (address) => {
    if (ens === undefined) {
      return Promise.reject(new Error('No ENS Service'));
    }
    if (typeof address !== 'string') {
      return Promise.reject(new Error('Failure to provide valid address'));
    }

    const lookup = address.toLowerCase().substr(2) + '.addr.reverse';
    const hash = namehash.hash(lookup);
    return getResolverForHash(hash)
      .then((resolver: any) => resolver.methods.name(hash).call())
      .catch((err: any) => {
        throw new Error(`Could not resolve name hash: ${err}`);
      });
  };

  const addressFromName: ENS2Address = (name) => {
    if (ens === undefined) {
      return Promise.reject(new Error('No ENS Service'));
    }
    if (typeof name !== 'string') {
      return Promise.reject(new Error('Failure to provide valid address'));
    }

    const hash = namehash.hash(name);
    return getResolverForHash(hash)
      .then((resolver: any) => resolver.methods.addr(hash).call())
      .catch((err: any) => {
        throw new Error(`Could not resolve address hash: ${err}`);
      });
  };

  if (!ens) {
    return <SplashScreen>
      Connecting to Ethereum Name Service.
    </SplashScreen>;
  }

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
