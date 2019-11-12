import * as React from 'react';
import NetworkAside from './NetworkAside';
import HomePageNoAccount from './HomePageNoAccount';

import { ArtifactView, ProposalView, ARRView, RegisterView, RegisterArtistView, ClientArtifactView, SoldArtifactView }
  from '../views';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import { ContractProps } from '../helper/eth';

import Web3 from 'web3';

interface AppProps extends ContractProps {
  web3: Web3;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const { contracts, accounts, web3 } = props;
  return (
    <Router>
      <LeftSidebar>
        <div className="content h-100">
          <OurApp web3={ web3 } accounts={ accounts } contracts={ contracts }/>
        </div>
      </LeftSidebar>
    </Router>
  );
};

const OurApp: React.FC<AppProps> = (props: AppProps) => {
  const { contracts, accounts, web3 } = props;
  return (
    <div><NetworkAside web3={web3}/>
      <Switch>
        <Route exact path="/">
          <HomePageNoAccount/>
        </Route>
        <Route path="/artifact/new">
          <RegisterView accounts={accounts} contracts={contracts}/>
        </Route>
        <Route path="/artifact/sold">
          <SoldArtifactView accounts={accounts} contracts={contracts}/>
        </Route>
        <Route path="/artifact">
          <ArtifactView accounts={accounts} contracts={contracts}/>
        </Route>
        <Route path="/manage/proposal">
          <ProposalView accounts={accounts} contracts={contracts}/>
        </Route>
        <Route path="/manage/arr">
          <ARRView accounts={accounts} contracts={contracts}/>
        </Route>
        <Route path ="/artist/new">
          <RegisterArtistView accounts={accounts} contracts={contracts}/>
        </Route>
        <Route path="/client/all/artifact">
          <ClientArtifactView accounts={accounts} contracts={contracts}/>
        </Route>
      </Switch></div>);
};

export default App;
