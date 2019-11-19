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
import { ArtifactRegistry, ContractProps, ContractListType } from '../helper/eth';
import { useSessionContext } from '../providers/SessionProvider';
import ENSName from './common/ENSName';


interface ProvenanceProps extends ContractProps {
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
  buyer: string;
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

const AddressInfo: React.FC<{accounts: Array<string>; contracts: ContractListType; address: string; label: string}> =
({ accounts, address, contracts, label }) => {
  return <Form.Group as={Form.Row}>
    <Form.Label column sm="2">
      {label}
    </Form.Label>
    <Col sm="10">
      <ENSName accounts={accounts} contracts={contracts} address={address}/>
    </Col>
  </Form.Group>;
};


const TimelineBlock: React.FC<{type: string; accounts: Array<string>; contracts: ContractListType; record: SaleRecord}>
= ({ type, children, accounts, contracts, record }) => {
  const { header, icon } = BLOCK_HEADINGS[type];
  return (
    <li className={styles.timelineBlock}>
      <a href="#!">
        <span className={styles.timelineIcon}><FontAwesomeIcon icon={icon} size='1x'/></span>
      </a>
      <div className={styles.timelineContent}>
        <Row>
          <Col sm='8'>
            <h4 className="font-weight-bold">Sale</h4>
          </Col>
          <Col sm='4'>
            <p className={'text-muted ' + styles.date}>
              {record.date}
            </p>
          </Col>
        </Row>
        <Row>
          <Col sm='12'>
            <Form>
              <AddressInfo label='Buyer' accounts={accounts} address={record.buyer} contracts={contracts}/>
              <AddressInfo label='Seller' accounts={accounts} address={record.seller} contracts={contracts}/>
              <PlaintextField label='Sale Location' value={record.location} />
              <PlaintextField label='Sale Price' value={'€' + (record.price / 100).toString()} />
            </Form>
          </Col>
        </Row>
      </div>
    </li>
  );
};

const Timeline: React.FC<{records: SaleRecord[], contracts: ContractListType, accounts: string[]}> = ({ records, contracts, accounts }) => {
  return (
    <Col md='12'>
      <ul className={styles.timeline}>
        {records.map((record: SaleRecord, index: number) =>
          <TimelineBlock type={'sale'} accounts={accounts} contracts={contracts} record={record} key={index}>
        </TimelineBlock>)}
      </ul>
    </Col>
  );
};

const Provenance: React.FC<ProvenanceProps> = ({ metaUri, registry, tokenId, contracts, accounts }) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [events, setEvents] = React.useState<any>({});
  const { user } = useSessionContext();

  React.useEffect(() => {
    const options = { fromBlock: 0 };

    registry.getPastEvents('RecordSale', options).then(function (events: any[]) {
        setEvents(events.filter(event => event.returnValues.tokenId === tokenId.toString())
        .map((event) => {
          return {
            seller: event.returnValues.from,
            price: event.returnValues.price,
            buyer: event.returnValues.to,
            location: event.returnValues.location,
            date: event.returnValues.date,
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
          <Timeline records={events}  contracts={contracts} accounts={accounts} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Provenance;
