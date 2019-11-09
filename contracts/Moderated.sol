pragma solidity 0.5.12;

import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 * @title Moderated
 * @dev Behaviour for moderator interface
 */
contract Moderated is Ownable {

  // The address of the moderator
  mapping(address => bool) public moderators;

  modifier onlyModerator() {
    require(moderators[msg.sender], "Only a moderator can do this");
    _;
  }

  constructor() public Ownable() {
    moderators[owner()] = true;
  }

  // Add new moderators so they can approve new art pieces etc.
  function addModerator(address newModerator) public onlyModerator {
    moderators[newModerator] = true;
  }

}
