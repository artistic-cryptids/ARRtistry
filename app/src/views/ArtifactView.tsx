import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import { ContractProps } from '../helper/eth';
import { Container } from 'react-bootstrap';

const ArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return <Container>
    <ArtworkList contracts={contracts} accounts={accounts}/>
  </Container>;
};

export default ArtifactView;
