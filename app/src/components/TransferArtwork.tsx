import * as React from 'react';

interface TransferArtworkProps {
  drizzle: any;
  drizzleState: any;
  id: any;
}

type TransferArtworkState = {
  recipientAddress: any;
}

class TransferArtwork extends React.Component<TransferArtworkProps, TransferArtworkState> {
  componentDidMount (): void {
    this.setState({
      recipientAddress: null,
    });

    this.transferArtwork = this.transferArtwork.bind(this);
  }

  transferArtwork (): void {
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;
    const currentAccount = this.props.drizzleState.accounts[0];

    artifactRegistry.methods.tokenOfOwnerByIndex(
      currentAccount, this.props.id)
      .call()
      .then((tokenId: any) => {
        artifactRegistry.methods.safeTransferFrom.cacheSend(
          currentAccount,
          this.state.recipientAddress,
          tokenId
        );
      })
      .catch((err: any) => { console.log(err); });
  }

  render (): React.ReactNode {
    return (
      <div>
        <button
          type="button"
          onClick={this.transferArtwork}
        >
          Transfer to
        </button>
        <input
          type="text"
          name="recipientAddress"
          onChange={(e) => this.setState({ recipientAddress: e.target.value })}
        />
      </div>
    );
  }
}

export default TransferArtwork;
