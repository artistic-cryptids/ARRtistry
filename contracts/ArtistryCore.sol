pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

/**
 * @title ArtistryCore
 * @dev Core functionality of the platform, registering users, artists and DACS
 */
contract ArtistryCore is Ownable {

  // The address of the moderator
  address dacs;

  // Update the moderator required to approve new art pieces etc.
  function setModerator(address moderator) public onlyOwner {
    dacs = moderator;
  }
}
