import * as React from 'react';
import Card from 'react-bootstrap/Card';

interface ARRItemProps {
  drizzle: any;
  drizzleState: any;
  id: number;
  contracts: any; 
  accounts: Array<string>;
}

type ARRItemType = {
  from: string;
  to: string;
  tokenId: number;
  price: number;
  location: string;
}

type ARRItemState = {
  ARR: ARRItemType
}

class ARRItem extends React.Component<ARRItemProps, ARRItemState> {
  componentDidMount (): void {
    this.loadARR();
  }

  async loadARR (): Promise<void> {
    this.props.contracts.ArtifactApplication.getARR(this.props.id)
      .then((ARRData: any): void => {
        const ARR = {
          from: ARRData[0],
          to: ARRData[1],
          // tokenId and price are ints. They are accessed via 'words'
          tokenId: ARRData[2].words[0],
          price: ARRData[3].words[0],
          location: ARRData[4],
        };
        console.log(ARRData);
        this.setState({ ARR: ARR });
        console.log(ARR);
      })
      .catch((err: any): void => { console.log(err); });
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
            From: <i>{arr.from}</i> <br />
            To: <i>{arr.to}</i> <br />
            Price: &euro;{arr.price} <br />
            ARR: &euro;{arr.price / 10} <br />
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
