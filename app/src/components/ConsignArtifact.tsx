import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { ContractProps } from '../helper/eth';
import { addressFromName } from '../helper/ensResolver';

interface ConsignArtifactProps extends ContractProps {
  tokenId: number;
}

interface ConsignArtifactFormFields {
  recipientName: string;
}

interface ConsignArtifactState {
  fields: ConsignArtifactFormFields;
  consignedAccount: string;
  showConsignment: boolean;
}

type InputChangeEvent = React.FormEvent<any> &
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
        recipientName: '',
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

  consignArtifactForArtwork = async (_: React.FormEvent): Promise<void> => {
    const recipientAddress = await addressFromName({}, this.state.fields.recipientName);
    this.consign(recipientAddress);
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
        gasLimit: 6000000,
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
        recipientName: '',
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
            <Form.Group as={Col} controlId="recipientName">
              <Form.Label>Recipient Name</Form.Label>
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
