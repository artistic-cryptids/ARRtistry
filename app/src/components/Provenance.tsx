import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEuroSign,
} from '@fortawesome/free-solid-svg-icons';

import * as styles from './Timeline.module.scss';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ContractProps, ContractListType } from '../helper/eth';
import ENSName from './common/ENSName';

interface ProvenanceProps extends ContractProps {
  metaUri: string;
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

const PlaintextField: React.FC<{label: string; value: string}> = ({ label, value }) => {
  return <Form.Group as={Form.Row}>
    <Form.Label column sm="2">
      {label}
    </Form.Label>
    <Col sm="10">
      <Form.Control plaintext readOnly defaultValue={value} />
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

const TimelineBlock: React.FC<{accounts: Array<string>; contracts: ContractListType; record: SaleRecord}> =
({ accounts, contracts, record }) => {
  const buyerListItems = record.buyers.map((buyerAddress: string) =>
    <div key={buyerAddress}>
      <AddressInfo label='Buyer' accounts={accounts} address={buyerAddress} contracts={contracts}/>
    </div>,
  );

  return (
    <li className={styles.timelineBlock}>
      <a href="#!">
        <span className={styles.timelineIcon}><FontAwesomeIcon icon={faEuroSign} size='1x'/></span>
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
              {buyerListItems}
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

const Timeline: React.FC<{accounts: Array<string>; contracts: ContractListType; records: SaleRecord[]}> =
({ accounts, contracts, records }) => {
  return (
    <Col md='12'>
      <ul className={styles.timeline}>
        {records.map((saleRecord: SaleRecord, index: number) =>
          <TimelineBlock accounts={accounts} contracts={contracts} record={saleRecord} key={index}/>)}
      </ul>
    </Col>
  );
};

class Provenance extends React.Component<ProvenanceProps, ProvenanceState> {
  constructor (props: ProvenanceProps) {
    super(props);
    this.state = {
      showProvenance: false,
      saleProvenance: [],
    };
  }

  componentDidMount (): void {
    fetch(this.props.metaUri)
      .then((response) => {
        return response.json();
      })
      .then((artworkInfo: ArtworkInfo) => {
        this.setState({
          saleProvenance: artworkInfo.saleProvenance,
        });
      })
      .catch((err: any) => { console.log(err); });
  }

  handleShow = (): void => {
    this.setState({
      showProvenance: true,
    });
  }

  handleClose = (): void => {
    this.setState({
      showProvenance: false,
    });
  }

  render (): React.ReactNode {
    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Provenance
        </Button>
        <Modal
          show={this.state.showProvenance}
          onHide={this.handleClose}
          dialogClassName={styles.modal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Provenance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Timeline accounts={this.props.accounts}
              contracts={this.props.contracts}
              records={this.state.saleProvenance}/>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Provenance;
