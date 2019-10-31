import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup'; 
import Card from 'react-bootstrap/Card';


interface ARRItemProps {
  drizzle: any;
  drizzleState: any;
  id: number;
}

type ARRItemState = {
  ARR: any;
}

class ARRItem extends React.Component<ARRItemProps, ARRItemState> {
  /*rejectARR = (_: React.MouseEvent): void => {
    console.log('Rejecting ARR ' + this.props.id);
    this.props.drizzle.contracts.Governance.methods.reject(this.props.id).send({
      from: this.props.drizzleState.accounts[0],
    });
  }

  approveARR = (_: React.MouseEvent): void => {
    console.log('Approving ARR ' + this.props.id);
    this.props.drizzle.contracts.Governance.methods.approve(this.props.id)
      .send({
        from: this.props.drizzleState.accounts[0],
      });
  }*/

  componentDidMount (): void {
    //console.log(this.props.id);
    this.loadARR(); 
  }

  async loadARR(): Promise<void> {
    const ARRData = await this.props.drizzle.contracts.Governance.methods.getARR.cacheCall("1");
    //const ARRData = await this.props.drizzle.contracts.ArtifactApplication.methods.getARR.cacheCall("1");
    console.log(ARRData)
    const ARR = {
      from: ARRData[0],
      to: ARRData[1], 
      tokenId: ARRData[2],
      price: ARRData[3],
    };
    console.log(ARR);
    this.setState({ ARR: ARR });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return null;
    }

    return (
        <Card>
        <Card.Body>
        <Card.Title><span className="text-muted text-capitalize">#{this.props.id} </span>{this.state.ARR.price}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">jdjkd</Card.Subtitle>
        <Card.Text>
        Some quick example text to build on the card title and make up the bulk of
        the card&apos;s content.
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
