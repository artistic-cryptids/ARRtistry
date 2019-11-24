import * as React from 'react';
import ENSRegistry from '../contracts/ENSRegistry.json';
import ENSResolver from '../contracts/ENSResolver.json';
import { useWeb3Context } from './Web3Provider';
import { getABIAndAddress } from '../helper/eth';
import Loading from '../components/common/Loading';

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
    setEns(ens);
  }, [web3, networkId]);

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

  if (!ens) {
    return <Loading/>;
  }

  console.log('Name service provided');

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
