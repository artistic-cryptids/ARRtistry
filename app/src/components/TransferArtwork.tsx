import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';

interface TransferArtworkProps {
  drizzle: any;
  drizzleState: any;
  id: any;
}

interface TransferArtworkFormFields {
  recipientAddress: string;
  price: string;
}

interface TransferArtworkState {
  fields: TransferArtworkFormFields;
  showTransferForm: boolean;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof TransferArtworkFormFields;
      value: TransferArtworkFormFields[keyof TransferArtworkFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

class TransferArtwork extends React.Component<TransferArtworkProps, TransferArtworkState> {
  constructor (props: TransferArtworkProps) {
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

    console.log("adsasd" + this.props.id);
    artifactRegistry.methods.tokenOfOwnerByIndex(
      currentAccount, this.props.id)
      .call()
      .then((tokenId: any) => {
        artifactRegistry.methods.safeTransferFrom.cacheSend(
          currentAccount,
          this.state.fields.recipientAddress,
          tokenId,
        );
      })
      .catch((err: any) => { console.log(err); });
  }

  inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
    const stateUpdate = {
      fields: this.state.fields as Pick<TransferArtworkFormFields, keyof TransferArtworkFormFields>,
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

export default TransferArtwork;
