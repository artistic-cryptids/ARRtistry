import * as React from 'react';
import SoldArtworkList from '../components/SoldArtworkList';
import { ContractProps } from '../helper/eth';
import Main from '../components/Main';

const SoldArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts, ens } = props;
  return (
    <Main page="Sold Artifacts" parents={['Artifacts']}>
      <SoldArtworkList contracts={contracts} accounts={accounts} ens={ens}/>
    </Main>
  );
};

export default SoldArtifactView;
