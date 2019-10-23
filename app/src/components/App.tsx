import * as React from 'react';
import { DrizzleContext } from 'drizzle-react';
import ArtworkList from './ArtworkList';
import Register from './Register';
import Governance from './Governance';
import Loading from './Loading';
import NetworkAside from './NetworkAside';

const AppComponent: React.FC = () => {
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext: any): React.ReactNode => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        return (
          <div>
            {!initialized ? (
               ''
            ) : (
              <div>
                <NetworkAside drizzle={drizzle}/>
                <ArtworkList drizzle={drizzle} drizzleState={drizzleState}/>
                <Register drizzle={drizzle} drizzleState={drizzleState}/>
                <Governance drizzle={drizzle} drizzleState={drizzleState}/>
              </div>
            )}
          </div>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default AppComponent;
