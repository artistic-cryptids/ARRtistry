pragma solidity ^0.5.0;

import "./ArtistryCore.sol";

/**
 * @title ArtifactGovernance
 * @dev Manage the creation of new art pieces, artifacts
 */
contract ArtifactGovernance {

  struct ArtifactProposal {
    address artist;
    string title;
    string medium;
    string edition;
    string created; // TODO(mm5917): better data type
    string metaUri;
  }

  event SubmitArtPiece();
  event ApproveArtPiece();
  event UnSubmitArtPiece();
  event RejectArtPiece();

  ArtifactProposal[] public proposals;

  function submitArtifactProposal(address artist, string memory metaUri) public returns (uint256) {
    // TODO(mm5917): this

    return 0;
  }

  function removeArtifactProposal(ArtifactProposal proposal) {
    require(msg.sender == proposal.artist, "Only the artist can un-submit a piece of work");
    removeProposal();
    emit UnSubmitArtPiece();
  }

  function approveArtifactProposal() onlyModerator {
    // TODO(mm5917): this is just example code
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(player, newItemId);
    _setTokenURI(newItemId, metadataUri);

    // return newItemId;
  }

  function rejectArtifactProposal() onlyModerator {
    removeProposal();
    emit RejectArtPiece();
  }

  function removeProposal() private {
    // TODO(mm5917): common logic to remove/reject proposal
  }
}
