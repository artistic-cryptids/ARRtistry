import * as React from 'react';
import { DrizzleContext } from 'drizzle-react';
import ArtPieceList from './ArtPieceList';
import Register from './Register';

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
            <ArtPieceList/>
            <Register drizzle={drizzle} drizzleState={drizzleState}/>
          </div>
        );
      }}
    </DrizzleContext.Consumer>
  );
};

export default AppComponent;
