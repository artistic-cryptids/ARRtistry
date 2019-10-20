import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import styles from '../theme';

interface RegisterProps {
  drizzle: any;
  drizzleState: any;
  classes: any;
}

class Register extends React.Component<RegisterProps, {}> {
  constructor (props: RegisterProps) {
    super(props);
    this.submitArtifactProposal = this.submitArtifactProposal.bind(this);
  }

  private submitArtifactProposal (): void {
    console.log(this.state);
  }

  render (): React.ReactNode {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            R
          </Avatar>
          <Typography component="h1" variant="h5">
            Register a Piece
          </Typography>
          <Divider />
          <Grid container direction="row" spacing={5} align-items="flex-start">
            <Card className={classes.card}>
              <CardContent>
                <input
                  accept="image/*"
                  className={classes.input}
                  style={{ display: 'none' }}
                  id="image-upload-button"
                  multiple
                  type="file"
                />
                <label htmlFor="image-upload-button">
                  <Button
                    component="span"
                    fullWidth
                    variant="contained"
                    className={classes.button}
                  >
                    Upload Image
                  </Button>
                </label>
              </CardContent>
            </Card>
            <Grid item xs={12} sm={6}>
              <form
                className={classes.form}
                noValidate
                onSubmit={this.submitArtifactProposal}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="on"
                      name="title"
                      variant="outlined"
                      required
                      fullWidth
                      id="title"
                      label="Title"
                      autoFocus
                      onChange={(e) => this.setState({ title: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="on"
                      variant="outlined"
                      required
                      fullWidth
                      id="artistName"
                      label="Artist Name"
                      name="artistName"
                      onChange={(e) => this.setState({ artistName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="on"
                      name="artworkCreationDate"
                      variant="outlined"
                      required
                      fullWidth
                      id="artworkCreationDate"
                      label="Artwork Creation Date"
                      autoFocus
                      onChange={(e) => this.setState({ artworkCreationDate: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      autoComplete="on"
                      name="edition"
                      variant="outlined"
                      required
                      fullWidth
                      id="edition"
                      label="Edition"
                      autoFocus
                      onChange={(e) => this.setState({ edition: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      autoComplete="med"
                      name="medium"
                      variant="outlined"
                      required
                      fullWidth
                      id="medium"
                      label="Medium"
                      autoFocus
                      onChange={(e) => this.setState({ medium: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>(* indicates that a field is required)</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox value="shareRecordPublicly" color="primary" />}
                      label="Share record publicly (you can change this later)"
                    />
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.submitArtifactProposal}
                >
                  + Register
                </Button>
              </form>
            </Grid>
          </Grid>
        </div>
      </Container >
    );
  }
}

export default withStyles(styles)(Register);
