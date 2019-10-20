import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Styles from '../theme';

interface ProposalItemProps {
  drizzle: any;
  drizzleState: any;
  id: any;
  classes: any;
}

type ProposalItemState = {
  proposal: any
}

class ProposalItem extends React.Component<ProposalItemProps, ProposalItemState> {
  rejectProposal = () => {
    console.log("Rejecting proposal " + this.props.id);
    this.props.drizzle.contracts.Governance.methods.reject(this.props.id).send({from: this.props.drizzleState.accounts[0]});
  }

  approveProposal = () => {
    console.log("Approving proposal " + this.props.id);
    this.props.drizzle.contracts.Governance.methods.approve(this.props.id).send({from: this.props.drizzleState.accounts[0]});
  }

  componentDidMount () {
    this.props.drizzle.contracts.ArtifactApplication.methods.getProposal(this.props.id).call()
      .then((proposalData: any) => {
        const proposal = {
          title: proposalData[2],
          medium: proposalData[3],
          edition: proposalData[4],
          created: proposalData[5],
          metaUri: proposalData[6]
        };
        this.setState({proposal: proposal});
      });
  }

  render (): React.ReactNode {
    if (!this.state.proposal) {
      return "Loading...";
    }

    return <ListItem alignItems="flex-start" key={this.props.id}>
       <Grid container direction="row">
         <ListItemAvatar>
           {/* TODO: replace with thumbnail image?? */}
           <Avatar alt={this.state.proposal.title}>{this.state.proposal.edition}</Avatar>
         </ListItemAvatar>
         <ListItemText
           primary={this.state.proposal.title}
           secondary={
             <React.Fragment>
               <Typography
                 component="span"
                 variant="body2"
                 className={this.props.classes.inline}
                 color="textPrimary"
               >
                 {this.state.proposal.artist_name}<br/>
               </Typography>
               {this.state.proposal.created}. {this.state.proposal.medium}
             </React.Fragment>
           }
         />
         <Button
           variant="contained"
           color="primary"
           className={this.props.classes.approve}
           onClick={(e) => this.approveProposal()}>
           Approve
         </Button>
         <Button
           variant="contained"
           color="secondary"
           className={this.props.classes.reject}
           onClick={(e) => this.rejectProposal()}>
           Reject
         </Button>
       </Grid>
     </ListItem >;
  }
}

export default withStyles(Styles)(ProposalItem);
