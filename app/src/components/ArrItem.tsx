import * as React from 'react';
import Card from 'react-bootstrap/Card';
import PlaintextField from './common/PlaintextField';
import AddressField from './common/AddressField';
import Form from 'react-bootstrap/Form';
import { useContractContext } from '../providers/ContractProvider';

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

  const { ArtifactApplication } = useContractContext();

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

    loadArr();
  }, [ArtifactApplication, id]);

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
        <small className="text-muted">Last updated 3 mins ago</small>
      </Card.Footer>
    </Card>
  );
};

export default ArrItem;
