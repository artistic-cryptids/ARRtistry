pragma solidity ^0.5.0;

import "./ArtistryCore.sol";

/**
 * @title ArtifactGovernance
 * @dev Manage the creation of new art pieces, artifacts
 */
contract ArtifactGovernance is ArtistryCore {

  enum Status { Approved, Rejected, Pending }

  struct ArtifactProposal {
    address artist;
    string title;
    string medium;
    string edition;
    string created; // TODO(mm5917): better data type
    string metaUri;
    Status status;
  }

  event SubmitArtifactProposal();
  event ApproveArtifactProposal();
  event RejectArtifactProposal();

  ArtifactProposal[] public proposals;

  // Maps the proposal id to the proposer of the artifact.
  mapping (uint => address) public proposalToProposer;

  // So we can get back to an approved proposal after minting a token for it
  mapping (uint256 => uint) public tokenToApprovedProposal;

  // TODO(mm5917): should submitting cost ether?
  function submitArtifactProposal(
    address _artist,
    string memory _title,
    string memory _medium,
    string memory _edition,
    string memory _created,
    string memory _metaUri
  ) public returns (uint) {

    // TODO(mm5917): sanity checks on sender and other things
    // require(msg.sender != address(this) && target != address(token), "Governance::proposeWithFeeRecipient: Invalid proposal");
    // require(token.transferFrom(msg.sender, address(this), proposalFee), "Governance::proposeWithFeeRecipient: Transfer failed");

    uint proposalId = proposals.length;

    // Create a new proposal
    ArtifactProposal memory proposal;
    proposal.artist = _artist;
    proposal.title = _title;
    proposal.medium = _medium;
    proposal.edition = _edition;
    proposal.created = _created;
    proposal.metaUri = _metaUri;
    proposal.status = Status.Pending;

    proposalToProposer[proposalId] = msg.sender;

    proposals.push(proposal);

    emit SubmitArtifactProposal();

    return proposalId;
  }

  //TODO: Needs an iteration function

  function approveArtifactProposal(uint proposalId) public onlyModerator returns (uint256) {
    ArtifactProposal memory proposal = proposals[proposalId];
    require(
      proposal.status == Status.Pending,
      "Artifact proposal must not already have been rejected or approved"
    );

    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();

    // Mint the new token
    _mint(proposal.artist, newTokenId);
    _setTokenURI(newTokenId, proposal.metaUri);

    // Record everywhere that we have a new artifact
    tokenToApprovedProposal[newTokenId] = proposalId;

    return newTokenId;
  }

  function removeArtifactProposal(uint proposalId) public {
    require(
      msg.sender == proposals[proposalId].artist || msg.sender == moderator,
      "Only the proposer or moderator can reject a piece of work"
    );

    proposals[proposalId].status = Status.Rejected;

    emit RejectArtifactProposal();
  }
}
