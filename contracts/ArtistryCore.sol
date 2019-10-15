pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

/**
 * @title ArtistryCore
 * @dev Core functionality of the platform
 */
contract ArtistryCore is Ownable, ERC721Full {

  // Use counters for IDs as they use less gas
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // The address of the moderator
  address public moderator;

  modifier onlyModerator() {
    require(msg.sender == moderator, "Only a moderator can do this");
    _;
  }

  constructor() ERC721Full("Artifact", "ART") public {
    moderator = owner();
  }

  // Update the moderator required to approve new art pieces etc.
  function setModerator(address newModerator) public onlyOwner {
    moderator = newModerator;
  }
}
