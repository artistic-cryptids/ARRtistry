pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import { IArtifactRegistry } from "./interfaces/IArtifactRegistry.sol";

/**
 * @title Consignment
 * @dev The contract in charge of delegating consignment to dealers
 */
contract Consignment {

  IArtifactRegistry public registry;

  struct ConsignmentInfo {
    address consigner;
    uint8 commission;
  }

  constructor(IArtifactRegistry _registry) public {
    registry = _registry;
  }

  mapping (address => ConsignmentInfo) public consignments;
  mapping (address => uint256[]) public consigned;

  modifier authorized(uint256 tokenId) {
    address tokenOwner = registry.ownerOf(tokenId);

    address who = msg.sender;
    ConsignmentInfo memory consignmentInfo;

    while (who != address(0) && who != tokenOwner) {
      consignmentInfo = consignments[who];
      who = consignmentInfo.consigner;
    }

    require(tokenOwner == who, "Consignment::authorized: Account not authorized");
    _;
  }

  function transfer(
    address who,
    address recipient,
    uint256 tokenId,
    string memory metaUri,
    uint price,
    string memory location,
    string memory date,
    bool arr
  ) public authorized(tokenId) {
    registry.transfer(who, recipient, tokenId, metaUri, price, location, date, arr);
  }

  function consign(uint256 tokenId, address who, uint8 commission) public authorized(tokenId) {
    ConsignmentInfo memory consignmentInfo;

    consignmentInfo.consigner = msg.sender;
    consignmentInfo.commission = commission;

    consignments[who] = consignmentInfo;

    consigned[who].push(tokenId);
  }

  function isConsigned(uint256 tokenId, address who) public view returns (bool) {
    address tokenOwner = registry.ownerOf(tokenId);

    ConsignmentInfo memory consignmentInfo;

    while (who != address(0) && who != tokenOwner) {
      consignmentInfo = consignments[who];
      who = consignmentInfo.consigner;
    }

    return who == tokenOwner;
  }

  function consignedTokenIds() public view returns (uint256[] memory) {
    return consigned[msg.sender];
  }
}
