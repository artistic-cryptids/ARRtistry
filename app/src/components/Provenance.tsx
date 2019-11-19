import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEuroSign,
  faFingerprint,
} from '@fortawesome/free-solid-svg-icons';

import * as styles from './Timeline.module.scss';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ENSName from './common/ENSName';
import { Dictionary } from 'lodash';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ArtifactRegistry } from '../helper/eth';
import { useSessionContext } from '../providers/SessionProvider';


interface ProvenanceProps {
  metaUri: string;
  registry: ArtifactRegistry;
  tokenId: number;
}

interface ArtworkInfo {
  saleProvenance: Array<SaleRecord>;
}

interface SaleRecord {
  price: number;
  location: string;
  buyers: Array<string>;
  seller: string;
  date: string;
}

interface ProvenanceState {
  showProvenance: boolean;
  saleProvenance: Array<SaleRecord>;
}

interface BlockHeading {
  header: string;
  icon: IconProp;
}

const BLOCK_HEADINGS: Dictionary<BlockHeading> = {
  'mint': {
    header: 'Piece of Art Registered',
    icon: faFingerprint,
  },
  'sale': {
    header: 'Sale',
    icon: faEuroSign,
  },
};

const AddressInfo: React.FC<{address: string; label: string}> =
({ address, label }) => {
  return <Form.Group as={Form.Row}>
    <Form.Label column sm="2">
      {label}
    </Form.Label>
    <Col sm="10">
      <ENSName address={address}/>
    </Col>
  </Form.Group>;
};

const TimelineBlock: React.FC<{type: string; date: string}> = ({ type, date, children }) => {
  const { header, icon } = BLOCK_HEADINGS[type];
  return (
    <li className={styles.timelineBlock}>
      <a href="#!">
        <span className={styles.timelineIcon}><FontAwesomeIcon icon={icon} size='1x'/></span>
      </a>
      <div className={styles.timelineContent}>
        <Row>
          <Col sm='8'>
            <h4 className="font-weight-bold">{header}</h4>
          </Col>
          <Col sm='4'>
            <p className={'text-muted ' + styles.date}>
              {date}
            </p>
          </Col>
        </Row>
        <Row>
          <Col sm='12'>
            {children}
          </Col>
        </Row>
      </div>
    </li>
  );
};

const Timeline: React.FC<{records: SaleRecord[]}> =
({ records }) => {
  return (
    <Col md='12'>
      <ul className={styles.timeline}>
        <TimelineBlock type="mint" date={'Today'}>
        </TimelineBlock>
        {records.map((record: SaleRecord, index: number) => <TimelineBlock type="sale" date={record.date} key={index}>
          <Form>
            <AddressInfo label='Buyer' address={record.buyer}/>
            <AddressInfo label='Seller' address={record.seller} />
            <PlaintextField label='Sale Location' value={record.location} />
            <PlaintextField label='Sale Price' value={'€' + (record.price / 100).toString()} />
          </Form>
        </TimelineBlock>)}
      </ul>
    </Col>
  );
};

const Provenance: React.FC<ProvenanceProps> = ({ metaUri, registry, tokenId }) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [events, setEvents] = React.useState<any>({});
  const { user } = useSessionContext();

  React.useEffect(() => {
    const options = { fromBlock: 0 };

    registry.getPastEvents('RecordSale', options).then(function (events: any[]) {
        setEvents(events.filter(event => event.returnValues.tokenId === tokenId.toString())
        .map((event) => {
          return {
            tokenId: event.returnValues.tokenId,
            price: event.returnValues.price,
            newOwner: event.returnValues.to,
          };
        },
        ));
      }).catch(console.log);
  }, [user.address, events, registry, tokenId]);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Provenance
      </Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName={styles.modal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Provenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Timeline records={[]}/>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Provenance;
