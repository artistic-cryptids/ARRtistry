import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { ContractProps } from '../helper/eth';

interface ProposalItemProps extends ContractProps {
  id: number;
}

type ProposalItemState = {
  proposal: any;
}

class ProposalItem extends React.Component<ProposalItemProps, ProposalItemState> {
  rejectProposal = (_: React.MouseEvent): void => {
    console.log('Rejecting proposal ' + this.props.id);
    this.props.contracts.Governance.reject(this.props.id, {
      from: this.props.accounts[0],
    });
  }

  approveProposal = (_: React.MouseEvent): void => {
    console.log('Approving proposal ' + this.props.id);
    this.props.contracts.Governance.approve(this.props.id, {
      from: this.props.accounts[0],
    });
  }

  componentDidMount (): void {
    this.props.contracts.ArtifactApplication.getProposal(this.props.id)
      .then((proposalData: any): void => {
        const proposal = {
          metaUri: proposalData[2],
        };
        this.setState({ proposal: proposal });
      })
      .catch((err: any): void => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return null;
    }

    return (
      <ArtworkInfo
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        artwork={this.state.proposal}
        id={this.props.id}
      >
        <Row>
          <ButtonGroup aria-label="Actionbar" className="mx-auto">
            <Button variant="outline-success" onClick={this.approveProposal}>Approve</Button>
            <Button variant="outline-danger" onClick={this.rejectProposal}>Deny</Button>
          </ButtonGroup>
        </Row>
      </ArtworkInfo>
    );
  }
}

export default ProposalItem;
