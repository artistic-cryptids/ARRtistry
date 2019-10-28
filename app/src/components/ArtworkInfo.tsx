import * as React from 'react';
import Card from 'react-bootstrap/Card';

interface Artwork {
  metaUri: string; 
}

interface ArtworkInfoProps {
  artwork: Artwork;
  id: any;
}

class ArtworkInfo extends React.Component<ArtworkInfoProps, {}> {
  render (): React.ReactNode {
    const artwork = this.props.artwork;
    return (
      <Card className="shadow">
        <Card.Body>
          <Card.Img variant="top" src={'https://ipfs.io/ipfs/QmaypJyKu157bEE4b9eMLxpskfdykeHRC1iMMy8n1w2mDt'} />
          <Card.Title><span className="text-muted text-capitalize">#{this.props.id} </span>title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">artistName</Card.Subtitle>
          <Card.Text>
            {this.props.artwork.metaUri}
            Some quick example text to build on the card title and make up the bulk of
            the card&apos;s content.
            createdDate. medium
          </Card.Text>
          {this.props.children}
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated 3 mins ago</small>
        </Card.Footer>
      </Card>
    );
  }
}

export default ArtworkInfo;
