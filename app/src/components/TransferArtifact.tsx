import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import ipfs from '../ipfs';
import TransactionLoadingModal from './common/TransactionLoadingModal';
import { ContractProps } from '../helper/eth';
import { Contract } from 'web3-eth-contract';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

interface TransferArtifactProps extends ContractProps {
  tokenId: number;
  metaUri: string;
}

interface TransferArtifactFormFields {
  recipientAddress: string;
  price: string;
  location: string;
  date: string;
}

interface TransferArtifactState {
  fields: TransferArtifactFormFields;
  showTransferForm: boolean;
  submitted: boolean;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof TransferArtifactFormFields;
      value: TransferArtifactFormFields[keyof TransferArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const LOCATIONS = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Slovak Republic',
  'Slovenia',
  'Spain',
  'Sweden',
  'United Kingdom',
];

class TransferArtifact extends React.Component<TransferArtifactProps, TransferArtifactState> {
  constructor (props: TransferArtifactProps) {
    super(props);
    this.state = {
      fields: {
        recipientAddress: '',
        price: '',
        location: LOCATIONS[0],
        date: '',
      },
      showTransferForm: false,
      submitted: false,
    };
  }

  saveMetaData = (jsonData: string): Promise<string> => {
    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    return ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => 'https://ipfs.io/ipfs/' + response[0].hash);
  }

  addProvenance = (price: string, buyers: string[], seller: string, location: string, date: string): Promise<string> => {
    return fetch(this.props.metaUri)
      .then((response: any) => response.json())
      .then((jsonData: any) => {
        jsonData.previousSalePrice = price;
        jsonData.saleProvenance.push({
          price: (parseFloat(price) * 100).toString(),
          location: location,
          buyers: buyers,
          seller: seller,
          date: date,
        });

        return this.saveMetaData(jsonData);
      });
  };

  transferArtwork = (_: React.FormEvent): void => {
    const artifactRegistry = this.props.contracts.ArtifactRegistry;
    let owner = '';
    this.setState({
      submitted: true,
    });

    artifactRegistry.ownerOf(this.props.tokenId)
      .then((address: string) => {
        owner = address;
        console.log(this.state.fields.location);
        return this.addProvenance(
          this.state.fields.price,
          [this.state.fields.recipientAddress],
          owner,
          this.state.fields.location,
          this.state.fields.date,
        );
      })
      .then((hash: string) => {
        artifactRegistry.transfer(
          owner,
          this.state.fields.recipientAddress,
          this.props.tokenId,
          hash,
          (parseFloat(this.state.fields.price) * 100).toString(),
          this.state.fields.location,
          this.state.fields.date,
          {
            from: this.props.accounts[0],
          },
        ).then(() => {
          this.setState({ submitted: false });
        }).catch((err: any) => {
          // rejection, usually
          console.log(err);
          this.setState({ submitted: false });
        });
      })
      .catch((err: any) => {
        console.log(err);
        this.setState({ submitted: false });
      });
  }

  inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
    const stateUpdate = {
      fields: this.state.fields as Pick<TransferArtifactFormFields, keyof TransferArtifactFormFields>,
    };
    stateUpdate.fields[key] = val;
    this.setState(stateUpdate);
  };

  handleShow = (): void => {
    this.setState({
      showTransferForm: true,
    });
  }

  handleCancel = (): void => {
    this.setState({
      fields: {
        recipientAddress: '',
        price: '',
        location: LOCATIONS[0],
        date: '',
      },
      showTransferForm: false,
    });
  }

  render (): React.ReactNode {
    const locationOptions = LOCATIONS.map((location, index) =>
      <option key={index}>{location}</option>,
    );
    const monthOptions = MONTHS.map((month, index) =>
      <option key={index} value={(index + 1).toString()}>{month}</option>,
    );
    return (
      <div>
        <Button variant="primary" onClick={this.handleShow}>
          Register Sale
        </Button>
        <Modal show={this.state.showTransferForm} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Register Sale of Artifact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Col} controlId="recipientAddress">
              <Form.Label>Recipient Address</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={this.inputChangeHandler}/>
              {GENERIC_FEEDBACK}
            </Form.Group>
            <Form.Group as={Col} controlId="price">
              <Form.Label>Price (Euros)</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={this.inputChangeHandler}/>
              {GENERIC_FEEDBACK}
            </Form.Group>
            <Form.Group as={Col} controlId="location">
              <Form.Label>Sale Location</Form.Label>
              <Form.Label className="mb-2 text-muted">If you do not see your sale location listed below it
                might be the case the artist is not eligible for ARR</Form.Label>
              <Form.Control
                required
                as="select"
                onChange={this.inputChangeHandler}>
                {locationOptions}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="date">
              <Form.Label>Date (YYYY-MM-DD)</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={this.inputChangeHandler}/>
              {GENERIC_FEEDBACK}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.transferArtwork}>
              Register Sale
            </Button>
          </Modal.Footer>
        </Modal>
        <TransactionLoadingModal
          onHide={() => this.setState({ submitted: false })}
          submitted={this.state.submitted}
          title="Registering sale..."
        />
      </div>
    );
  }
}

export default TransferArtifact;
