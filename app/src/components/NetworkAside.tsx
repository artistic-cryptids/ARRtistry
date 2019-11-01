import * as React from 'react';
import Toast from 'react-bootstrap/Toast';

interface NetworkAsideProps {
  drizzle: any;
}

type NetworkAsideState = {
  open: boolean;
  network: string;
}

class NetworkAside extends React.Component<NetworkAsideProps, NetworkAsideState> {
  handleClose = (): void => {
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

  networkName (): string {
    return this.state.network.replace(/\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      },
    );
  };

  render (): React.ReactNode {
    if (!this.state) {
      return '';
    }

    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'relative',
          minHeight: '100px',
        }}
      >
        <Toast
          show={this.state.open}
          onClose={this.handleClose}
          style={{
            position: 'fixed',
            bottom: 0,
            zIndex: 3,
          }}
          className="m-4"
        >
          <Toast.Header>
            <strong className="mr-auto">{this.networkName()} Network</strong>
          </Toast.Header>
          <Toast.Body>This is for testing purposes only.</Toast.Body>
        </Toast>
      </div>
    );
  }
}

export default NetworkAside;
