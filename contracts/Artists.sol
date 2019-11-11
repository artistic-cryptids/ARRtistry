pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/drafts/Counters.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import { IGovernance } from "./interfaces/IGovernance.sol";

/**
 * @title Artists
 * @dev The collection of Artists registered on our system
 */
contract Artists is Ownable {

  struct Artist {
    string metaUri;
  }

  using Counters for Counters.Counter;

  Counters.Counter public _artistId;
  mapping (uint256 => Artist) public artists;

  IGovernance public governance;

  constructor(address owner, IGovernance _governance) public {
    _transferOwnership(owner);
    governance = _governance;
  }

  function addArtist(string memory metaUri) public {
    require(governance.isGovernor(msg.sender), "Artists::addArtist: only governor accounts can add artists");

    _artistId.increment();
    uint256 id = _artistId.current();
    artists[id] = Artist(metaUri);
  }

  function getArtist(uint256 _id) public view returns (string memory metaUri) {
    require(_id <= _artistId.current(), "Artists::getArtist: invalid artist id");

    Artist memory artist = artists[_id];

    return (artist.metaUri);
  }

  function getArtistsTotal() public view returns (uint256) {
    return _artistId.current();
  }
}
