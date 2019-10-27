import React from 'react';
import { DrizzleContext } from 'drizzle-react';

// TODO: Add animation for loading
// import FadeIn from 'react-fade-in';
// import Lottie from 'react-lottie';
import ReactLoading from 'react-loading';

import ArtworkList from './ArtworkList';
import Register from './Register';
import Governance from './Governance';
import NetworkAside from './NetworkAside';

type LoadingState = {
  done: boolean;
}

export default class Loading extends React.Component<{}, LoadingState> {
  constructor (props: {}) {
    super(props);
    this.state = {
      done: false,
    };
  }

  render (): React.ReactNode {
    return <DrizzleContext.Consumer>
      {(drizzleContext: any): React.ReactNode => {
        const { drizzle, drizzleState, initialized } = drizzleContext;
        return (
          <div>
            {!initialized ? (
              <ReactLoading type={'cubes'} color={'black'} />
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
    </DrizzleContext.Consumer>;
  }
}
