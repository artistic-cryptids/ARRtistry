import * as React from 'react';
import Web3 from 'web3';
import SplashScreen from '../components/SplashScreen';
// eslint-disable-next-line
const Fortmatic = require('fortmatic');

interface Web3Interface {
  web3: Web3;
  accounts: string[];
  networkId: number;
}

const Web3Context = React.createContext<Web3Interface>({} as any);

async function retrieveWeb3 (): Promise<Web3 | undefined> {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      // Silences warning about refresh on change
      ethereum.autoRefreshOnNetworkChange = false;
      const web3 = new Web3(ethereum);
      const selectedAccount = await ethereum.enable();
      if (!selectedAccount) {
        console.warn('User opted out');
      } else {
        console.log('User gave access!');
      }
      return web3;
    } catch (error) {
      console.error(error);
    }
  }
};

interface InfuraWeb3 {
  web3: Web3;
  account: string;
}

async function infuraWeb3 (): Promise<InfuraWeb3 | undefined> {
  const web3 = new Web3('https://rinkeby.infura.io/v3/f08a197d5a4b4435802695970588aaa2');
  const account = web3.eth.accounts.create();
  console.log(account);
  return { web3: web3, account: account.address };
};

export const Web3Provider: React.FC = ({ children }) => {
  const [web3, setWeb3] = React.useState<Web3>();
  const [networkId, setNetworkId] = React.useState<number>();
  const [accounts, setAccounts] = React.useState<string[]>();

  React.useEffect(() => {
    async function setWeb3Properties (): Promise<void> {
      console.log('Attempting to use injected web3');
      const foundWeb3 = await retrieveWeb3();
      if (foundWeb3) {
        foundWeb3.eth.net.getId()
          .then((nId) => setNetworkId(nId))
          .catch(console.warn);

        foundWeb3.eth.getAccounts()
          .then((accounts) => setAccounts(accounts))
          .catch(console.warn);

        setWeb3(foundWeb3);
      }

      console.log('Attempting to use infura web3');
      const infura = await infuraWeb3();

      if (infura) {
        const { web3, account } = infura;
        web3.eth.net.getId()
          .then((nId) => setNetworkId(nId))
          .catch(console.warn);
        setAccounts([account]);
        setWeb3(web3);
      }
    };
    setWeb3Properties();
  }, []);

  if (!web3 || !networkId || !accounts) {
    return <SplashScreen>
      Connecting to ethereum network...
      Please use an injected web3 provider such as MetaMask or Fortmatic.
    </SplashScreen>;
  }

  console.log('Provided Web3:', web3, networkId, accounts);

  return (
    <Web3Context.Provider value={{ web3: web3, networkId: networkId, accounts: accounts }}>
      { children }
    </Web3Context.Provider>
  );
};

export const useWeb3Context: () => Web3Interface = () => React.useContext<Web3Interface>(Web3Context);
