pragma solidity ^0.5.0;

import "../ArtistryCore.sol";

/**
 * @title ERC721Mock
 * This mock just provides a public safeMint, mint, and burn functions for testing purposes
 */
contract ArtistryCoreMock is ArtistryCore {
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burn(address owner, uint256 tokenId) public {
        _burn(owner, tokenId);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
