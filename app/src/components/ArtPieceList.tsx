import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Styles from '../theme';

interface RegisterProps {
  classes: any;
}

class ArtPieceList extends React.Component<RegisterProps, {}> {
  private renderArtPieceListItems (): React.ReactNode {
    const placeholderJson = {
      'data': [
        {
          'piece_name': 'Guernica',
          'artist_name': 'Pablo Picasso',
          'birthyear': '1881',
          'deathyear': '1973',
          'medium': 'Oil on Canvas',
          'code': '0x11111',
        },
        {
          'piece_name': 'Impression, Sunrise',
          'artist_name': 'Claude Monet',
          'birthyear': '1840',
          'deathyear': '1926',
          'medium': 'Oil on Toilet Paper',
          'code': '0x222222',
        },
      ],
    };

    const artpieces = placeholderJson.data;
    const listItems = artpieces.map((artpiece) =>
      <ListItem alignItems="flex-start" key={artpiece.code}>
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
                className={this.props.classes.inline}
                color="textPrimary"
              >
                {artpiece.artist_name} <br />
              </Typography>
              {artpiece.birthyear}&ndash;{artpiece.deathyear}. {artpiece.medium}
            </React.Fragment>
          }
        />
      </ListItem >
    );
    return (
      <List className={this.props.classes.root}>{listItems}</List>
    );
  }

  render (): React.ReactNode {
    return (
      <Grid container alignItems="center" spacing={5} direction="column">
        { this.renderArtPieceListItems() }
      </Grid>
    );
  }
}

export default withStyles(Styles)(ArtPieceList);
