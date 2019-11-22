import * as React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';

import { useSessionContext } from '../providers/SessionProvider';

import * as View from '../views';

import { AppProps } from './App';
import Main from './Main';
import NetworkAside from './NetworkAside';

const Router: React.FC<AppProps> = ({ web3, accounts, contracts }) => {
  const { user } = useSessionContext();

  return (
    <BrowserRouter>
      <NetworkAside web3={web3}/>
      <Switch>
        { user.role !== 'DACS' && <Redirect from='/manage/' to='/'/> }
        {/* TODO: Needs more logic here, just depends on roles */}
        <Route exact path="/">
          <Main page="Home" parents={['Dashboards']}>
            <h1>Welcome back!</h1>
          </Main>
        </Route>
        <Route path="/artifact/new">
          <View.RegisterView accounts={accounts} contracts={contracts} />
        </Route>
        <Route path="/artifact/sold">
          <View.SoldArtifactView accounts={accounts} contracts={contracts} />
        </Route>
        <Route path="/artifact/:id" render={({ match }) =>
          <View.ArtifactById accounts={accounts} contracts={contracts} id={match.params.id} />
        } />
        <Route path="/artifact">
          <View.ArtifactView accounts={accounts} contracts={contracts} />
        </Route>
        <Route path="/manage/proposal">
          <View.ProposalView accounts={accounts} contracts={contracts} />
        </Route>
        <Route path="/manage/arr">
          <View.ARRView accounts={accounts} contracts={contracts} />
        </Route>
        <Route path ="/artist/new">
          <View.RegisterArtistView accounts={accounts} contracts={contracts} />
        </Route>
        <Route path="/client/all/artifact">
          <View.ClientArtifactView accounts={accounts} contracts={contracts} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
