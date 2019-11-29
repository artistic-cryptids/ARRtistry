pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

import { IARRRegistry } from "./interfaces/IARRRegistry.sol";
import { IGovernance } from "./interfaces/IGovernance.sol";
import { ARRCalculator } from "./ARRCalculator.sol";

/**
 * @title ARRRegistry
 * @dev The core registry of any ARR
 */
contract ARRRegistry is IARRRegistry, Ownable {
  using Counters for Counters.Counter;

  event Recorded(uint id, ARR arr);

  IGovernance public _governance;

  Counters.Counter public _id;
  mapping (uint256 => ARR) public arrs;

  constructor(address owner, IGovernance governance) public {
    _transferOwnership(owner);
    _governance = governance;
  }

  function governance() public view returns (IGovernance) {
    return _governance;
  }

  function totalRecords() public view returns (uint) {
    return _id.current();
  }

  function record(ARR memory arr) public returns (uint) {
    require(governance().isGovernor(msg.sender) || msg.sender == owner(), "ARRRegistry::record: ARR is not recorded by a governor");

    _id.increment();
    uint256 newId = _id.current();

    arrs[newId] = arr;

    emit Recorded(newId, arr);
  }

  function retrieve(uint id) public view returns (ARR memory) {
    return arrs[id];
  }

  function markPaid(uint id) public {
    require(governance().isGovernor(msg.sender) || msg.sender == owner(), "ARRRegistry::record: ARR cannot be marked paid by a non governor");
    arrs[id].paid = true;
  }
}
