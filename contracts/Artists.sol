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
    uint256 id;
    string name;
    address wallet;
    string nationality;
    string birthYear;
    string deathYear;
  }

  using Counters for Counters.Counter;

  Counters.Counter public _artistIds;
  mapping (uint256 => Artist) public artists;

  constructor(address owner) public {
    _transferOwnership(owner);
  }

  function addArtist(
    string memory name,
    address wallet,
    string memory nationality,
    string memory birthYear,
    string memory deathYear
  ) public onlyOwner {
    _artistIds.increment();
    uint256 id = _artistIds.current();

    artists[id] = Artist(id, name, wallet, nationality, birthYear, deathYear);
  }

  function getArtist(uint256 _id) public view returns (
    string memory,
    address,
    string memory,
    string memory,
    string memory
  ) {
    require(_id <= _artistIds.current(), "Artists::getArtist: invalid artist id");

    Artist memory artist = artists[_id];

    return (artist.name, artist.wallet, artist.nationality, artist.birthYear, artist.deathYear);
  }

  function getArtistsTotal() public view returns (uint256){
    return _artistIds.current();
  }
}
