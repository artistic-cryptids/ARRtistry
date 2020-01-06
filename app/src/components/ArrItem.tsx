import * as React from 'react';
import Card from 'react-bootstrap/Card';
import PlaintextField from './common/PlaintextField';
import AddressField from './common/AddressField';
import Form from 'react-bootstrap/Form';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import { EventData } from 'web3-eth-contract';
import { Link } from 'react-router-dom';
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
  paid: boolean;
}

const ArrItem: React.FC<ArrItemProps> = ({ id }) => {
  const [arr, setArr] = React.useState<ArrItemType>();
  const [lastUpdateTime, setUpdateTime] = React.useState<string>('Checking');

  const { web3 } = useWeb3Context();
  const { ArtifactRegistry, ArrRegistry, RoyaltyDistributor } = useContractContext();

  React.useEffect(() => {
    const loadArr = async (): Promise<void> => {
      const arrData = await ArrRegistry.methods.retrieve(id).call();
      const arrDue: number = await RoyaltyDistributor.methods.calculateARR(arrData.price).call();
      const arr = {
        from: arrData.from,
        to: arrData.to,
        tokenId: arrData.tokenId,
        price: arrData.price / 100,
        arr: arrDue / 100,
        location: arrData.location,
        paid: arrData.paid,
      };
      console.log(arrData);
      setArr(arr);
    };

    loadArr();
  }, [ArrRegistry, id, RoyaltyDistributor]);

  React.useEffect(() => {
    const getLastUpdated = async (): Promise<void> => {
      if (arr) {
        const options = { fromBlock: 0 };
        const events = await ArtifactRegistry.getPastEvents('Transfer', options)
          .then((es: EventData[]) => es.filter(e => e.returnValues.tokenId === arr.tokenId.toString()));
        console.log(events);
        const event = events[events.length - 1];
        const timestamp = await web3.eth.getBlock(event.blockNumber)
          .then((block) => block.timestamp);

        const txDate = moment.unix(Number(timestamp));
        setUpdateTime('Last Updated ' + txDate.fromNow());
      }
    };

    getLastUpdated();
  }, [arr, ArtifactRegistry, web3]);

  if (!arr) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <span className="text-muted text-capitalize">
            #{id} {arr.paid ? 'Paid' : 'Outstanding'}
          </span>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
        <Form>
          <Link to={'/artifact/' + arr.tokenId.toString() }>
            <PlaintextField label='Piece' value={arr.tokenId.toString()} />
          </Link>
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
