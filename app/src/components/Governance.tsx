import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ProposalList from "./ProposalList";
import Typography from '@material-ui/core/Typography';

interface GovernanceProps {
  drizzle: any;
  drizzleState: any;
}

type GovernanceState = {
  isGovernorKey: ""
}

class Governance extends React.Component<GovernanceProps, GovernanceState> {
  constructor(props: GovernanceProps) {
    super(props);

    this.setState({isGovernorKey: this.props.drizzle.contracts.Governance.methods.isGovernor.cacheCall(this.props.drizzleState.account)});
  }

  componentDidMount () {}

  render () : React.ReactNode {
    if (!(this.state.isGovernorKey in this.props.drizzleState.contracts.Governance.isGovernor)) {
      return (
        <span>Loading...</span>
      )
    }

    if (this.props.drizzleState.contracts.Governance.isGovernor[this.state.isGovernorKey].value) {
      return (
        <Grid container alignItems="center" spacing={5} direction="column">
          <Grid item><Typography>You are an approved moderator.</Typography></Grid>
          <Grid item><ProposalList drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/></Grid>
        </Grid>
       );
    }

    return (
      <span>You are not an approved moderator</span>
    )
  }
}

export default Governance;
