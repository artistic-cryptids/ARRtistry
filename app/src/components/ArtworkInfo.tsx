import * as React from 'react';
import Card from 'react-bootstrap/Card';

interface Artwork {
  title: string;
  artistName: string;
  createdDate: string;
  medium: string;
  imageIpfsHash: string;
}

interface ArtworkInfoProps {
  artwork: Artwork;
  id: number;
}

class ArtworkInfo extends React.Component<ArtworkInfoProps, {}> {
  render (): React.ReactNode {
    const artwork = this.props.artwork;
    return (
      <Card className="shadow">
        <Card.Body>
          <Card.Img variant="top" src={'https://ipfs.io/ipfs/' + this.props.artwork.imageIpfsHash} />
          <Card.Title><span className="text-muted text-capitalize">#{this.props.id} </span>{artwork.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{artwork.artistName}</Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card&apos;s content.
            {this.props.artwork.createdDate}. {this.props.artwork.medium}
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
