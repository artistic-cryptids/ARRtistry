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
    address consignee;
    address consigner;
    uint8 commission;
  }

  mapping (uint256 => ConsignmentInfo[]) public consignments;
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
    require(!isConsigned(tokenId, who), "Consignment::consign: Account is already authorized");

    ConsignmentInfo memory consignmentInfo;

    address consigner = msg.sender;

    if (consigner == address(registry)) {
      consigner = address(registry.ownerOf(tokenId));
    }

    consignmentInfo.consignee = who;
    consignmentInfo.consigner = consigner;
    consignmentInfo.commission = commission;

    consignments[tokenId].push(consignmentInfo);

    consigned[who].push(tokenId);
  }

  function getConsignmentAddresses(uint256 tokenId, address who) public view authorized(tokenId) returns (address[] memory) {
    ConsignmentInfo[] memory consignmentInfos = consignments[tokenId];

    uint count = 0;

    for (uint i = 0; i < consignmentInfos.length; i++) {
      if (consignmentInfos[i].consigner == who) {
        count = count + 1;
      }
    }

    address[] memory addresses = new address[](count);
    count = 0;

    for (uint i = 0; i < consignmentInfos.length; i++) {
      if (consignmentInfos[i].consigner == who) {
        addresses[count] = consignmentInfos[i].consignee;
        count = count + 1;
      }
    }

    return addresses;
  }

  function isConsigned(uint256 tokenId, address who) public view returns (bool) {
    address tokenOwner = registry.ownerOf(tokenId);
    ConsignmentInfo[] memory consignmentInfos = consignments[tokenId];

    ConsignmentInfo memory consignmentInfo;

    while (who != address(0) && who != tokenOwner && who != address(registry)) {
      consignmentInfo.consigner = address(0);

      for (uint i = 0; i < consignmentInfos.length; i++) {
        if (consignmentInfos[i].consignee == who) {
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
