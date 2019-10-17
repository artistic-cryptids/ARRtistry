import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import User from './User';

const AppComponent = (
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

export default () => AppComponent;
