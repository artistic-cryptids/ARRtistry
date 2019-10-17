
/**
 * @title ArtistryCore
 * @dev Core functionality of the platform
 */
contract Moderated is Ownable {

  // The address of the moderator
  address public moderator;

  modifier onlyModerator() {
    require(msg.sender == moderator, "Only a moderator can do this");
    _;
  }

  constructor() Ownable(msg.sender) public {
    moderator = owner();
  }

  // Update the moderator required to approve new art pieces etc.
  function setModerator(address newModerator) public onlyModerator {
    moderator = newModerator;
  }

}
