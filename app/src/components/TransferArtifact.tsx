import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import ipfs from '../ipfs';

interface TransferArtifactProps {
  drizzle: any;
  drizzleState: any;
  tokenId: number;
  metaUri: string;
}

interface TransferArtifactFormFields {
  recipientAddress: string;
  price: string;
}

interface TransferArtifactState {
  fields: TransferArtifactFormFields;
  showTransferForm: boolean;
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
      },
      showTransferForm: false,
    };
  }

  saveMetaData = (jsonData: string): void => {
    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => {
        ipfsId = response[0].hash;
        return ipfsId;
      })
      .then((hash: string) => this.props.drizzle.contracts.ArtifactRegistry.methods.setUri(this.props.tokenId, hash));
      .catch((err: any) => {
        console.log(err);
      });
  }

  addProvenance = (price: string, buyers: string[], seller: string, location: string): void => {
    fetch(this.props.metaUri)
      .then((response: any) => response.json())
      .then((jsonData: any) => {
        jsonData.previousSalePrice = price;
        jsonData.saleProvenance.push({
          price: price;
          location: location;
          buyers: buyers;
          seller: seller;
        })

        return saveMetaData;
        .catch((err: any) => console.log(err));
      });
  };

  transferArtwork = (_: React.FormEvent): void => {
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;
    const currentAccount = this.props.drizzleState.accounts[0];

    artifactRegistry.methods.safeTransferFrom.cacheSend(
      currentAccount,
      this.state.fields.recipientAddress,
      this.props.tokenId,
    );

    // I'm not sure using currentAccount as seller is correct in this instance in the case of someone selling
    // on someone elses behalf
    addProvenance(this.state.fields.price, [this.state.fields.recipientAddress], currentAccount, "London");
  };

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
      },
      showTransferForm: false,
    });
  }

  render (): React.ReactNode {
    return (
      <div>
        <Button variant="primary" onClick={this.handleShow}>
          Transfer
        </Button>
        <Modal show={this.state.showTransferForm} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Transfer Artifact</Modal.Title>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.transferArtwork}>
              Transfer
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

export default TransferArtifact;
