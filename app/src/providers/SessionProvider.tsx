import * as React from 'react';

export const DACS_DEFAULT: User = {
  nickname: 'Anna Doe',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20%2820%29.jpg',
  role: 'DACS',
  address: '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39',
  name: 'artistic.test',
};

export const DEAL_DEFAULT: User = {
  nickname: 'John Do',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20%283%29.jpg',
  role: 'DEAL',
  // idk what this address is
  // address: '0xfcf5Dc3Fe0028309Be91aba3A96c76693Bcff02A',
  address: '',
  name: '',
};

export interface User {
  img: string;
  nickname: string;
  role: string;
  address: string;
  name: string;
}

export interface Session {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const SessionContext = React.createContext<Session>({} as any);

export const SessionProvider: React.FC<{address: string; name: string}> = ({ address, name, children }) => {
  const defaultUser = (address === DACS_DEFAULT.address) ? DACS_DEFAULT : DEAL_DEFAULT;
  defaultUser.name = name;
  defaultUser.address = address;
  const [user, setUser] = React.useState<User>(defaultUser);

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
