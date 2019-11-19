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
  accounts: string[];
}

const Web3Context = React.createContext<Web3Interface>({} as any);

async function retrieveWeb3() {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      const web3 = new Web3(ethereum);
      const selectedAccount = await ethereum.enable();
      if (!selectedAccount) {
        // User didn't give permission for dapp to access wallet
        console.warn('User opted out')
      } else {
        // User allowed access
        console.log('user gave access!')
      }
      return web3
    } catch (error) {
      // whoopsie!
      console.error(error);
    }
  }
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3, setWeb3] = React.useState<Web3>();
  const [networkId, setNetworkId] = React.useState<number>();
  const [accounts, setAccounts] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function setWeb3Properties() {
      const foundWeb3 = (await retrieveWeb3())!;

      setWeb3(foundWeb3);

      foundWeb3.eth.net.getId()
        .then((nId) => setNetworkId(nId));

      foundWeb3.eth.getAccounts()
        .then((accounts) => setAccounts(accounts));
    }
    setWeb3Properties();
  }, []);

  if (!web3 || !networkId) {
    return <Loading/>;
  }

  return (
    <Web3Context.Provider value={{ web3: web3!, networkId: networkId, accounts: accounts }}>
      { children }
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3Interface = () => React.useContext<Web3Interface>(Web3Context);
