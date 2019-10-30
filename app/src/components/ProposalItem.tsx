import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

interface ProposalItemProps {
  drizzle: any;
  drizzleState: any;
  id: number;
}

type ProposalItemState = {
  proposal: any;
}

class ProposalItem extends React.Component<ProposalItemProps, ProposalItemState> {
  rejectProposal = (_: React.MouseEvent): void => {
    console.log('Rejecting proposal ' + this.props.id);
    this.props.drizzle.contracts.Governance.methods.reject(this.props.id).send({
      from: this.props.drizzleState.accounts[0],
    });
  }

  approveProposal = (_: React.MouseEvent): void => {
    console.log('Approving proposal ' + this.props.id);
    this.props.drizzle.contracts.Governance.methods.approve(this.props.id)
      .send({
        from: this.props.drizzleState.accounts[0],
      });
  }

  componentDidMount (): void {
    this.props.drizzle.contracts.ArtifactApplication.methods.getProposal(this.props.id)
      .call()
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
        artwork={this.state.proposal}
        id={this.props.id}>
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
