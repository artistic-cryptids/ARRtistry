pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

import { IArtifactRegistry } from "./interfaces/IArtifactRegistry.sol";
import { IGovernance } from "./interfaces/IGovernance.sol";
import { ERC721ApprovalEnumerable } from "./ERC721ApprovalEnumerable.sol";

/**
 * @title ArtifactRegistry
 * @dev The core registry of the artifact
 */
contract ArtifactRegistry is IArtifactRegistry, Ownable, ERC721Full, ERC721ApprovalEnumerable {

  event RecordSale(address indexed from, address indexed to, uint256 tokenId, uint price, string location, string date);

  event RecordDamaged(uint256 indexed tokenId, string detailInfo, string indexed date);
  event RecordRestored(uint256 indexed tokenId, string detailInfo, string indexed date);
  event RecordStolen(uint256 indexed tokenId, string detailInfo, string indexed date);
  event RecordRecovered(uint256 indexed tokenId, string detailInfo, string indexed date);
  event RecordFilm(uint256 indexed tokenId, string detailInfo, string indexed date);

  using Counters for Counters.Counter;

  IGovernance public governance;

  Counters.Counter public _tokenId;
  mapping (uint256 => Artifact) public artifacts;

  constructor(address owner, IGovernance _governance) public ERC721Full("Artifact", "ART") {
    _transferOwnership(owner);
    governance = _governance;
  }

  function mint(address who, Artifact memory _artifact) public returns (uint256) {
    require(msg.sender == owner(), "ArtifactRegistry::mint: Not minted by the owner");

    _tokenId.increment();
    uint256 newTokenId = _tokenId.current();

    artifacts[newTokenId] = _artifact;

    _mint(who, newTokenId);
    _setTokenURI(newTokenId, _artifact.metaUri);

    return newTokenId;
  }

  function getArtifactForToken(uint256 tokenId) public view returns (address, string memory) {
    Artifact memory artwork = artifacts[tokenId];

    return (artwork.artist, artwork.metaUri);
  }

  function pieceDamaged(uint256 tokenId, string memory info, string memory date) public {
    emit RecordDamaged(tokenId, info, date);
  }

  function pieceRestored(uint256 tokenId, string memory info, string memory date) public {
    emit RecordRestored(tokenId, info, date);
  }

  function pieceStolen(uint256 tokenId, string memory info, string memory date) public {
    emit RecordStolen(tokenId, info, date);
  }

  function pieceRecovered(uint256 tokenId, string memory info, string memory date) public {
    emit RecordRecovered(tokenId, info, date);
  }

  function pieceFilm(uint256 tokenId, string memory info, string memory date) public {
    emit RecordFilm(tokenId, info, date);
  }

  function transfer(address who, address recipient, uint256 tokenId, string memory metaUri, uint price, string memory location, string memory date, bool arr) public {
    safeTransferFrom(who, recipient, tokenId);

    Artifact storage artwork = artifacts[tokenId];
    artwork.metaUri = metaUri;

    if (arr) {
      // Create a new ARR
      IGovernance.ARR memory arr;
      arr.from = who;
      arr.to = recipient;
      arr.tokenId = tokenId;
      arr.price = price;
      arr.location = location;
      arr.date = date;

      governance.pushARR(arr);
    }

    emit RecordSale(who, recipient, tokenId, price, location, date);
  }

  function getTokenIdsOfOwner(address owner) public view returns (uint[] memory) {
    uint balance = balanceOf(owner);
    uint[] memory tokenIds = new uint[](balance);

    for (uint i = 0; i < balance; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(owner, i);
    }

    return tokenIds;
  }
}
