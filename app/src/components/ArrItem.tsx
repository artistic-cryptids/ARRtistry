import * as React from 'react';
import Card from 'react-bootstrap/Card';
import PlaintextField from './common/PlaintextField';
import AddressField from './common/AddressField';
import Form from 'react-bootstrap/Form';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import { EventData } from 'web3-eth-contract';
import * as moment from 'moment';

interface ArrItemProps {
  id: number;
}

interface ArrItemType {
  from: string;
  to: string;
  tokenId: number;
  price: number;
  arr: number;
  location: string;
}

const ArrItem: React.FC<ArrItemProps> = ({ id }) => {
  const [arr, setArr] = React.useState<ArrItemType>();
  const [lastUpdateTime, setUpdateTime] = React.useState<string>('Checking');

  const { web3 } = useWeb3Context();
  const { ArtifactApplication, ArtifactRegistry } = useContractContext();

  React.useEffect(() => {
    const loadArr = async (): Promise<void> => {
      const arrData = await ArtifactApplication.methods.getARR(id).call();
      const arr = {
        from: arrData[0],
        to: arrData[1],
        tokenId: arrData[2],
        price: arrData[3] / 100,
        arr: arrData[4] / 100,
        location: arrData[5],
      };
      setArr(arr);
    };

    const getLastUpdated = async (): Promise<void> => {
      const options = { fromBlock: 0 };
      const events = await ArtifactRegistry.getPastEvents('Propose', options)
        .then((es: EventData[]) => es.filter(e => e.returnValues.proposalId === id.toString()));
      const event = events[events.length - 1];
      const timestamp = await web3.eth.getBlock(event.blockNumber)
        .then((block) => block.timestamp);

      const txDate = moment.unix(Number(timestamp));
      setUpdateTime('Last Updated ' + txDate.fromNow());
    };

    loadArr();
    getLastUpdated();
  }, [ArtifactApplication, id, ArtifactRegistry, web3]);

  if (!arr) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title><span className="text-muted text-capitalize">#{id}</span></Card.Title>
        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
        <Form>
          <PlaintextField label='Piece' value={arr.tokenId.toString()} />
          <AddressField label='Buyer' address={arr.to}/>
          <AddressField label='Seller' address={arr.from}/>
          <PlaintextField label='Sale Location' value={arr.location} />
          <PlaintextField label='Sale Price' value={'€' + arr.price} />
          <PlaintextField label='ARR' value={'€' + arr.arr} />
        </Form>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted"> {lastUpdateTime} </small>
      </Card.Footer>
    </Card>
  );
};

export default ArrItem;
