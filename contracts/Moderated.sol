pragma solidity 0.5.8;

import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 * @title Moderated
 * @dev Behaviour for moderator interface
 */
contract Moderated is Ownable {

  // The address of the moderator
  address public moderator;

  modifier onlyModerator() {
    require(msg.sender == moderator, "Only a moderator can do this");
    _;
  }

  constructor() public Ownable() {
    moderator = owner();
  }

  // Update the moderator required to approve new art pieces etc.
  function setModerator(address newModerator) public onlyModerator {
    moderator = newModerator;
  }

}
