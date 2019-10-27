import * as React from 'react';
import { DrizzleContext } from 'drizzle-react';
import NetworkAside from './NetworkAside';
import Container from 'react-bootstrap/Container';
import {
  ArtifactView,
  RegisterView,
  GovernanceView,
} from './Views';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <Container>
        <Navigation/>
        <Switch>
          <Route exact path="/">
            <Redirect to={{ pathname: '/artifacts' }} />
          </Route>
          <Route path="*">
            <DrizzledApp />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

const Navigation: React.FC = () => {
  return <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/artifacts">Artifacts</Link>
      </li>
      <li>
        <Link to="/new">New</Link>
      </li>
      <li>
        <Link to="/governance">Governance</Link>
      </li>
    </ul>
  </nav>;
};

const DrizzledApp: React.FC = () => {
  return <DrizzleContext.Consumer>
    {(drizzleContext: any): React.ReactNode => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      return initialized ? (
        <>
          <NetworkAside drizzle={drizzle}/>
          <Switch>
            <Route path="/artifacts">
              <ArtifactView drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path="/new">
              <RegisterView drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
            <Route path="/governance">
              <GovernanceView drizzle={drizzle} drizzleState={drizzleState}/>
            </Route>
          </Switch>
        </>
      ) : null;
    }}
  </DrizzleContext.Consumer>;
};

export default App;
