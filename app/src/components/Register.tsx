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
import ipfs from '../ipfs';

interface RegisterProps {
  drizzle: any;
  drizzleState: any;
  classes: any;
}

type RegisterState = {
  title: string;
  registerTransactionStackId: any;
  artistName: string;
  artistNationality: string;
  artistBirthYear: string;
  createdDate: string;
  medium: string;
  edition: string;
  artworkCreationDate: string;
  imageIpfsHash: string;
  size: string;
}

class Register extends React.Component<RegisterProps, RegisterState> {
  constructor (props: RegisterProps) {
    super(props);
    this.state = {
      registerTransactionStackId: null,
      title: '',
      artistName: '',
      artistNationality: '',
      artistBirthYear: '',
      createdDate: '',
      medium: '',
      edition: '',
      artworkCreationDate: '',
      imageIpfsHash: '',
      size: '',
    };

    this.registerArtifact = this.registerArtifact.bind(this);
    this.getRegisterTransactionStatus = this.getRegisterTransactionStatus.bind(this);
  }

  registerArtifact (event: any): void {
    event.preventDefault();

    const { drizzle, drizzleState } = this.props;

    const currentAccount = drizzleState.accounts[0];
    const artist = drizzleState.accounts[0]; // TODO: Update this to real artist's account

    const metaUri = '';

    const stackId = drizzle.contracts.ArtifactApplication.methods.applyFor.cacheSend(
      currentAccount,
      artist,
      this.state.title,
      this.state.artistName,
      this.state.artistNationality,
      this.state.artistBirthYear,
      this.state.createdDate,
      this.state.medium,
      this.state.size,
      this.state.imageIpfsHash,
      metaUri,
      {
        from: drizzleState.accounts[0],
        gasLimit: 6000000,
      },
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

  async saveToIpfs (files: any): Promise<void> {
    let ipfsId: string;
    await ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => {
        ipfsId = response[0].hash;
        this.setState({ imageIpfsHash: ipfsId });
      }).catch((err: any) => {
        console.log(err);
      });
  }

  // TODO: Split these into more manageable components
  // TODO: Make required fields actually required
  render (): React.ReactNode {
    const { classes } = this.props;

    let imgDisplay;
    if (this.state.imageIpfsHash === '') {
      imgDisplay = (<Typography>No image given.</Typography>);
    } else {
      imgDisplay = (<img alt="artwork on ipfs" src={'https://ipfs.io/ipfs/' + this.state.imageIpfsHash} />);
    }
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
                  onChange={(e): void => {
                    e.stopPropagation();
                    e.preventDefault();
                    const files = e.target.files;
                    if (files != null && files[0].size < 1000000) {
                      // max file size of one megabyte
                      this.saveToIpfs(files);
                    } else {
                      // TODO: nicer way of alerting
                      alert('Image cannot be greater than 1 MB!');
                    }
                  }}
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
                {imgDisplay}
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
                      onChange={(e): void => this.setState({ title: e.target.value })}
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
                      onChange={(e): void => this.setState({ artistName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="on"
                      variant="outlined"
                      required
                      fullWidth
                      id="artistNationality"
                      label="Artist's Nationality"
                      name="artistNationality"
                      onChange={(e): void => this.setState({ artistNationality: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="on"
                      name="createdDate"
                      variant="outlined"
                      required
                      fullWidth
                      id="createdDate"
                      label="Artwork Creation Date"
                      autoFocus
                      onChange={(e): void => this.setState({ createdDate: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      autoComplete="on"
                      name="artistBirthYear"
                      variant="outlined"
                      required
                      fullWidth
                      id="artistBirthYear"
                      label="Artisit Year of Birth"
                      autoFocus
                      onChange={(e): void => this.setState({ artistBirthYear: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      autoComplete="on"
                      name="size"
                      variant="outlined"
                      required
                      fullWidth
                      id="size"
                      label="Size"
                      autoFocus
                      onChange={(e): void => this.setState({ size: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      autoComplete="on"
                      name="medium"
                      variant="outlined"
                      required
                      fullWidth
                      id="medium"
                      label="Medium"
                      autoFocus
                      onChange={(e): void => this.setState({ medium: e.target.value })}
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
