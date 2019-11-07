import * as React from 'react';
import { DrizzleContext } from 'drizzle-react';
import NetworkAside from './NetworkAside';
import HomePageNoAccount from './HomePageNoAccount';

import { ArtifactView, ProposalView, ARRView, RegisterView, RegisterArtistView, ClientArtifactView } from '../views';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

interface AppProps {
  contracts: any;
  accounts: Array<string>;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const { contracts, accounts } = props;
  return (
    <Router>
      <LeftSidebar>
        <div className="content h-100">
          <DrizzledApp accounts={ accounts } contracts={ contracts }/>
        </div>
      </LeftSidebar>
    </Router>
  );
};

const DrizzledApp: React.FC<AppProps> = (props: AppProps) => {
  const { contracts, accounts } = props;
  return <DrizzleContext.Consumer>
    {(drizzleContext: any): React.ReactNode => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      return initialized ? (
        <>
          <NetworkAside drizzle={drizzle}/>
          <Switch>
            <Route exact path="/">
              <HomePageNoAccount/>
            </Route>
            <Route path="/artifact/new">
              <RegisterView accounts={accounts} contracts={contracts} drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path="/artifact">
              <ArtifactView accounts={accounts} contracts={contracts} drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path="/manage/proposal">
              <ProposalView accounts={accounts} contracts={contracts} drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path="/manage/arr">
              <ARRView accounts={accounts} contracts={contracts} drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path ="/artist/new">
              <RegisterArtistView accounts={accounts} contracts={contracts} drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path="/client/all/artifact">
              <ClientArtifactView accounts={accounts} contracts={contracts} drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
          </Switch>
        </>
      ) : null;
    }}
  </DrizzleContext.Consumer>;
};

export default App;
