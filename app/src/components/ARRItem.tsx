import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { ContractProps } from '../helper/eth';
import PlaintextField from './common/PlaintextField';
import AddressField from './common/AddressField';
import Form from 'react-bootstrap/Form';

interface ARRItemProps extends ContractProps {
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

interface ARRItemState {
  ARR: ARRItemType;
}

class ARRItem extends React.Component<ARRItemProps, ARRItemState> {
  componentDidMount (): void {
    this.loadARR();
  }

  async loadARR (): Promise<void> {
    const ARRData = await this.props.contracts.ArtifactApplication.methods.getARR(this.props.id).call();
    const ARR = {
      from: ARRData[0],
      to: ARRData[1],
      tokenId: ARRData[2],
      price: ARRData[3] / 100,
      arr: ARRData[4] / 100,
      location: ARRData[5],
    };
    this.setState({ ARR: ARR });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return null;
    }

    const arr = this.state.ARR;
    return (
      <Card>
        <Card.Body>
          <Card.Title><span className="text-muted text-capitalize">#{this.props.id}</span></Card.Title>
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
  }
}

export default ARRItem;
