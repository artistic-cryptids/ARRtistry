pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

import { IArtifactRegistry } from "./interfaces/IArtifactRegistry.sol";
import { IARRRegistry } from "./interfaces/IARRRegistry.sol";
import { IGovernance } from "./interfaces/IGovernance.sol";
import { Consignment } from "./Consignment.sol";
import { ERC721ApprovalEnumerable } from "./ERC721ApprovalEnumerable.sol";
import { ARRCalculator } from "./ARRCalculator.sol";

/**
 * @title ArtifactRegistry
 * @dev The core registry of the artifact
 */
contract ArtifactRegistry is IArtifactRegistry, Ownable, ERC721Full, ERC721ApprovalEnumerable {

  event RecordSale(address indexed from, address indexed to, uint256 tokenId, uint price, string location, string date);
  event RecordARR(uint arrId);

  event RecordDamaged(uint256 indexed tokenId, string detailInfo, string date);
  event RecordRestored(uint256 indexed tokenId, string detailInfo, string date);
  event RecordStolen(uint256 indexed tokenId, string detailInfo, string date);
  event RecordRecovered(uint256 indexed tokenId, string detailInfo, string date);
  event RecordFilm(uint256 indexed tokenId, string detailInfo, string date);

  using Counters for Counters.Counter;

  IGovernance public governance;
  Consignment public consignment;
  IARRRegistry public arrRegistry;

  Counters.Counter public _tokenId;
  mapping (uint256 => Artifact) public artifacts;

  constructor(address owner, IGovernance _governance, IARRRegistry _arrRegistry) public ERC721Full("Artifact", "ART") {
    _transferOwnership(owner);
    governance = _governance;
    arrRegistry = _arrRegistry;
  }

  function setConsignment(Consignment _consignment) public {
    consignment = _consignment;
  }

  function mint(address who, Artifact memory _artifact) public returns (uint256) {
    // TODO: Require artist info at metaUri to be the approved artist minting this artifact
    require(msg.sender == owner() || (governance.isApprovedArtist(who) && msg.sender == who && msg.sender == _artifact.artist),
      "ArtifactRegistry::mint: Not minted by the owner or approved artist");

    _tokenId.increment();
    uint256 newTokenId = _tokenId.current();

    artifacts[newTokenId] = _artifact;

    _mint(who, newTokenId);
    _setTokenURI(newTokenId, _artifact.metaUri);

    return newTokenId;
  }

  function initConsign(uint256 tokenId, address who, uint8 commission) public {
    approve(address(consignment), tokenId);

    consignment.consign(tokenId, who, commission);
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

  function transfer(
    address who,
    address recipient,
    uint256 tokenId,
    string memory metaUri,
    uint price,
    string memory location,
    string memory date,
    bool incursARR
  ) public {
    Artifact storage artwork = artifacts[tokenId];
    artwork.metaUri = metaUri;

    if (incursARR) {
      IARRRegistry.ARR memory arr = IARRRegistry.ARR({
        from: who,
        to: recipient,
        tokenId: tokenId,
        price: price,
        location: location,
        date: date,
        paid: false
      });

      uint arrId = arrRegistry.record(arr);
      emit RecordARR(arrId);
    }

    emit RecordSale(who, recipient, tokenId, price, location, date);

    safeTransferFrom(who, recipient, tokenId);
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
