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

  struct ARR {
    address from;
    address to;
    uint256 tokenId;
    uint price;
    string location;
  }

  function isGovernor(address account) public view returns (bool);

  function propose(address target, bytes memory data) public returns (uint);
  function approve(uint proposalId) public;
  function reject(uint proposalId) public;
  function getProposal(uint proposalId) public view returns (Proposal memory);
  function getProposals() public view returns (uint[] memory);

  function recordARR(address from, address to, uint256 tokenId, uint price, string memory location) public returns (uint);
  function getARRLength() public view returns (uint);
  function getARR(uint arrId) public view returns (ARR memory);
}
