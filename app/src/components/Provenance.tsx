import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEuroSign,
  faFingerprint,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Dictionary } from 'lodash';
import * as moment from 'moment';
import { EventData } from 'web3-eth-contract';

import * as styles from './Timeline.module.scss';
import * as Contracts from '../helper/contracts';
import { useSessionContext } from '../providers/SessionProvider';
import ENSName from './common/ENSName';
import { useWeb3Context } from '../providers/Web3Provider';
import PlaintextField from './common/PlaintextField'

interface ProvenanceProps {
  registry: Contracts.ArtifactRegistry;
  tokenId: number;
}

interface SaleRecord {
  price: number;
  location: string;
  buyer: string;
  seller: string;
  date: string;
}

interface ProvenanceRecord {
  type: string;
  txDate: moment.Moment;

  artist?: string;
  sale?: SaleRecord;
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
      <ENSName className='form-control-plaintext' address={address}/>
    </Col>
  </Form.Group>;
};

const TimelineBlock: React.FC<{type: string; subheader: string}> =
({ type, children, subheader }) => {
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
              {subheader}
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

const Timeline: React.FC<{ records: ProvenanceRecord[] }> = ({ records }) => {
  return (
    <Col md='12'>
      <ul className={styles.timeline}>
        {records.map((record: ProvenanceRecord, index: number) =>
          <TimelineBlock type={record.type} subheader={record.txDate.fromNow()} key={index}>
            {record.type === 'sale' && record.sale
              ? <Form>
                <PlaintextField label='Date' value={record.sale.date} />
                <AddressInfo label='Buyer' address={record.sale.buyer}/>
                <AddressInfo label='Seller' address={record.sale.seller}/>
                <PlaintextField label='Sale Location' value={record.sale.location} />
                <PlaintextField label='Sale Price' value={'€' + (record.sale.price / 100).toString()} />
              </Form>
              : null}
            {record.type === 'mint' && record.artist
              ? <Form>
                <AddressInfo label='Artist' address={record.artist}/>
              </Form>
              : null}

          </TimelineBlock>,
        )}
      </ul>
    </Col>
  );
};

const Provenance: React.FC<ProvenanceProps> = ({ registry, tokenId }) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [events, setEvents] = React.useState<any>({});
  const { web3 } = useWeb3Context();
  const { user } = useSessionContext();

  React.useEffect(() => {
    const options = { fromBlock: 0 };

    const registration = registry.getPastEvents('Transfer', options)
      .then((events: EventData[]) => events.filter(e => e.returnValues.tokenId === tokenId.toString())
        .filter(e => e.returnValues.from === '0x0000000000000000000000000000000000000000'),
      )
      .then((events: EventData[]) => events.map(async (event) => {
        const timestamp = await web3.eth.getBlock(event.blockNumber).then((block) => block.timestamp);
        return {
          type: 'mint',
          txDate: moment.unix(Number(timestamp)),
          artist: event.returnValues.to,
        };
      }),
      )
      .then((records: ProvenanceRecord[]) => Promise.all(records));

    const sales = registry.getPastEvents('RecordSale', options).then(async function (events: EventData[]) {
      const tokenRelevantEvents = events.filter(event => event.returnValues.tokenId === tokenId.toString());
      return Promise.all(tokenRelevantEvents.map(async (event) => {
        const timestamp = await web3.eth.getBlock(event.blockNumber).then((block) => block.timestamp);
        return {
          type: 'sale',
          txDate: moment.unix(Number(timestamp)),
          sale: {
            seller: event.returnValues.from,
            price: event.returnValues.price,
            buyer: event.returnValues.to,
            location: event.returnValues.location,
            date: event.returnValues.date,
          },
        };
      },
      ));
    });

    Promise.all([registration, sales])
      .then(([regs, sales]) => setEvents(regs.concat(sales)))
      .catch(console.warn);
  }, [user.address, web3.eth, registry, tokenId]);

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
          <Timeline records={events} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Provenance;
