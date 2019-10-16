import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import User from './User';
import ArtPieceList from './ArtPieceList'

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        // TODO: Show a more user-friendly loading screen
        return 'Loading...';
      }

      return (
        <div>
          <User drizzle={drizzle} drizzleState={drizzleState} />
          <ArtPieceList />
        </div>
      );
    }}
  </DrizzleContext.Consumer>
);
