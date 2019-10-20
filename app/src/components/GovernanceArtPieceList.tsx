import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class GovernanceArtPieceList extends React.Component<{}, {}> {
  private renderGovernanceArtPieceListItems (): React.ReactNode {
    const placeholderJson = {
      'data': [
        {
          'piece_name': 'GOV GOV Guernica',
          'artist_name': 'Pablo Picasso',
          'birthyear': '1881',
          'deathyear': '1973',
          'medium': 'Oil on Canvas',
          'code': '0x11111',
        },
        {
          'piece_name': 'GOV GOV Impression, Sunrise',
          'artist_name': 'Claude Monet',
          'birthyear': '1234',
          'deathyear': '5687',
          'medium': 'Oil on Toilet Paper',
          'code': '0x222222',
        },
      ],
    };

    const useStyles = makeStyles(theme => ({
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

    const classes = useStyles(this.props);
    const artpieces = placeholderJson.data;
    const returnListItem = function (artpiece: any): any {
      // TODO: extract these
      // the scoping of 'this' is really difficult
      const rejectProposal = function (code: any): any {
        console.log(code);
      };
      const approveProposal = function (code: any): any {
        console.log(code);
      };

      return <ListItem alignItems="flex-start" key={artpiece.code}>
        <Grid container direction="row">
          <ListItemAvatar>
            {/* TODO: replace with thumbnail image?? */}
            <Avatar alt={artpiece.piece_name}>{artpiece.piece_name.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={artpiece.piece_name}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {artpiece.artist_name} <br />
                </Typography>
                {artpiece.birthyear}&ndash;{artpiece.deathyear}. {artpiece.medium}
              </React.Fragment>
            }
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.approve}
            onClick={(e) => approveProposal(artpiece.code)}>
                        Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.reject}
            onClick={(e) => rejectProposal(artpiece.code)}>
                        Reject
          </Button>
        </Grid>
      </ListItem >;
    };
    const listItems = artpieces.map((artpiece) => returnListItem(artpiece));
    return (
      <List className={classes.root}>{listItems}</List>
    );
  }

  render (): React.ReactNode {
    return (
      <Grid container alignItems="center" spacing={5} direction="column">
        <Grid item><Typography>You are an approved moderator.</Typography></Grid>
        <Grid item>
          { this.renderGovernanceArtPieceListItems() }
        </Grid>
      </Grid>
    );
  }
}

export default GovernanceArtPieceList;
