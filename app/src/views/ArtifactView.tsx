import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import { CommonProps } from '../helper/eth';

const ArtifactView: React.FC<CommonProps> = (props) => {
  const { contracts, accounts } = props;
  return <ArtworkList contracts={contracts} accounts={accounts}/>;
};

export default ArtifactView;
