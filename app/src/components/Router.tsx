import * as React from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';

import { useSessionContext } from '../providers/SessionProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import { TransactionProvider } from '../providers/TransactionProvider';

import * as View from '../views';

import NetworkAside from './NetworkAside';

const Router: React.FC = () => {
  const { getPermissions } = useSessionContext();
  const { web3 } = useWeb3Context();
  const permissions = getPermissions();
  return (
    <HashRouter>
      <TransactionProvider>
        <NetworkAside web3={web3} />
        <Switch>
          { !permissions.managing && <Redirect from='/manage/' to='/'/> }
          {/* TODO: Needs more logic here, just depends on roles */}
          <Route exact path="/">
            <View.DashboardView/>
          </Route>
          <Route path="/artifact/new">
            <View.RegisterView/>
          </Route>
          <Route path="/artifact/sold">
            <View.SoldArtifactView/>
          </Route>
          <Route path="/artifact/:id" render={({ match }) =>
            <View.ArtifactById id={match.params.id} />
          } />
          <Route path="/artifact">
            <View.ArtifactView/>
          </Route>
          <Route path="/manage/proposal">
            <View.ProposalView/>
          </Route>
          <Route path="/manage/arr">
            <View.ArrView/>
          </Route>
          <Route path ="/artist/new">
            <View.RegisterArtistView/>
          </Route>
          <Route path="/client/all/artifact">
            <View.ClientArtifactView/>
          </Route>
        </Switch>
      </TransactionProvider>
    </HashRouter>
  );
};

export default Router;
