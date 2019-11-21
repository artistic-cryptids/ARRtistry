import * as React from 'react';
import { ContractListType } from '../helper/eth';
import { useNameServiceContext } from './NameServiceProvider';

const DEFAULT_USER = {
  nickname: 'John Doe',
  img: 'https://file.globalupload.io/HO8sN3I2nJ.png',
  role: 'ARTIST',
  name: 'default.artistry.test',
};

export const DACS_DEFAULT: User = {
  nickname: 'Anna Doe',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20%2820%29.jpg',
  role: 'DACS',
  address: '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39',
  name: 'dac.artistry.test',
};

export const DEAL_DEFAULT: User = {
  nickname: 'Gallery',
  img: 'https://www.cavan-arts.com/uploads/1/2/2/7/122790076/img-4071_orig.jpg',
  role: 'DEAL',
  address: '0xdE164a54b441808DA5C448D85Ba2F0F6e271CC36',
  name: 'gallery.artistry.test',
};

export const NATASHA: User = {
  nickname: 'Natasha',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20(17).jpg',
  role: 'ARTIST',
  address: '0xc70eAc1d854E51FaFC7a487086624E79cEE6e843',
  name: 'natasha.artistry.test',
};

export const BUYER_DEFAULT: User = {
  nickname: 'Buyer',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20(9).jpg',
  role: 'COLLECTOR',
  address: '0x1bf078753937FB3e569C4c9724654d10cc8A7Fd7',
  name: 'buyer.artistry.test',
};

export interface User {
  img: string;
  nickname: string;
  role: string;
  address?: string;
  name: string;
}

export interface Session {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

interface SessionProviderProps {
  address: string;
  contracts: ContractListType;
}

export const SessionContext = React.createContext<Session>({} as any);

export const SessionProvider: React.FC<SessionProviderProps> = ({ address, contracts, children }) => {
  const context = useNameServiceContext();

  const defaultUser = DEFAULT_USER;
  const [user, setUser] = React.useState<User>(defaultUser);

  const users = [DACS_DEFAULT, DEAL_DEFAULT, NATASHA, BUYER_DEFAULT];

  React.useEffect(() => {
    let curUser: User = defaultUser;
    for (let user of users) {
        if (user.address === address) {
          curUser = user;
          break;
        }
    }

    curUser.address = address;

    setUser(curUser);

    context.nameFromAddress(address)
      .then((name: string) => {
        if (name !== '') {
          curUser.name = name;
          setUser(curUser);
        }
      })
      .catch((err: any) => {});
  }, [address, context, defaultUser, users]);

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
