import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Styles from '../theme';
import ArtworkInfo from './ArtworkInfo';

interface ProposalItemProps {
  drizzle: any;
  drizzleState: any;
  id: number;
  classes: any;
}

type ProposalItemState = {
  proposal: any;
}

class ProposalItem extends React.Component<ProposalItemProps, ProposalItemState> {
  rejectProposal = (): void => {
    console.log('Rejecting proposal ' + this.props.id);
    this.props.drizzle.contracts.Governance.methods.reject(this.props.id).send({
      from: this.props.drizzleState.accounts[0],
    });
  }

  approveProposal = (): void => {
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
          title: proposalData[2],
          artistName: proposalData[3],
          artistNationality: proposalData[4],
          artistBirthYear: proposalData[5],
          createdDate: proposalData[6],
          medium: proposalData[7],
          size: proposalData[8],
          metaUri: proposalData[9],
        };
        this.setState({ proposal: proposal });
      })
      .catch((err: any): void => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return 'Loading...';
    }

    return (
      <ListItem alignItems="flex-start" key={this.props.id}>
        <Grid container direction="row">
          <ArtworkInfo artwork={this.state.proposal} id={this.props.id}/>
          <Button
            variant="contained"
            color="primary"
            className={this.props.classes.approve}
            onClick={(_): void => { this.approveProposal(); }}>
            Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={this.props.classes.reject}
            onClick={(_): void => { this.rejectProposal(); }}>
            Reject
          </Button>
        </Grid>
      </ListItem>
    );
  }
}

export default withStyles(Styles)(ProposalItem);
