import * as React from 'react';
import List from '@material-ui/core/List';
import ArtworkItem from './ArtworkItem';
import { withStyles } from '@material-ui/core/styles';
import Styles from '../theme';

interface ArtworkListProps {
  drizzle: any;
  drizzleState: any;
  classes: any;
}

type ArtworkListState = {
  balance: any;
}

class ArtworkList extends React.Component<ArtworkListProps, ArtworkListState> {
  componentDidMount () {
    this.props.drizzle.contracts.ArtifactRegistry.methods.balanceOf(this.props.drizzleState.accounts[0]).call()
      .then((balance: any) => this.setState({ balance: balance }))
      .catch((err: any) => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return (
        <span>Loading artworks...</span>
      );
    }

    if (!this.state.balance) {
      return (
        <span>No artworks to show, please register one below</span>
      );
    }

    const indices = [];

    let index = 0;

    while (index < this.state.balance) {
      indices.push(index);
      index++;
    }

    const listItems = indices.map((id: any) =>
      <ArtworkItem
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

export default withStyles(Styles)(ArtworkList);
