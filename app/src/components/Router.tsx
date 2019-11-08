import * as React from 'react';
import { DrizzleContext } from 'drizzle-react';
import NetworkAside from './NetworkAside';

import { ArtifactView, ProposalView, ARRView, RegisterView, RegisterArtistView, ClientArtifactView } from '../views';

import { Route, Switch, Redirect } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import { BrowserRouterProvider } from '../providers/BrowserRouterProvider';
import { useSessionContext } from '../providers/SessionProvider';
import HomePageNoAccount from './HomePageNoAccount';

const Router: React.FC = () => {
  const { account } = useSessionContext();

  return (
    <BrowserRouterProvider>
      <Switch>
        { account && account.address && <Redirect from='/login' to='/'/> }
        { account && <Redirect from='/register' to='/'/> }
        { !account && <Redirect from='/manage' to='/login'/> }
        { !account && <Redirect from='/' to='/login'/> }
        <Route exact path="/" component={HomePageNoAccount}/>
        <Route path="/artifact/new" component={RegisterView} />
        <Route path="/artifact" component={ArtifactView} />
        <Route path="/manage/proposal" component={ProposalView} />
        <Route path="/manage/arr" component={ARRView} />
        <Route path ="/artist/new" component={RegisterArtistView} />
        <Route path="/client/all/artifact" component={ClientArtifactView} />
      </Switch>
    </BrowserRouterProvider>
  );
};

const Main: React.FC = ({ children }) => {
  return (
    <LeftSidebar>
      {children}
    </LeftSidebar>
  );
}

export default Router;
