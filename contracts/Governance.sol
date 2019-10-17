pragma solidity 0.5.8;

import { Moderated } from "./Moderated.sol";


/**
 * @title Governance
 * @dev Manage the creation of new art pieces, artifacts
 */
contract Governance is Moderated {

  event Propose(uint indexed proposalId, address indexed proposer, address indexed target, bytes data);
  event Approve(uint indexed proposalId);
  event Reject(uint indexed proposalId);
  event Execute(uint indexed proposalId);

  enum Status { Approved, Rejected, Pending }

  struct Proposal {
    Status status;
    address target;
    bytes data;
    address proposer;
  }

  Proposal[] public proposals;

  // Maps the proposal id to the proposer of the artifact.
  mapping (uint => address) public proposalToProposer;

  // So we can get back to an approved proposal after minting a token for it
  mapping (uint256 => uint) public tokenToApprovedProposal;

  // TODO(mm5917): should submitting cost ether?
  function propose(address target, bytes memory data) public returns (uint) {
    require(msg.sender != address(this), "Governance::propose: Invalid proposal");
    // require(token.transferFrom(msg.sender, address(this), proposalFee), "Governance::propose: Transfer failed");

    uint proposalId = proposals.length;

    // Create a new proposal
    Proposal memory proposal;
    proposal.target = target;
    proposal.data = data;
    proposal.proposer = msg.sender;

    proposals.push(proposal);

    emit Propose(proposalId, msg.sender, target, data);

    return proposalId;
  }

  //TODO: Needs an iteration function

  function voteYes(uint proposalId) public onlyModerator {
    Proposal memory proposal = proposals[proposalId];
    require(
      proposal.status == Status.Pending,
      "Governance::voteYes: Artifact proposal must not already have been rejected or approved"
    );

    proposals[proposalId].status = Status.Approved;

    emit Execute(proposalId);
    (bool success, ) = proposal.target.call(proposal.data);
    require(success, "Governance::voteYes: Proposal target call was unsuccessful");
  }

  function voteNo(uint proposalId) public {
    require(
      msg.sender == proposals[proposalId].proposer || msg.sender == moderator,
      "Governance::voteNo: Only the proposer or moderator can reject a piece of work"
    );

    proposals[proposalId].status = Status.Rejected;

    emit Reject(proposalId);
  }
}
