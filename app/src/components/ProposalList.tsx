import * as React from 'react';
import List from '@material-ui/core/List';
import ProposalItem from './ProposalItem';
import { withStyles } from '@material-ui/core/styles';
import Styles from '../theme';

interface ProposalListProps {
  drizzle: any;
  drizzleState: any;
  classes: any;
}

type ProposalListState = {
  ids: any;
}

class ProposalList extends React.Component<ProposalListProps, ProposalListState> {
  componentDidMount () {
    this.props.drizzle.contracts.Governance.methods.getProposals().call()
      .then((ids: any) => this.setState({ ids: ids }))
      .catch((err: any) => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return (
        <span>Loading proposals...</span>
      );
    }

    const listItems = this.state.ids.map((id: any) =>
      <ProposalItem
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
        id={id}
        key={id}
      />
    );

    return (
      <List className={this.props.classes.root}>{listItems}</List>
    );
  }
}

export default withStyles(Styles)(ProposalList);
