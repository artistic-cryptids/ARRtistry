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

    // Pre populate with some artists
    addArtist("Vincent Van Gogh", address(uint(keccak256(abi.encodePacked("Vincent Van Gogh")))));
    addArtist("Pablo Picasso", address(uint(keccak256(abi.encodePacked("Pablo Picasso")))));
    addArtist("Leonardo da Vinci", address(uint(keccak256(abi.encodePacked("Leonardo da Vinci")))));
    addArtist("Claude Monet", address(uint(keccak256(abi.encodePacked("Claude Monet")))));
    addArtist("Andy Warhol", address(uint(keccak256(abi.encodePacked("Andy Warhol")))));
    addArtist("Salvador Dali", address(uint(keccak256(abi.encodePacked("Salvador Dali")))));
    addArtist("Michelangelo", address(uint(keccak256(abi.encodePacked("Michelangelo")))));

  }

  function addArtist(string memory name, address wallet) public onlyOwner returns (uint256) {
    _artistIds.increment();
    uint256 id = _artistIds.current();

    artists[id] = Artist(name, wallet);

    return id;
  }

  function getArtistsTotal() public returns (uint256){
    return _artistIds.current();
  }
}
