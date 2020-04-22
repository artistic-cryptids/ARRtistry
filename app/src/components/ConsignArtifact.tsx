import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useNameServiceContext } from '../providers/NameServiceProvider';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import ENSName from './common/ENSName';

interface ConsignArtifactProps {
  tokenId: number;
}

interface ConsignArtifactFormFields {
  recipientName: string;
  commission: string;
}

interface ConsignmentInfo {
  account: string;
  commission: string;
}

type InputChangeEvent = React.FormEvent<any> &
  {
    target: {
      id: keyof ConsignArtifactFormFields;
      value: ConsignArtifactFormFields[keyof ConsignArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

const ConsignArtifact: React.FC<ConsignArtifactProps> = ({ tokenId }) => {
  const [fields, setFields] = React.useState<ConsignArtifactFormFields>({
    recipientName: '',
    commission: '',
  });
  const [consigned, setConsigned] = React.useState<ConsignmentInfo[]>([]);
  const [indirectConsigned, setIndirectConsigned] = React.useState<string[]>([]);
  const [showConsignment, setShowConsignment] = React.useState<boolean>(false);

  const { addressFromName } = useNameServiceContext();
  const { Consignment, ArtifactRegistry } = useContractContext();
  const { accounts } = useWeb3Context();

  React.useEffect(() => {
    const getIndirectAccounts = async (account: string): Promise<string[]> => {
      console.log('getting indirect for ' + account);
      const addresses = await Consignment.methods.getConsignmentAddresses(tokenId, account)
        .call({
          from: accounts[0],
        });

      let indirect = addresses;

      for (const address of addresses) {
        indirect = indirect.concat(await getIndirectAccounts(address));
      }

      return indirect;
    };

    const setConsignedInfo = async (): Promise<void> => {
      const consignedAccounts = await Consignment.methods.getConsignmentAddresses(tokenId, accounts[0])
        .call({
          from: accounts[0],
        });

      const info = [];
      let indirect: string[] = [];

      for (const consignedAccount of consignedAccounts) {
        const commission = await Consignment.methods.getConsignmentInfo(tokenId, accounts[0], consignedAccount)
          .call({
            from: accounts[0],
          });

        indirect = indirect.concat(await getIndirectAccounts(consignedAccount));

        info.push({
          account: consignedAccount,
          commission: commission,
        });
      }

      setConsigned(info);
      setIndirectConsigned(indirect);
    };

    setConsignedInfo();
  }, [Consignment, accounts, tokenId]);

  const consign = async (address: string, commission: string): Promise<void> => {
    const approved = await ArtifactRegistry.methods.getApproved(tokenId)
      .call({
        from: accounts[0],
      });

    // If the consignment contract is not approved we need to approve
    // the contract and call the appropriate consignment functions.
    if (approved === Consignment._address) {
      await Consignment.methods.consign(
        tokenId,
        address,
        commission,
      ).send(
        {
          from: accounts[0],
          gasLimit: 6000000,
        },
      );
    } else {
      await ArtifactRegistry.methods.initConsign(
        tokenId,
        address,
        commission,
      ).send(
        {
          from: accounts[0],
          gasLimit: 6000000,
        },
      );
    }
  };

  const consignArtifactForArtwork = async (): Promise<void> => {
    const recipientAddress = await addressFromName(fields.recipientName);
    await consign(recipientAddress, fields.commission);
  };

  const revokeConsignment = async (address: string): Promise<void> => {
    await Consignment.methods.revoke(tokenId, address)
      .send(
        {
          from: accounts[0],
          gasLimit: 6000000,
        },
      );
  };

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
  };

  const handleCancel = (): void => {
    setShowConsignment(false);
    setFields({
      recipientName: '',
      commission: '',
    });
  };

  const directInfo = consigned.map((info) => {
    return <>
      <Row key={info.account}>
        <ENSName address={info.account}/>
        <p>: Commission: {info.commission}%</p>
      </Row>
      <Row>
        <Button variant="danger" size="sm" onClick={() => revokeConsignment(info.account)}>
          Revoke
        </Button>
      </Row>
      <hr/>
    </>;
  });

  const indirectInfo = indirectConsigned.map((account) => {
    return <Row key={account}>
      <ENSName address={account}/>
      <br/>
    </Row>;
  });

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
          {consigned.length !== 0 &&
            <React.Fragment>
              <p>Directly Consigned to:</p>
              <Col>
                {directInfo}
              </Col>
              <hr/>
            </React.Fragment>}
          {indirectConsigned.length !== 0 &&
            <React.Fragment>
              <p>Indirectly Consigned to:</p>
              <Col>
                {indirectInfo}
              </Col>
              <hr/>
            </React.Fragment>}
          <p>Consign Account to Sell</p>
          <Form.Group as={Col} controlId="recipientName">
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example.arrtistry.test"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
          <Form.Group as={Col} controlId="commission">
            <Form.Label>Commission (%)</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="30"
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConsignArtifact;
