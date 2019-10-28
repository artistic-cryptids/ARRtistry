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
    string name;
    address wallet;
  }

  using Counters for Counters.Counter;

  Counters.Counter public _artistIds;
  mapping (uint256 => Artist) public artists;

  constructor(address owner) public {
    _transferOwnership(owner);
  }

  function addArtist(string memory name, address wallet) public onlyOwner {
    _artistIds.increment();
    uint256 id = _artistIds.current();

    artists[id] = Artist(name, wallet);
  }

  function getArtist(uint256 _id) public view returns (string memory, address) {
    require(_id <= _artistIds.current(), "Artists::getArtist: invalid artist id");

    Artist memory artist = artists[_id];

    return (artist.name, artist.wallet);
  }

  function getArtistsTotal() public view returns (uint256){
    return _artistIds.current();
  }
}
