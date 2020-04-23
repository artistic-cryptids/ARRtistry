import * as React from 'react';
import SoldArtworkItem from './SoldArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import { useTokenContext } from '../providers/TokenProvider';
import Loading from './common/Loading';

interface SoldInformation {
  tokenId: number;
  price: number;
  newOwner: string;
}

const SoldArtworkList: React.FC = () => {
  const [balance, setBalance] = React.useState<number>(-1);
  const [soldList, setSoldList] = React.useState<SoldInformation[]>([]);

  const { ArtifactRegistry } = useContractContext();
  const { accounts } = useWeb3Context();
  const { validTokenIds } = useTokenContext();
  console.log('SoldArtworkList:', validTokenIds);

  React.useEffect(() => {
    const currentAccount = accounts[0];
    const options = { fromBlock: 0 };

    ArtifactRegistry.getPastEvents('RecordSale', options).then((events: any[]) => {
      const soldMap = events.filter(event => event.returnValues.from === currentAccount)
        .map((event) => {
          return {
            tokenId: parseInt(event.returnValues.tokenId),
            price: event.returnValues.price,
            newOwner: event.returnValues.to,
          };
        })
        .filter(({ tokenId }) => validTokenIds.includes(tokenId));
      setSoldList(soldMap);
      setBalance(soldMap.length);
    }).catch(console.log);
  }, [ArtifactRegistry, validTokenIds, accounts]);

  if (balance === -1) {
    return <Loading />;
  }

  if (balance === 0) {
    return (
      <h1>No sales to display</h1>
    );
  }

  const listItems = soldList.map((sold, index) => {
    return <SoldArtworkItem
      soldFor={sold.price}
      soldTo={sold.newOwner}
      tokenId={sold.tokenId}
      key={sold.tokenId * 3 + index * 5}
    />;
  });

  return (
    <CardColumns>{listItems}</CardColumns>
  );
};

export default SoldArtworkList;
