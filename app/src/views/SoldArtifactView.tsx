import * as React from 'react';
import SoldArtworkList from '../components/SoldArtworkList';
import { ContractProps } from '../helper/eth';

const SoldArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return <SoldArtworkList contracts={contracts} accounts={accounts}/>;
};

export default SoldArtifactView;
