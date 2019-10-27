import * as React from 'react';
import CloseIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

interface NetworkAsideProps {
  drizzle: any;
}

type NetworkAsideState = {
  open: boolean;
  network: string;
}

class NetworkAside extends React.Component<NetworkAsideProps, NetworkAsideState> {
  handleClose = (_: React.SyntheticEvent | React.MouseEvent, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  constructor (props: NetworkAsideProps, state: NetworkAsideState) {
    super(props, state);
    this.state = { open: false, network: 'unknown' };
  }

  async componentDidMount (): Promise<void> {
    const networkType = await this.props.drizzle.web3.eth.net.getNetworkType();
    console.log(networkType);
    this.setState({ open: true, network: networkType });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return '';
    }

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.open}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">
        You&apos;re currently on the <b>{this.state.network} Network</b>. This is for testing purposes only.</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

export default NetworkAside;
