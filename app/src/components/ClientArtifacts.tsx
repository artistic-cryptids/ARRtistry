import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

interface ClientArtifactsState {
  numClientArtifacts: number;
  tokenIds: Array<number>;
}

const ClientArtifacts: React.FC = () => {
  const [numClientArtifacts, setNumClientArtifacts] = React.useState<number>();
  const [tokenIds, setTokenIds] = React.useState<number[]>();

  const { ArtifactRegistry } = useContractContext();
  const { accounts } = useWeb3Context();

  React.useEffect(() => {
    const currentAccount = accounts[0];

    ArtifactRegistry.methods.getOperatorTokenIds(currentAccount)
      .call()
      .then((tokenIdObjects: any) => {
        const tokenIds: number[] = [];
        tokenIdObjects.map((tid: any) => tokenIds.push(tid));
        if (tokenIds.length !== numClientArtifacts) {
          setNumClientArtifacts(tokenIds.length);
          setTokenIds(tokenIds);
        }
      })
      .catch(console.log);
  }, [ArtifactRegistry, accounts, numClientArtifacts]);

  if (!numClientArtifacts) {
    return (
      <Container>
        <span>No artworks to show, please register one below</span>
      </Container>
    );
  }

  if (!tokenIds) {
    return null;
  }

  const listItems = tokenIds.map((tokenId: number) =>
    <ArtworkItem
      tokenId={tokenId}
      key={tokenId}
    />,
  );

  return (
    <Container>
      <CardColumns>
        {listItems}
      </CardColumns>
    </Container>
  );
};

export default ClientArtifacts;
