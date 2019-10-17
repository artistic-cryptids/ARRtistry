pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

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
    proposal.status = Status.Pending;

    proposals.push(proposal);

    emit Propose(proposalId, msg.sender, target, data);

    return proposalId;
  }

  function getProposal(uint proposalId) public view returns (Proposal memory) {
    return proposals[proposalId];
  }

  function approve(uint proposalId) public onlyModerator {
    Proposal memory proposal = proposals[proposalId];
    require(
      proposal.status == Status.Pending,
      "Governance::approve: Proposal is already finalized"
    );

    proposals[proposalId].status = Status.Approved;

    emit Approve(proposalId);
    // solhint-disable-next-line avoid-low-level-calls
    (bool success, ) = proposal.target.call(proposal.data);
    require(success, "Governance::approve: Proposal target call was unsuccessful");
  }

  function reject(uint proposalId) public {
    require(
      msg.sender == proposals[proposalId].proposer || msg.sender == moderator,
      "Governance::reject: Only the proposer or moderator can reject a proposal"
    );
    require(
      proposals[proposalId].status == Status.Pending,
      "Governance::reject: Proposal is already finalized"
    );

    proposals[proposalId].status = Status.Rejected;

    emit Reject(proposalId);
  }
}
