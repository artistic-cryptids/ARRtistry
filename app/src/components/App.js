import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import ArtPieceList from './ArtPieceList';
import GovernanceArtPieceList from './GovernanceArtPieceList';
import Register from './Register';

const AppComponent = (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        // TODO: Show a more user-friendly loading screen
        return <h1>Loading...</h1>;
      }

      return (
        <div>
          <ArtPieceList/>
          <Register drizzle={drizzle} drizzleState={drizzleState}/>
          <GovernanceArtPieceList drizzle={drizzle} drizzleState={drizzleState}/>
        </div>
      );
    }}
  </DrizzleContext.Consumer>
);

export default () => AppComponent;
