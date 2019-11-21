import * as React from 'react';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Artist, ArtworkInfoFields } from './ArtworkInfo';
import CenterSpinner from './common/CenterSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import {
  faEllipsisH,
  faEuroSign,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';
import { Provenance, ProvenanceModal } from './Provenance';
import { Documents, DocumentsModal } from './Documents';

interface ArtworkCardProps {
  id?: number;
  img?: string;
  metaUri?: string;
  fields?: ArtworkInfoFields;
  artist?: Artist;
  fullscreen?: true;
}

export const MetadataArtworkCard: React.FC = ({children}) => {
  return (
    <Card bg="primary" text="white" className="text-center p-3">
      <blockquote className="blockquote mb-0 card-body">
        {children}
      </blockquote>
    </Card>
  );
}

const Toolbar: React.FC = () => {
  return <div className="clearfix">
    <Dropdown alignRight>
      <Dropdown.Toggle as={Button} variant="outline-primary" size="sm" className="float-right" id="toolbar">
        <FontAwesomeIcon icon={faEllipsisH} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Artifact Options</Dropdown.Header>
        <Dropdown.Item href="#/action-1">
          <FontAwesomeIcon icon={faEuroSign} /> Register a Sale
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2">
          <FontAwesomeIcon icon={faExchangeAlt} /> Consignment
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
    id,
    img,
    metaUri,
    fields,
    artist,
    fullscreen,
    children
  }) => {
  return (

    <Card className="shadow">
      <Card.Header>
        <Toolbar/>
      </Card.Header>
      <Card.Body>
        {img && <Card.Img variant="top" src={img} />}
        {id && fields
          ? <Card.Title><span className="text-muted text-capitalize">#{id} </span>{fields.title}</Card.Title>
          : <CenterSpinner/>
        }
        {artist && <Card.Subtitle className="mb-2 text-muted">{artist.name}</Card.Subtitle> }
        <hr/>
        {fields
          && fields.description === ''
          && <React.Fragment><Card.Text>{fields.description}</Card.Text><hr/></React.Fragment>}
        {children}
        <hr/>
        <Card.Text>
          {!!fields
            ? <>
              <span className="text-muted text-capitalize">Creation Date:</span> {fields.artifactCreationDate}
              <br/>
              <span className="text-muted text-capitalize">Medium:</span> {fields.medium}
              <br/>
              <span className="text-muted text-capitalize">Height:</span> {fields.height}
              <span className="text-muted text-capitalize"> Width:</span> {fields.width}
            </>
            : <CenterSpinner />
          }
        </Card.Text>
        { !fullscreen
          ? <div className="text-center">
              <ButtonGroup>
                {fields && <DocumentsModal documents={fields.documents}/>}
                {metaUri && <ProvenanceModal metaUri={metaUri} />}
              </ButtonGroup>
            </div>
          : <Card.Text>
              {fields && fields.documents &&
                <>
                  <h5>Documents</h5>
                  <hr/>
                  <Documents documents={fields.documents}/>
                </>
              }
              {metaUri &&
                <>
                  <h5>Provenance</h5>
                  <hr/>
                  <Provenance tokenId={id}/>
                </>
              }
            </Card.Text>
        }

      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Last updated 3 mins ago</small>
      </Card.Footer>
    </Card>
  );
}

export default ArtworkCard;
