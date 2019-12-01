import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEuroSign,
  faFingerprint,
  faMask,
  faSearch,
  faVideo,
  faFireAlt,
  faWrench,
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
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import PlaintextField from './common/PlaintextField';
import AddressField from './common/AddressField';

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

interface DetailRecord {
  date: string;
  detailInfo: string;
}

interface ProvenanceRecord {
  type: string;
  txDate: moment.Moment;

  artist?: string;
  sale?: SaleRecord;
  detail?: DetailRecord;
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
  'stolen': {
    header: 'Stolen',
    icon: faMask,
  },
  'recovered': {
    header: 'Recovered',
    icon: faSearch,
  },
  'damaged': {
    header: 'Damaged',
    icon: faFireAlt,
  },
  'restored': {
    header: 'Restored',
    icon: faWrench,
  },
  'film': {
    header: 'Film',
    icon: faVideo,
  },
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

const Timeline: React.FC = ({ children }) => {
  return (
    <Col md='12'>
      <ul className={styles.timeline}>
        {children}
      </ul>
    </Col>
  );
};

const ProvenanceTimeline: React.FC<{records: ProvenanceRecord[]}> = ({ records }) => {
  return (
    <Timeline>
      {records.map((record: ProvenanceRecord, index: number) =>
        <TimelineBlock type={record.type} subheader={record.txDate.fromNow()} key={index}>
          {record.type === 'sale' && record.sale &&
            <Form>
              <PlaintextField label='Date' value={record.sale.date} />
              <AddressField label='Buyer' address={record.sale.buyer}/>
              <AddressField label='Seller' address={record.sale.seller}/>
              <PlaintextField label='Sale Location' value={record.sale.location} />
              <PlaintextField label='Sale Price' value={'€' + (record.sale.price / 100).toString()} />
            </Form>}
          {record.type === 'mint' && record.artist &&
            <Form>
              <AddressField label='Artist' address={record.artist}/>
            </Form>}
          {record.type !== 'mint' && record.type !== 'sale' && record.detail &&
            <Form>
              <PlaintextField label='Date' value={record.detail.date} />
              <PlaintextField label='Detail' value={record.detail.detailInfo} />
            </Form>}
        </TimelineBlock>,
      )}
    </Timeline>
  );
};

export const Provenance: React.FC<{tokenId: number}> = ({ tokenId }) => {
  const [records, setRecords] = React.useState<ProvenanceRecord[]>([]);
  const { web3 } = useWeb3Context();
  const { ArtifactRegistry } = useContractContext();
  const { user } = useSessionContext();

  React.useEffect(() => {
    const options = { fromBlock: 0 };

    const registration = ArtifactRegistry.getPastEvents('Transfer', options)
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

    const otherRecordTypes = ['Sale', 'Stolen', 'Recovered', 'Damaged', 'Restored', 'Film'];
    const otherRecords: Promise<ProvenanceRecord[]> = Promise.all(otherRecordTypes
      .map(async (type: string): Promise<ProvenanceRecord[]> => {
        const pastEvents = await ArtifactRegistry.getPastEvents('Record' + type, options);
        const tokenRelevantEvents = pastEvents.filter((event: any) =>
          event.returnValues.tokenId === tokenId.toString());
        const resultRecords: ProvenanceRecord[] = [];
        for (const event of tokenRelevantEvents) {
          const timestamp = await web3.eth.getBlock(event.blockNumber).then((block) => block.timestamp);
          const typeLowerCase = type.toLowerCase();
          const timestampMoment = moment.unix(Number(timestamp));
          resultRecords.push(typeLowerCase === 'sale'
            ? {
              type: typeLowerCase,
              txDate: timestampMoment,
              sale: {
                seller: event.returnValues.from,
                price: event.returnValues.price,
                buyer: event.returnValues.to,
                location: event.returnValues.location,
                date: event.returnValues.date,
              },
            }
            : {
              type: typeLowerCase,
              txDate: timestampMoment,
              detail: {
                detailInfo: event.returnValues.detailInfo,
                date: event.returnValues.date,
              },
            });
        }
        return resultRecords;
      }))
      // list of lists flattened to one big list
      .then((listOfLists: any) => listOfLists.flat());

    const recordComparator = (a: ProvenanceRecord, b: ProvenanceRecord): number => {
      if (a.artist && b.artist) {
        return 0;
      }
      if (a.artist && !b.artist) {
        return -1;
      }
      if (!a.artist && b.artist) {
        return 1;
      }
      if (!a.artist && !b.artist) {
        let aDate: string | null = null;
        let bDate: string | null = null;
        if (a.detail) {
          aDate = a.detail.date;
        } else if (a.sale) {
          aDate = a.sale.date;
        }
        if (b.detail) {
          bDate = b.detail.date;
        } else if (b.sale) {
          bDate = b.sale.date;
        }
        if (!aDate && !bDate) {
          return 0;
        }
        if (aDate && !bDate) {
          return -1;
        }
        if (!aDate && bDate) {
          return 1;
        }
        if (aDate && bDate) {
          return aDate.localeCompare(bDate);
        }
      }
      return -1;
    };

    Promise.all([registration, otherRecords])
      .then(([regs, others]) => setRecords(regs.concat(others).sort(recordComparator)))
      .catch(console.warn);
  }, [user.address, web3.eth, ArtifactRegistry, tokenId]);

  return <ProvenanceTimeline records={records}/>;
};

export const ProvenanceModal: React.FC<{tokenId: number}> = (props) => {
  const [show, setShow] = React.useState(false);

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
          <Provenance {...props}/>
        </Modal.Body>
      </Modal>
    </>
  );
};
