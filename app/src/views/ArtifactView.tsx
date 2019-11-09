import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import { ContractProps } from '../helper/eth';

const ArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return <ArtworkList contracts={contracts} accounts={accounts}/>;
};

export default ArtifactView;
