import * as React from 'react';
import Card from 'react-bootstrap/Card';

interface ARRItemProps {
  drizzle: any;
  drizzleState: any;
  id: number;
}

type ARRItemState = {
  ARR: {
    from: string;
    to: string;
    tokenId: number;
    price: number;
    arr: number;
    location: string;
  };
}

class ARRItem extends React.Component<ARRItemProps, ARRItemState> {
  componentDidMount (): void {
    // console.log(this.props.id);
    this.loadARR();
  }

  async loadARR (): Promise<void> {
    this.props.drizzle.contracts.ArtifactApplication.methods.getARR(this.props.id)
      .call()
      .then((ARRData: any): void => {
        const ARR = {
          from: ARRData[0],
          to: ARRData[1],
          tokenId: ARRData[2],
          price: ARRData[3] / 100,
          arr: ARRData[4] / 100,
          location: ARRData[5],
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
