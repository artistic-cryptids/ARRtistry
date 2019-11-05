import * as React from 'react';

import ArtworkList from './ArtworkList';
import Register from './Register';
import Governance from './Governance';
import RegisterArtist from './RegisterArtist';
import ClientArtifacts from './ClientArtifacts';
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

const RegisterArtistView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <RegisterArtist drizzle={drizzle} drizzleState={drizzleState}/>;
};

const ClientArtifactsView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <ClientArtifacts drizzle={drizzle} drizzleState={drizzleState}/>;
};

export {
  ArtifactView,
  RegisterView,
  GovernanceView,
  RegisterArtistView,
  ClientArtifactsView,
};
