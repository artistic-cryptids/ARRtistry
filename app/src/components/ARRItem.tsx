import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { ContractProps } from '../helper/eth';
import ENSName from './common/ENSName';

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
    const ARRData = await this.props.contracts.ArtifactApplication.getARR(this.props.id);
    const ARR = {
      from: ARRData[0],
      to: ARRData[1],
      // uints are returned as big numbers so we need to convert them
      tokenId: ARRData[2].toNumber(),
      price: ARRData[3].toNumber() / 100,
      arr: ARRData[4].toNumber() / 100,
      location: ARRData[5],
    };
    console.log(ARRData);
    this.setState({ ARR: ARR });
    console.log(ARR);
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
          <Card.Text>
            Piece: {arr.tokenId} <br />
            From: <ENSName
              address={arr.from}
              contracts={this.props.contracts}
              accounts={this.props.accounts}
            /> <br />
            To: <ENSName
              address={arr.to}
              contracts={this.props.contracts}
              accounts={this.props.accounts}
            /> <br />
            Price: &euro;{arr.price} <br />
            ARR: &euro;{arr.arr} <br />
            Location: {arr.location} <br />
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    );
  }
}

export default ARRItem;
