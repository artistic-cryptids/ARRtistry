pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IArtifactRegistry is IERC721 {
  struct Artifact {
    address artist;
    string _title;
    string _artistNationality;
    string _artistBirthYear; // TODO(mm5917): better data type
    string _created; // TODO(mm5917): better data type
    string _medium;
    string _size;
    string _metaUri;
  }

  function mint(address who, Artifact memory _artifact) public returns (uint256);
}
