import * as React from 'react';

import ClientArtifacts from '../components/ClientArtifacts';
import { Drizzled } from 'drizzle';

const ClientArtifactView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <ClientArtifacts drizzle={drizzle} drizzleState={drizzleState}/>;
};

export default ClientArtifactView;
