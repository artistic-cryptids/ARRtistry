pragma solidity 0.5.8;

contract IGovernance {
  function propose(address target, bytes memory data) public returns (uint);
  function voteYes(uint proposalId) public;
  function voteNo(uint proposalId) public;
}
