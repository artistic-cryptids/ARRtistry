pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IArtifactRegistry is IERC721 {
  struct Artifact {
    address artist;
    string metaUri;
  }

  function mint(address who, Artifact memory _artifact) public returns (uint256);
  function transfer(address who, address recipient, uint256 tokenId, string memory metaUri, uint price, string memory location) public;
}
