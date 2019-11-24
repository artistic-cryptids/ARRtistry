import * as React from 'react';
import Card from 'react-bootstrap/Card';
import PlaintextField from './common/PlaintextField';
import AddressField from './common/AddressField';
import Form from 'react-bootstrap/Form';
import { useContractContext } from '../providers/ContractProvider';

interface ARRItemProps {
  id: number;
}

interface ARRItemType {
  from: string;
  to: string;
  tokenId: number;
  price: number;
  arr: number;
  location: string;
}

const ARRItem: React.FC<ARRItemProps> = ({ id }) => {
  const [ARR, setARR] = React.useState<ARRItemType>();

  const { ArtifactApplication } = useContractContext();

  React.useEffect(() => {
    const loadARR = async (): Promise<void> => {
      const ARRData = await ArtifactApplication.methods.getARR(id).call();
      const ARR = {
        from: ARRData[0],
        to: ARRData[1],
        tokenId: ARRData[2],
        price: ARRData[3] / 100,
        arr: ARRData[4] / 100,
        location: ARRData[5],
      };
      setARR(ARR);
    };

    loadARR();
  }, [ArtifactApplication, id]);

  if (!ARR) {
    return null;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title><span className="text-muted text-capitalize">#{id}</span></Card.Title>
        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
        <Form>
          <PlaintextField label='Piece' value={ARR.tokenId.toString()} />
          <AddressField label='Buyer' address={ARR.to}/>
          <AddressField label='Seller' address={ARR.from}/>
          <PlaintextField label='Sale Location' value={ARR.location} />
          <PlaintextField label='Sale Price' value={'€' + ARR.price} />
          <PlaintextField label='ARR' value={'€' + ARR.arr} />
        </Form>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Last updated 3 mins ago</small>
      </Card.Footer>
    </Card>
  );
};

export default ARRItem;
