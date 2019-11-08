import React, { useState, Dispatch, SetStateAction } from 'react'

export interface Account {
  address: string;
}

export interface Session {
  account: Account | null;
  setAccount: Dispatch<SetStateAction<Account | undefined>>;
}

export const SessionContext = React.createContext<Partial<Session>>({})

export const SessionProvider: React.FC = props => {
  const [account, setAccount] = useState<Account>()

  return (
    <SessionContext.Provider value={{account: account, setAccount: setAccount}}>
      { props.children }
    </SessionContext.Provider>
  )
}

export const useSessionContext = () => React.useContext(SessionContext)
