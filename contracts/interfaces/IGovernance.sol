pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

contract IGovernance {
  enum Status { Approved, Rejected, Pending }

  struct Proposal {
    Status status;
    address target;
    bytes data;
    address proposer;
  }

  function isGovernor(address account) public view returns (bool);

  function propose(address target, bytes memory data) public returns (uint);
  function approve(uint proposalId) public;
  function reject(uint proposalId) public;
  function getProposal(uint proposalId) public view returns (Proposal memory);
  function getProposals() public view returns (uint[] memory);
  
  function isApprovedArtist(address _artist) public view returns (bool);
  function approveArtist(address _artist) public;
}
