import * as React from 'react';
import { ContractListType } from '../helper/eth';

const DEFAULT_USER = {
  name: '',
  img: 'https://file.globalupload.io/HO8sN3I2nJ.png',
  role: '',
  address: '',
};

export const DACS_DEFAULT = {
  name: 'Anna Doe',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20%2820%29.jpg',
  role: 'DACS',
  address: '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39',
};

export const DEAL_DEFAULT = {
  name: 'John Do',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20%283%29.jpg',
  role: 'DEAL',
  address: '0xfcf5Dc3Fe0028309Be91aba3A96c76693Bcff02A',
};

export interface User {
  img: string;
  name: string;
  role: string;
  address: string;
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
  const defaultUser = DEFAULT_USER;
  const [user, setUser] = React.useState<User>(defaultUser);

  contracts.Governance.isGovernor(address)
    .then((isGovernor: boolean) => {
      const newUser = isGovernor ? DACS_DEFAULT : DEAL_DEFAULT;
      newUser.address = address;
      setUser(newUser);
    })
    .catch(console.log);

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
