pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/drafts/Counters.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


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

  constructor(address owner) public {
    _transferOwnership(owner);
  }

  function addArtist(string memory metaUri) public onlyOwner {
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
