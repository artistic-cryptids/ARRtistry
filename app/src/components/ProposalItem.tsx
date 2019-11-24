import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

interface ProposalItemProps {
  id: number;
}

const ProposalItem: React.FC<ProposalItemProps> = ({ id }) => {
  const [proposal, setProposal] = React.useState<any>();

  const { Governance, ArtifactApplication } = useContractContext();
  const { accounts } = useWeb3Context();

  const rejectProposal = (_: React.MouseEvent): void => {
    console.log('Rejecting proposal ' + id);
    Governance.methods.reject(id).send({
      from: accounts[0],
      gasLimit: 6000000,
    });
  };

  const approveProposal = (_: React.MouseEvent): void => {
    console.log('Approving proposal ' + id);
    Governance.methods.approve(id).send({
      from: accounts[0],
      gasLimit: 6000000,
    });
  };

  React.useEffect(() => {
    ArtifactApplication.methods.getProposal(id)
      .call()
      .then((proposalData: any): void => {
        const proposal = {
          metaUri: proposalData[2],
        };
        setProposal(proposal);
      })
      .catch(console.log);
  }, [ArtifactApplication, id]);

  if (!proposal) {
    return null;
  }

  return (
    <ArtworkInfo
      artwork={proposal}
      id={id}
    >
      <Row>
        <ButtonGroup aria-label="Actionbar" className="mx-auto">
          <Button variant="outline-success" onClick={approveProposal}>Approve</Button>
          <Button variant="outline-danger" onClick={rejectProposal}>Deny</Button>
        </ButtonGroup>
      </Row>
    </ArtworkInfo>
  );
};

export default ProposalItem;
