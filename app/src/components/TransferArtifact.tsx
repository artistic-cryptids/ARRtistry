import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';

interface TransferArtifactProps {
  drizzle: any;
  drizzleState: any;
  tokenId: number;
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

  transferArtwork = (_: React.FormEvent): void => {
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;
    const currentAccount = this.props.drizzleState.accounts[0];

    artifactRegistry.methods.safeTransferFrom.cacheSend(
      currentAccount,
      this.state.fields.recipientAddress,
      this.props.tokenId,
    );
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
