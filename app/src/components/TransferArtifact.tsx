import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import ipfs from '../ipfs';
import TransactionLoadingModal from './common/TransactionLoadingModal';

interface TransferArtifactProps {
  drizzle: any;
  drizzleState: any;
  tokenId: number;
  metaUri: string;
}

interface TransferArtifactFormFields {
  recipientAddress: string;
  price: string;
  location: string;
}

interface TransferArtifactState {
  fields: TransferArtifactFormFields;
  showTransferForm: boolean;
  registerSaleSubmitted: boolean;
  registerSaleTransactionStackId: any;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof TransferArtifactFormFields;
      value: TransferArtifactFormFields[keyof TransferArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

class TransferArtifact extends React.Component<TransferArtifactProps, TransferArtifactState> {
  constructor (props: TransferArtifactProps) {
    super(props);
    this.state = {
      fields: {
        recipientAddress: '',
        price: '',
        location: '',
      },
      showTransferForm: false,
      registerSaleSubmitted: false,
      registerSaleTransactionStackId: null,
    };
  }

  saveMetaData = (jsonData: string): Promise<string> => {
    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    return ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => 'https://ipfs.io/ipfs/' + response[0].hash);
  }

  addProvenance = (price: string, buyers: string[], seller: string, location: string): Promise<string> => {
    return fetch(this.props.metaUri)
      .then((response: any) => response.json())
      .then((jsonData: any) => {
        jsonData.previousSalePrice = price;
        jsonData.saleProvenance.push({
          price: price,
          location: location,
          buyers: buyers,
          seller: seller,
        });

        return this.saveMetaData(jsonData);
      });
  };

  transferArtwork = (_: React.FormEvent): void => {
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;
    let owner = '';
    this.setState({
      registerSaleSubmitted: true,
    });

    artifactRegistry.methods.ownerOf(this.props.tokenId).call()
      .then((address: string) => {
        owner = address;
        console.log(this.state.fields.location);
        return this.addProvenance(
          this.state.fields.price,
          [this.state.fields.recipientAddress],
          owner,
          this.state.fields.location,
        );
      })
      .then((hash: string) => {
        const stackId = artifactRegistry.methods.transfer.cacheSend(
          owner,
          this.state.fields.recipientAddress,
          this.props.tokenId,
          hash,
          this.state.fields.price,
          this.state.fields.location,
        );

        this.setState({
          registerSaleTransactionStackId: stackId,
        });
      })
      .catch((err: any) => console.log(err));
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
        location: '',
      },
      showTransferForm: false,
    });
  }

  render (): React.ReactNode {
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
                // TODO: Replace with accurate list of applicable sale locations
                <option>United Kingdom</option>
                <option>France</option>
                <option>Germany</option>
              </Form.Control>
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
          drizzleState={this.props.drizzleState}
          onHide={() => this.setState({ registerSaleSubmitted: false })}
          submitted={this.state.registerSaleSubmitted}
          transactionStackId={this.state.registerSaleTransactionStackId}
          title="Registering sale..."
        />
      </div>
    );
  }
}

export default TransferArtifact;
