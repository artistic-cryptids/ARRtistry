import * as React from 'react';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Artist, ArtworkInfoFields } from './ArtworkInfo';
import CenterSpinner from './common/CenterSpinner';
import { Provenance, ProvenanceModal } from './Provenance';
import { Documents, DocumentsModal } from './Documents';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import PlaintextField from './common/PlaintextField';
import { useContractContext } from '../providers/ContractProvider';
import { EventData } from 'web3-eth-contract';
import { useWeb3Context } from '../providers/Web3Provider';
import * as moment from 'moment';

interface ArtworkCardProps {
  id: number;
  className?: string;
  img?: string;
  metaUri?: string;
  fields?: ArtworkInfoFields;
  artist?: Artist;
  placeholder?: true;
  fullscreen?: true;
}

export const MetadataArtworkCard: React.FC = ({ children }) => {
  return (
    <Card bg="primary" text="white" className="text-center p-3">
      <blockquote className="blockquote mb-0 card-body">
        {children}
      </blockquote>
    </Card>
  );
};

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  id,
  className,
  img,
  fields,
  artist,
  fullscreen,
  placeholder,
  children,
}) => {
  const [lastUpdateTime, setUpdateTime] = React.useState<string>('Checking');

  const { web3 } = useWeb3Context();
  const { ArtifactRegistry, Governance } = useContractContext();

  React.useEffect(() => {
    if (placeholder) {
      return;
    }

    const getLastUpdated = async (): Promise<void> => {
      const options = { fromBlock: 0 };
      let events = await ArtifactRegistry.getPastEvents('Transfer', options)
        .then((es: EventData[]) =>
          es.filter(e => e.returnValues.tokenId === id.toString()));
      if (events.length === 0) {
        events = await Governance.getPastEvents('Propose', options)
          .then((es: EventData[]) =>
            es.filter(e => e.returnValues.proposalId === id.toString()));
      }
      if (events.length > 0) {
        const event = events[events.length - 1];
        const timestamp = await web3.eth.getBlock(event.blockNumber)
          .then((block) => block.timestamp);
        const txDate = moment.unix(Number(timestamp));
        setUpdateTime('Last Updated ' + txDate.fromNow());
      }
    };
    getLastUpdated();
  }, [ArtifactRegistry, id, web3, Governance, placeholder]);

  const path = `/artifact/${id}`;

  const cardClass = className ? `shadow ${className}` : 'shadow';

  return (
    <Card className={cardClass}>
      <Card.Body>
        {img && <Card.Img variant="top" src={img} />}
        {id && fields
          ? <Card.Title>
            <Link to={path}>
              <span className="text-muted text-capitalize">#{id} </span>{fields.name}
            </Link>
          </Card.Title>
          : <CenterSpinner/>
        }
        {artist && <Card.Subtitle className="mb-2 text-muted">{artist.name}</Card.Subtitle> }
        <hr/>
        {fields &&
          fields.description !== '' &&
          <>
            <Card.Text>{fields.description}</Card.Text>
            <hr/>
          </>}
        {children}
        {children !== undefined && <hr/>}
        {fields
          ? <Form>
            <PlaintextField label='Creation Date' value={fields.artifactCreationDate} />
            <PlaintextField label='Medium' value={fields.medium}/>
            <PlaintextField label='Size' value={fields.height + ' x ' + fields.width} />
          </Form>
          : <CenterSpinner />
        }
        { !fullscreen
          ? <div className="text-center">
            <ButtonGroup>
              {fields && <DocumentsModal documents={fields.documents}/>}
              {id && <ProvenanceModal tokenId={id} />}
            </ButtonGroup>
          </div>
          : <Card.Text as="div">
            {fields &&
              fields.documents &&
              fields.documents.length > 0 &&
              <>
                <h5>Documents</h5>
                <hr/>
                <Documents documents={fields.documents}/>
              </>
            }
            {id &&
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

        <small className="text-muted"> {lastUpdateTime} </small>
      </Card.Footer>
    </Card>
  );
};

export default ArtworkCard;
