import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { ContractProps } from '../helper/eth';
import { useNameServiceContext } from '../providers/NameServiceProvider';
import ENSName from './common/ENSName';


interface ConsignArtifactProps extends ContractProps {
  tokenId: number;
}

interface ConsignArtifactFormFields {
  recipientName: string;
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

const ConsignArtifact: React.FC<ConsignArtifactProps> = ({ tokenId, contracts, accounts }) => {
  const [fields, setFields] = React.useState<ConsignArtifactFormFields>({
    recipientName: '',
  });
  const [consignedAccount, setConsignedAccount] = React.useState<string>('');
  const [showConsignment, setShowConsignment] = React.useState<boolean>(false);

  const { nameFromAddress, addressFromName } = useNameServiceContext();

  React.useEffect(() => {
    const artifactRegistry = contracts.ArtifactRegistry;

    artifactRegistry.getApproved(tokenId, { from: accounts[0] })
      .then((account: string) => setConsignedAccount(account))
      .catch(console.log);
  }, [accounts, contracts, tokenId]);

  const consignArtifactForArtwork = async (): Promise<void> => {
    const recipientAddress = await addressFromName(fields.recipientName);
    consign(recipientAddress);
  }

  const revokeConsignment = (_: React.FormEvent): void => {
    consign(ZERO_ADDR);
  }

  const consign = (address: string): void => {
    const artifactRegistry = contracts.ArtifactRegistry;

    artifactRegistry.approve(
      address,
      tokenId,
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    );
  }

  const inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
    const stateUpdate = {
      fields: fields as Pick<ConsignArtifactFormFields, keyof ConsignArtifactFormFields>,
    };
    stateUpdate.fields[key] = val;
    setFields(stateUpdate.fields);
  };

  const handleShow = (): void => {
    setShowConsignment(true);
  }

  const handleCancel = (): void => {
    setShowConsignment(false);
    setFields({
      recipientName: '',
    })
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Consignment
      </Button>
      <Modal show={showConsignment} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Consignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {consignedAccount !== ZERO_ADDR
            ? <React.Fragment><p>Consigned to <ENSName address={consignedAccount} contracts={contracts} accounts={accounts}/> <br/>
            You may still register a sale yourself, but doing so will revoke consignment.
            </p><hr/></React.Fragment>
            : null}
          <p>Consign Account to Sell</p>
          <Form.Group as={Col} controlId="recipientName">
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => consignArtifactForArtwork()}>
            Consign for Sale
          </Button>
          {consignedAccount !== ZERO_ADDR
            ? <Button variant="primary" onClick={revokeConsignment}>Revoke Consignment</Button>
            : null}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConsignArtifact;
