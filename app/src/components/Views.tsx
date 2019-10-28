import * as React from 'react';

import ArtworkList from './ArtworkList';
import Register from './Register';
import Governance from './Governance';
import { Drizzled } from 'drizzle';

const ArtifactView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <ArtworkList drizzle={drizzle} drizzleState={drizzleState}/>;
};

const RegisterView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <Register drizzle={drizzle} drizzleState={drizzleState}/>;
};

const GovernanceView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <Governance drizzle={drizzle} drizzleState={drizzleState}/>;
};

export {
  ArtifactView,
  RegisterView,
  GovernanceView,
};
