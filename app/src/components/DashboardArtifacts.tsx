import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import ArtworkItem from './ArtworkItem';
import { useTokenContext } from '../providers/TokenProvider';

const DashboardArtifacts: React.FC = () => {
  const { validTokenIds } = useTokenContext();

  return (
    <CardColumns>
      {validTokenIds.map(i =>
        <ArtworkItem tokenId={i} key={i} ownedArtifact={undefined}/>)}
    </CardColumns>
  );
};

export default DashboardArtifacts;
