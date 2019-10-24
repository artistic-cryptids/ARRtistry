import * as React from 'react';
import { DrizzleContext } from 'drizzle-react';
import ArtworkList from './ArtworkList';
import Register from './Register';
import Governance from './Governance';
import TopNavBar from './TopNavBar';

const AppComponent: React.FC = () => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext: any): React.ReactNode => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          // TODO: Show a more user-friendly loading screen
          return 'Loading...';
        }

        return (
          <div>
            <TopNavBar/>
            <ArtworkList drizzle={drizzle} drizzleState={drizzleState}/>
            <Register drizzle={drizzle} drizzleState={drizzleState}/>
            <Governance drizzle={drizzle} drizzleState={drizzleState}/>
          </div>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default AppComponent;
