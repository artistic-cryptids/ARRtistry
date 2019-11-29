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
    uint256 tokenId;
    uint8 commission;
  }

  mapping (address => ConsignmentInfo[]) public consignments;
  mapping (address => uint256[]) public consigned;

  modifier authorized(uint256 tokenId) {
    require(isConsigned(tokenId, msg.sender), "Consignment::authorized: Account not authorized");
    _;
  }

  constructor(IArtifactRegistry _registry) public {
    registry = _registry;
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
    consignmentInfo.tokenId = tokenId;
    consignmentInfo.commission = commission;

    consignments[who].push(consignmentInfo);

    consigned[who].push(tokenId);
  }

  function getConsignmentInfo(uint256 tokenId) public view returns (address, uint8) {
    ConsignmentInfo[] memory consignmentInfos = consignments[msg.sender];

    for (uint i = 0; i < consignmentInfos.length; i++) {
      if (consignmentInfos[i].tokenId == tokenId) {
        return (consignmentInfos[i].consigner, consignmentInfos[i].commission);
      }
    }

    return (address(0), 0);
  }

  function isConsigned(uint256 tokenId, address who) public view returns (bool) {
    address tokenOwner = registry.ownerOf(tokenId);

    ConsignmentInfo memory consignmentInfo;

    while (who != address(0) && who != tokenOwner && who != address(registry)) {
      ConsignmentInfo[] memory consignmentInfos = consignments[who];

      consignmentInfo.consigner = address(0);

      for (uint i = 0; i < consignmentInfos.length; i++) {
        if (consignmentInfos[i].tokenId == tokenId) {
          consignmentInfo = consignmentInfos[i];
        }
      }

      who = consignmentInfo.consigner;
    }

    return who == tokenOwner || address(registry) == who;
  }

  function consignedTokenIds() public view returns (uint256[] memory) {
    return consigned[msg.sender];
  }
}
