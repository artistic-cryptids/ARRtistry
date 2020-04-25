import * as React from 'react';
import { useNameServiceContext } from './NameServiceProvider';
import { useWeb3Context } from './Web3Provider';
import { useContractContext } from './ContractProvider';
import SplashScreen from '../components/SplashScreen';
import { getUserListMetadata } from '../helper/agnostic';

const DEFAULT_USER = {
  nickname: 'Unknown',
  img: 'https://arweave.net/koGEvbLifVjKVqWRruecP040lNWr8M9cI2IqQ1eyZXo',
  role: 'UNREGISTERED',
  name: '',
  eth: '0',
  eurs: '0',
};

export interface User {
  img: string;
  nickname: string;
  role: string;
  address?: string[];
  name: string;
  eth: string;
  eurs: string;
}

export interface Permissions {
  managing: boolean;
  hasClients: boolean;
  governingBody: boolean;
}

export interface Session {
  user: User;
  getPermissions: () => Permissions;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const SessionContext = React.createContext<Session>({} as any);

export const SessionProvider: React.FC = ({ children }) => {
  const { nameFromAddress } = useNameServiceContext();
  const { web3, accounts } = useWeb3Context();
  const { Eurs } = useContractContext();
  const address = accounts[0];
  const [user, setUser] = React.useState<User>(DEFAULT_USER);
  const [gotUser, setGotUser] = React.useState<boolean>(false);

  const _getPermissions = (): Permissions => {
    const governingBody = user.role === 'DACS' || user.role === 'GOVERNING';
    const hasClients = user.role === 'DEAL';
    return {
      managing: governingBody || hasClients,
      hasClients: hasClients,
      governingBody: governingBody,
    };
  };

  React.useEffect(() => {
    const userProfile = getUserListMetadata('8R5oVUsbTnhiJlkm56HVRcEHvc9YEG4Hr3YxOYw_gSg')
      .then((users: Array<User>) => {
        for (const u of users) {
          if (u.address && u.address.includes(address)) {
            return { ...u, address: [address] };
          }
        }
        return { ...DEFAULT_USER, address: [address] };
      })
      .catch((err) => {
        console.error(err);
        return DEFAULT_USER;
      });

    const reverseENS = nameFromAddress(address.toString()).catch((err) => {
      console.error(err);
      return '';
    });

    const ethBalance = web3.eth.getBalance(address);
    console.log(Eurs.methods);
    const eursBalance = Eurs.methods.balanceOf(address).call();

    Promise.all([userProfile, reverseENS, ethBalance, eursBalance])
      .then(([usr, name, wei, eurs]: [User, string, string, string]): User => {
        if (!usr) {
          throw Error('User profile couldn\'t be found, even with DEFAULT');
        }
        if (name) {
          let eth = web3.utils.fromWei(wei);
          eth = (Number(eth).toFixed(4)).toString();

          eurs = (Number(eurs) / 100).toString();
          return { ...usr, name: name, eth: eth, eurs: eurs };
        }
        return usr;
      })
      .then((user) => user && setUser(user))
      .finally(() => setGotUser(true))
      .catch(console.error);
  }, [address, nameFromAddress, web3.eth, web3.utils, Eurs.methods]);

  if (!gotUser) {
    return <SplashScreen>
      Loading your user profile from arweave...
    </SplashScreen>;
  }

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser, getPermissions: _getPermissions }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
