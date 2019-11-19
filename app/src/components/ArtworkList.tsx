import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';
import { useWeb3Context } from '../providers/Web3Provider';

const ArtworkList: React.FC<ContractProps> = ({ contracts, accounts }) => {
  const [tokenIds, setTokenIds] = React.useState<Array<number>>([]);
  const web3 = useWeb3Context();

  React.useEffect(() => {
    const artifactRegistry = web3.contracts.ArtifactRegistry;
    const currentAccount = web3.accounts[0];
    const updateTokenIds = (currentAccount: string): void => {
      artifactRegistry.methods.getTokenIdsOfOwner(currentAccount)
        .call()
        .then((tokenIds: Array<number>) => {
          setTokenIds(tokenIds);
        })
        .catch(console.log);
    };

    updateTokenIds(currentAccount);

    const transferSubscription = artifactRegistry.events.Transfer({
      filter: { from: currentAccount },
    })
      .on('data', (_: any) => {
        updateTokenIds(currentAccount);
      });

    return () => {
      // Unsubscribe when this component is unmounted
      transferSubscription.unsubscribe();
    };
  }, [accounts, web3]);

  const listItems = tokenIds.map((tokenId: number) =>
    <ArtworkItem
      contracts={contracts}
      accounts={accounts}
      tokenId={tokenId}
      key={tokenId}
      isOwnedArtifact={true}
    />,
  );

  return (
    <CardColumns>{listItems}</CardColumns>
  );
};

export default ArtworkList;
