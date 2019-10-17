import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import User from './User';
import ArtPieceList from './ArtPieceList';
import Register from './Register';

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
          <ArtPieceList /> new ui elements
          <Register />
        </div>
      );
    }}
  </DrizzleContext.Consumer>
);
