import * as React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';

import { useSessionContext } from '../providers/SessionProvider';
import { useWeb3Context } from '../providers/Web3Provider';

import * as View from '../views';

import Main from './Main';
import NetworkAside from './NetworkAside';

const Router: React.FC = () => {
  const { user } = useSessionContext();
  const { web3 } = useWeb3Context();

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
    </BrowserRouter>
  );
};

export default Router;
