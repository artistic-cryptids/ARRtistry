import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import { Drizzled } from 'drizzle';

const ArtifactView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <ArtworkList drizzle={drizzle} drizzleState={drizzleState}/>;
};

export default ArtifactView;
