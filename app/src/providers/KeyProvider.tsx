import * as React from 'react';
import { JWKInterface } from 'arweave/web/lib/wallet';

type SetKey = (value: JWKInterface) => void;
export interface KeyControl {
  key: JWKInterface | undefined;
  setKey: SetKey;
}

const KeyContext = React.createContext<KeyControl>({
  key: undefined,
  setKey: console.warn,
});

export const KeyProvider: React.FC = ({ children }) => {
  const [key, setKey] = React.useState<JWKInterface>();

  return (
    <KeyContext.Provider value={{
      key: key,
      setKey: setKey,
    }}>
      { children }
    </KeyContext.Provider>
  );
};

export const useKeyContext = (): KeyControl => React.useContext<KeyControl>(KeyContext);
