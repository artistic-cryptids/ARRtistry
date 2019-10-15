import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import User from './User';

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;

      if (!initialized) {
        // TODO: Show a more user-friendly loading screen
        return 'Loading...';
      }

      return (
        <User drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
);
