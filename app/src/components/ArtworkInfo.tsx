import * as React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Styles from '../theme';

interface ArtworkInfoProps {
  artwork: any;
  id: any;
  classes: any;
}

class ArtworkInfo extends React.Component<ArtworkInfoProps, {}> {
  render (): React.ReactNode {
    return (
      <Grid container direction="row">
        <ListItemAvatar>
          {/* TODO: replace with thumbnail image?? */}
          <Avatar alt="alt">createdDate</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="title"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={this.props.classes.inline}
                color="textPrimary"
              >
                {/* image will be at https://ipfs.io/ipfs/METAURI */}
                {this.props.artwork.metaUri} <br/>
              </Typography>
              "createdDate. medium."
            </React.Fragment>
          }
        />
      </Grid>
    );
  }
}

export default withStyles(Styles)(ArtworkInfo);
