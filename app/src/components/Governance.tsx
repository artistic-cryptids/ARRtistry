import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ProposalList from './ProposalList';
import Typography from '@material-ui/core/Typography';

interface GovernanceProps {
  drizzle: any;
  drizzleState: any;
}

type GovernanceState = {
  isGovernor: false;
}

class Governance extends React.Component<GovernanceProps, GovernanceState> {
  componentDidMount (): void {
    this.props.drizzle.contracts.Governance.methods.isGovernor(this.props.drizzleState.accounts[0]).call()
      .then((isGovernor: any) => this.setState({ isGovernor: isGovernor }))
      .catch((err: any) => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state || this.state.isGovernor) {
      return (
        <Grid container alignItems="center" spacing={5} direction="column">
          <Grid item><Typography>You are an approved moderator.</Typography></Grid>
          <Grid item><ProposalList drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/></Grid>
        </Grid>
      );
    }

    return (
      <span>You are not an approved moderator</span>
    );
  }
}

export default Governance;
