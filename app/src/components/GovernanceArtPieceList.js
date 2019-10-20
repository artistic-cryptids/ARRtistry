import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class GovernanceArtPieceList extends Component {
  constructor (props, context) {
    super(props);

    this.contracts = this.props.drizzle.contracts;
    this.isGovernorKey = this.props.drizzle.contracts.Governance.methods.isGovernor.cacheCall(this.props.drizzleState.accounts[0]);

    this.state = {
      artpieces: []
    }
  }

  GovernanceArtPieceListItems = () => {
    const classes = makeStyles(theme => ({
      root: {
        width: '100%',
        maxWidth: 700,
        minWidth: 600,
        backgroundColor: theme.palette.background.paper,
      },
      inline: {
        display: 'inline',
      },
      approve: {
        margin: theme.spacing(2, 1, 2, 0),
      },
      reject: {
        margin: theme.spacing(2, 0, 2, 0),
      },
    }));

    const artpieces = this.state.artpieces;

    const listItems = artpieces.map((artpiece) => this.returnListItem(artpiece, classes));
    return (
      <List className={classes.root}>{listItems}</List>
    );
  }

  rejectProposal = (code) => {
    console.log("Rejecting proposal " + code);
    this.props.drizzle.contracts.Governance.methods.reject(code).send({from: this.props.drizzleState.accounts[0]});
  }

  approveProposal = (code) => {
    console.log("Approving proposal " + code);
    this.props.drizzle.contracts.Governance.methods.approve(code).send({from: this.props.drizzleState.accounts[0]});
  }

  returnListItem = (artpiece, classes) => {
    return <ListItem alignItems="flex-start" key={artpiece.id}>
      <Grid container direction="row">
        <ListItemAvatar>
          {/* TODO: replace with thumbnail image?? */}
          <Avatar alt={artpiece.title}>{artpiece.edition}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={artpiece.title}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {artpiece.artist_name}<br/>
              </Typography>
              {artpiece.created}. {artpiece.medium}
            </React.Fragment>
          }
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.approve}
          onClick={(e) => this.approveProposal(artpiece.id)}>
          Approve
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.reject}
          onClick={(e) => this.rejectProposal(artpiece.id)}>
          Reject
        </Button>
      </Grid>
    </ListItem >;
  };

  componentDidMount () {
    const proposals = [];
    this.props.drizzle.contracts.Governance.methods.getProposals().call()
      .then((proposalIds) => {
        for (let proposalId in proposalIds) {
          const proposal = this.props.drizzle.contracts.ArtifactApplication.methods.getProposal(proposalId).call()
            .then((proposalData) => {
              const proposal = {
                id: proposalId,
                title: proposalData[2],
                medium: proposalData[3],
                edition: proposalData[4],
                created: proposalData[5],
                metaUri: proposalData[6]
              };
              return proposal;
            });
          proposals.push(proposal);
        }

        return Promise.all(proposals);
      })
      .then((proposals) => this.setState({artpieces: proposals}));
  }

  render () {
    if (!(this.isGovernorKey in this.props.drizzleState.contracts.Governance.isGovernor)) {
      return (
        <span>Loading...</span>
      )
    }

    if (this.props.drizzleState.contracts.Governance.isGovernor[this.isGovernorKey].value) {
      return (
        <Grid container alignItems="center" spacing={5} direction="column">
          <Grid item><Typography>You are an approved moderator.</Typography></Grid>
          <Grid item><this.GovernanceArtPieceListItems/></Grid>
        </Grid>
       );
    }

    return (
      <span>Unauthorized to use governor</span>
    )
  }
}

export default GovernanceArtPieceList;
