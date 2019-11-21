import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';
import { useWeb3Context } from '../providers/Web3Provider';
import { useRegistryContext } from '../providers/RegistryProvider';
import { MetadataArtworkCard } from './ArtworkCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons';

const ArtworkList: React.FC<ContractProps> = ({ contracts }) => {
  const [tokenIds, setTokenIds] = React.useState<Array<number>>([]);
  const { accounts } = useWeb3Context();
  const registry = useRegistryContext();

  React.useEffect(() => {
    const subscribeToTransfer: VoidFunction = () => {
      const currentAccount = accounts[0];
      const updateTokenIds = (currentAccount: string): void => {
        registry.methods.getTokenIdsOfOwner(currentAccount)
          .call()
          .then((tokenIds: Array<number>) => {
            setTokenIds(tokenIds);
          })
          .catch(console.log);
      };

      updateTokenIds(currentAccount);

      const transferSubscription = registry.events.Transfer({
        filter: { from: currentAccount },
      })
        .on('data', (_: any) => {
          updateTokenIds(currentAccount);
        });

      return () => {
        // Unsubscribe when this component is unmounted
        transferSubscription.unsubscribe();
      };
    };

    if (registry && accounts.length > 0) {
      subscribeToTransfer();
    }
  }, [registry, accounts]);

  const listItems = tokenIds.map((tokenId: number) =>
    <ArtworkItem
      contracts={contracts}
      accounts={accounts}
      tokenId={tokenId}
      key={tokenId}
      ownedArtifact
    />,
  );

  return (
    <CardColumns>
      {listItems}
      <MetadataArtworkCard>
        {tokenIds.length > 0
          ? <p>You own <h1>{tokenIds.length}</h1> Artifacts!</p>
          : <p>You don't own any artifacts, if you want to request a new artifact to be added <h1><FontAwesomeIcon icon={faPlus}/></h1> here.</p>
        }
      </MetadataArtworkCard>
    </CardColumns>
  );
};

export default ArtworkList;
