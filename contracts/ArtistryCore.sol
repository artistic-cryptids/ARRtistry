pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

/**
 * @title ArtistryCore
 * @dev Core functionality of the platform
 */
contract ArtistryCore is Ownable, ERC721Full {

  // The address of the moderator
  address public moderator;

  constructor() ERC721Full("Artifact", "ART") public {
    moderator = owner();
  }

  // Update the moderator required to approve new art pieces etc.
  function setModerator(address newModerator) public onlyOwner {
    moderator = newModerator;
  }
}
