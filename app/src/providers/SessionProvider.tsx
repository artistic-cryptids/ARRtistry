import * as React from 'react';
import { useNameServiceContext } from './NameServiceProvider';
import { useWeb3Context } from './Web3Provider';
import Loading from '../components/common/Loading';

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
  address: [
    '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39',
    '0x594cd738A5e99134De9DE21f253eD1Be4eb27F3e',
  ],
  name: 'dac.artistry.test',
};

export const DEAL_DEFAULT: User = {
  nickname: 'Gallery',
  img: 'https://www.cavan-arts.com/uploads/1/2/2/7/122790076/img-4071_orig.jpg',
  role: 'DEAL',
  address: [
    '0xdE164a54b441808DA5C448D85Ba2F0F6e271CC36',
    '0x97A3FC5Ee46852C1Cf92A97B7BaD42F2622267cC',
    '0xce42bdB34189a93c55De250E011c68FaeE374Dd3',
  ],
  name: 'gallery.artistry.test',
};

export const NATASHA: User = {
  nickname: 'Natasha',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20(17).jpg',
  role: 'ARTIST',
  address: ['0xc70eAc1d854E51FaFC7a487086624E79cEE6e843'],
  name: 'natasha.artistry.test',
};

export const NICHOLA: User = {
  nickname: 'Nichola Theakston',
  img: 'https://www.celebratingceramics.co.uk/images/cc_images/nichola_theakston_800.jpg',
  role: 'ARTIST',
  address: ['0x67EDE48B355DA3fb5d5fB6e5964DaB9fDA56aADe'],
  name: 'nichola.artistry.test',
};

export const LUXEMBURG: User = {
  nickname: 'Rut Blees',
  img: 'https://www.tate.org.uk/art/images/work/P/P20/P20268_9.jpg',
  role: 'ARTIST',
  address: ['0xf323B526cfEbf52c349dA8F4BB4d7e6EFA55F3a6'],
  name: 'rut.artistry.test',
};

export const BUYER_DEFAULT: User = {
  nickname: 'Buyer',
  img: 'https://mdbootstrap.com/img/Photos/Avatars/img%20(9).jpg',
  role: 'COLLECTOR',
  address: ['0x1bf078753937FB3e569C4c9724654d10cc8A7Fd7'],
  name: 'buyer.artistry.test',
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

  const users = [DACS_DEFAULT, DEAL_DEFAULT, NATASHA, NICHOLA, LUXEMBURG, BUYER_DEFAULT];

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
    return <Loading/>;
  }

  return (
    <SessionContext.Provider value={{ user: user, setUser: setUser }}>
      { children }
    </SessionContext.Provider>
  );
};

export const useSessionContext: () => Session = () => React.useContext<Session>(SessionContext);
