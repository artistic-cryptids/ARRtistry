pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import { ArtifactRegistry } from "../ArtifactRegistry.sol";

/**
 * @title ArtifactRegistryMock
 * This mock just provides a public mint, and burn functions for testing purposes
 */
contract ArtifactRegistryMock is ArtifactRegistry {

  //solhint-disable-next-line no-empty-blocks
  constructor(address owner) public ArtifactRegistry(owner) {}

  function mockMint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }

  function mockBurn(address owner, uint256 tokenId) public {
    _burn(owner, tokenId);
  }

  function mockBurn(uint256 tokenId) public {
    _burn(tokenId);
  }
}
