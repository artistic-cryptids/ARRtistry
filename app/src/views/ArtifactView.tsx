import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import { ContractProps } from '../helper/eth';
import Main from '../components/Main';

const ArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <Main page="Owned" parents={['Artifacts']}>
      <ArtworkList contracts={contracts} accounts={accounts}/>
    </Main>
  );
};

export default ArtifactView;
