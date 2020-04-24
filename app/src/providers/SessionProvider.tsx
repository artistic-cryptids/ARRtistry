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
  const context = useNameServiceContext();
  const { accounts } = useWeb3Context();
  const address = accounts[0];

  const defaultUser = DEFAULT_USER;
  const [user, setUser] = React.useState<User>(defaultUser);
  const [gotUser, setGotUser] = React.useState<boolean>(false);

  let users: Array<User> = [];
  getUserListMetadata('8R5oVUsbTnhiJlkm56HVRcEHvc9YEG4Hr3YxOYw_gSg')
    .then((userList: Array<User>) => {
      console.log(userList);
      users = userList;
    }).catch(console.log);

  React.useEffect(() => {
    let curUser: User = defaultUser;
    for (const user of users) {
      if (user.address && user.address.includes(address)) {
        curUser = user;
        break;
      }
    }

    curUser.address = [address];

    setUser(curUser);

    context.nameFromAddress(address)
      .then((name: string) => {
        if (name !== '') {
          curUser.name = name;
          setUser(curUser);
        }
        setGotUser(true);
      })
      .catch(console.log);
  }, [address, context, defaultUser, users]);

  if (!gotUser) {
    return <SplashScreen>
      Loading your user profile...
    </SplashScreen>;
  }

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
