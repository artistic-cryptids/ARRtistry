import * as React from 'react';
import { useNameServiceContext } from './NameServiceProvider';
import { useWeb3Context } from './Web3Provider';
import SplashScreen from '../components/SplashScreen';
import { getUserListMetadata } from '../helper/agnostic';

const DEFAULT_USER = {
  nickname: 'Unknown',
  img: 'https://arweave.net/koGEvbLifVjKVqWRruecP040lNWr8M9cI2IqQ1eyZXo',
  role: 'UNREGISTERED',
  name: '',
};

export interface User {
  img: string;
  nickname: string;
  role: string;
  address?: string[];
  name: string;
}

export interface Session {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const SessionContext = React.createContext<Session>({} as any);

export const SessionProvider: React.FC = ({ children }) => {
  const { nameFromAddress } = useNameServiceContext();
  const { accounts } = useWeb3Context();
  const address = accounts[0];
  const [user, setUser] = React.useState<User>(DEFAULT_USER);
  const [gotUser, setGotUser] = React.useState<boolean>(false);

  React.useEffect(() => {
    const userProfile = getUserListMetadata('8R5oVUsbTnhiJlkm56HVRcEHvc9YEG4Hr3YxOYw_gSg')
      .then((users: Array<User>) => {
        for (const u of users) {
          if (u.address && u.address.includes(address)) {
            return { ...u, address: [address] };
          }
        }
        return DEFAULT_USER;
      })
      .catch((err) => {
        console.error(err);
        return DEFAULT_USER;
      });

    const reverseENS = nameFromAddress(address).catch((err) => {
      console.error(err);
      return '';
    });

    Promise.all([userProfile, reverseENS])
      .then(([usr, name]: [User, string]): User => {
        if (!usr) {
          throw Error('User profile couldn\'t be found, even with DEFAULT');
        }
        if (name) {
          return { ...usr, name: name };
        }
        return usr;
      })
      .then((user) => user && setUser(user))
      .finally(() => setGotUser(true))
      .catch(console.error);
  }, [address, nameFromAddress]);

  if (!gotUser) {
    return <SplashScreen>
      Loading your user profile from arweave...
    </SplashScreen>;
  }

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
