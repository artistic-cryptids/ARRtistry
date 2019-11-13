import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';
import { ContractProps } from '../helper/eth';

interface ConsignArtifactProps extends ContractProps {
  tokenId: number;
}

interface ConsignArtifactFormFields {
  recipientAddress: string;
}

interface ConsignArtifactState {
  fields: ConsignArtifactFormFields;
  consignedAccount: string;
  showConsignment: boolean;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof ConsignArtifactFormFields;
      value: ConsignArtifactFormFields[keyof ConsignArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;
const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

class ConsignArtifact extends React.Component<ConsignArtifactProps, ConsignArtifactState> {
  constructor (props: ConsignArtifactProps) {
    super(props);
    this.state = {
      fields: {
        recipientAddress: '',
      },
      consignedAccount: '',
      showConsignment: false,
    };
  }

  componentDidMount (): void {
    const artifactRegistry = this.props.contracts.ArtifactRegistry;

    artifactRegistry.getApproved(this.props.tokenId, { from: this.props.accounts[0] })
      .then((account: string) => {
        if (account === ZERO_ADDR) {
          return;
        }

        this.setState({
          consignedAccount: account,
        });
      })
      .catch((err: any) => console.log(err)); ;
  }

  consignArtifactForArtwork = (_: React.FormEvent): void => {
    this.consign(this.state.fields.recipientAddress);
  }

  revokeConsignment = (_: React.FormEvent): void => {
    this.consign(ZERO_ADDR);
  }

  consign = (address: string): void => {
    const artifactRegistry = this.props.contracts.ArtifactRegistry;

    artifactRegistry.approve(
      address,
      this.props.tokenId,
      {
        from: this.props.accounts[0],
      },
    );
  }

  inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
    const stateUpdate = {
      fields: this.state.fields as Pick<ConsignArtifactFormFields, keyof ConsignArtifactFormFields>,
    };
    stateUpdate.fields[key] = val;
    this.setState(stateUpdate);
  };

  handleShow = (): void => {
    this.setState({
      showConsignment: true,
    });
  }

  handleCancel = (): void => {
    this.setState({
      fields: {
        recipientAddress: '',
      },
      showConsignment: false,
    });
  }

  render (): React.ReactNode {
    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Consignment
        </Button>
        <Modal show={this.state.showConsignment} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Consignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.consignedAccount !== ''
              ? <React.Fragment><p>Consigned to {this.state.consignedAccount} <br/>
              You may still register a sale yourself, but doing so will revoke consignment.
              </p><hr/></React.Fragment>
              : null}
            <p>Consign Account to Sell</p>
            <Form.Group as={Col} controlId="recipientAddress">
              <Form.Label>Recipient Address</Form.Label>
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
            <Button variant="primary" onClick={this.consignArtifactForArtwork}>
              Consign for Sale
            </Button>
            {this.state.consignedAccount !== ''
              ? <Button variant="primary" onClick={this.revokeConsignment}>Revoke Consignment</Button>
              : null}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default ConsignArtifact;
