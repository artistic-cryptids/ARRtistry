import * as React from 'react';
import SoldArtworkItem from './SoldArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';

interface SoldInformation {
  tokenId: number;
  price: number;
  newOwner: string;
}

const SoldArtworkList: React.FC<ContractProps> = ({ contracts, accounts }) => {
  const [balance, setBalance] = React.useState<number>(0);
  const [soldList, setSoldList] = React.useState<SoldInformation[]>([]);

  const loadSales: VoidFunction = () => {
    const governance = contracts.Governance;
    const currentAccount = accounts[0];
    const filter = { filter: { from: currentAccount } };
    const options = { filter, fromBlock: 0 };

    governance.getPastEvents('RecordARR', options).then((events: any[]) => {
      const soldMap = events.map((event) => {
        return {
          tokenId: event.returnValues.tokenId,
          price: event.returnValues.price,
          newOwner: event.returnValues.to,
        };
      },
      ).filter(event => event.returnValues.from === currentAccount);
      setSoldList(soldMap);
      setBalance(soldMap.length);
    }).catch(console.log);
  };

  React.useEffect(loadSales, [balance, soldList]);

  if (balance === 0) {
    return (
      <h1>No sales to display</h1>
    );
  }

  const listItems = soldList.map((sold, index) => {
    return <SoldArtworkItem
      contracts={contracts}
      accounts={accounts}
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
