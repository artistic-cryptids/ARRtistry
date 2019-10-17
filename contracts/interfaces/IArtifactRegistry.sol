pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IArtifactRegistry is IERC721 {
  struct Artifact {
    address artist;
    string title;
    string medium;
    string edition;
    string created; // TODO(mm5917): better data type
    string metaUri;
  }

  function mint(address who, Artifact memory _artifact) public returns (uint256);
}
