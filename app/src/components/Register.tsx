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

type RegisterState = {
  registerTransactionStackId: any;
  title: string;
  artistName: string;
  medium: string;
  edition: string;
  artworkCreationDate: string;
}

class Register extends React.Component<RegisterProps, RegisterState> {
  constructor (props: RegisterProps) {
    super(props);
    this.state = {
      registerTransactionStackId: null,
      title: '',
      artistName: '',
      medium: '',
      edition: '',
      artworkCreationDate: '',
    };

    this.registerArtifact = this.registerArtifact.bind(this);
    this.getRegisterTransactionStatus = this.getRegisterTransactionStatus.bind(this);
  }

  registerArtifact (event: any): void {
    event.preventDefault();
    const { drizzle, drizzleState } = this.props;

    const currentAccount = drizzleState.accounts[0];
    const artist = drizzleState.accounts[0]; // TODO: Update this to real artist's account
    const imageUri = ''; // TODO: Implement image uploading

    const stackId = drizzle.contracts.ArtifactApplication.methods.applyFor.cacheSend(
      currentAccount,
      artist,
      this.state.title,
      this.state.medium,
      this.state.edition,
      this.state.artworkCreationDate,
      imageUri,
      {
        from: drizzleState.accounts[0],
        gasLimit: 6000000,
      }
    ); // TODO: Catch error when this function fails and display error to user

    this.setState({
      registerTransactionStackId: stackId,
    });
  }

  getRegisterTransactionStatus (): any {
    const { transactions, transactionStack } = this.props.drizzleState;

    const registerTransactionHash = transactionStack[this.state.registerTransactionStackId];
    if (!registerTransactionHash) {
      return null;
    }

    if (!transactions[registerTransactionHash]) {
      return null;
    }

    if (transactions[registerTransactionHash].status === 'success') {
      return 'Successfully registered artwork for approval';
    } else {
      return 'Error occured while registering artwork for approval';
    }
  };

  // TODO: Split these into more manageable components
  // TODO: Make required fields actually required
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
                onSubmit={this.registerArtifact}
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
                      autoComplete="on"
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
                  type="submit"
                >
                  + Register
                </Button>
              </form>
            </Grid>
          </Grid>
          <div>{this.getRegisterTransactionStatus()}</div>
        </div>
      </Container >
    );
  }
}

export default withStyles(styles)(Register);
