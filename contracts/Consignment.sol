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
    bool valid;
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

    ConsignmentInfo[] memory consignmentInfos = consignments[tokenId];

    for (uint i = 0; i < consignmentInfos.length; i++) {
      ConsignmentInfo memory consignmentInfo = consignmentInfos[i];

      address consignee = consignmentInfo.consignee;
      uint256[] storage consignedTokens = consigned[consignee];

      for (uint j = 0; j < consignedTokens.length; j++) {
        if (consignedTokens[j] == tokenId) {
          delete consignedTokens[j];
          break;
        }
      }
    }

    delete consignments[tokenId];
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
    consignmentInfo.valid = true;

    consignments[tokenId].push(consignmentInfo);

    consigned[who].push(tokenId);
  }

  function revoke(uint256 tokenId, address who) public authorized(tokenId) {
    ConsignmentInfo[] storage consignmentInfos = consignments[tokenId];

    for (uint i = 0; i < consignmentInfos.length; i++) {
      ConsignmentInfo storage info = consignmentInfos[i];
      if (info.valid && info.consignee == who) {
        info.valid = false;
      }
    }

    revokeChildren(tokenId, who);
  }

  function revokeChildren(uint256 tokenId, address who) private {
    ConsignmentInfo[] storage consignmentInfos = consignments[tokenId];

    for (uint i = 0; i < consignmentInfos.length; i++) {
      ConsignmentInfo storage info = consignmentInfos[i];
      if (info.valid && info.consigner == who) {
        info.valid = false;
        revokeChildren(tokenId, info.consignee);
      }

      uint256[] memory consignedTokens = consigned[who];

      for (uint j = 0; j < consignedTokens.length; j++) {
        if (consignedTokens[j] == tokenId) {
          delete consignedTokens[j];
          break;
        }
      }

      consigned[who] = consignedTokens;
    }
  }

  function getConsignmentAddresses(uint256 tokenId, address who) public view authorized(tokenId) returns (address[] memory) {
    ConsignmentInfo[] memory consignmentInfos = consignments[tokenId];

    uint count = 0;

    for (uint i = 0; i < consignmentInfos.length; i++) {
      if (consignmentInfos[i].consigner == who && consignmentInfos[i].valid) {
        count = count + 1;
      }
    }

    address[] memory addresses = new address[](count);
    count = 0;

    for (uint i = 0; i < consignmentInfos.length; i++) {
      if (consignmentInfos[i].consigner == who && consignmentInfos[i].valid) {
        addresses[count] = consignmentInfos[i].consignee;
        count = count + 1;
      }
    }

    return addresses;
  }

  function getConsignmentInfo(uint256 tokenId, address consigner, address consignee) public view authorized(tokenId) returns (uint8 commission) {
    ConsignmentInfo[] memory consignmentInfos = consignments[tokenId];

    for (uint i = 0; i < consignmentInfos.length; i++) {
      if (consignmentInfos[i].consigner == consigner && consignmentInfos[i].consignee == consignee && consignmentInfos[i].valid) {
        return consignmentInfos[i].commission;
      }
    }

    return 0;
  }

  function isConsigned(uint256 tokenId, address who) public view returns (bool) {
    address tokenOwner = registry.ownerOf(tokenId);
    ConsignmentInfo[] memory consignmentInfos = consignments[tokenId];

    ConsignmentInfo memory consignmentInfo;

    while (who != address(0) && who != tokenOwner && who != address(registry)) {
      consignmentInfo.consigner = address(0);

      for (uint i = 0; i < consignmentInfos.length; i++) {
        if (consignmentInfos[i].consignee == who && consignmentInfos[i].valid) {
          consignmentInfo = consignmentInfos[i];
        }
      }

      who = consignmentInfo.consigner;
    }

    return who == tokenOwner || who == address(registry);
  }

  function consignedTokenIds() public view returns (uint256[] memory) {
    uint256[] memory ids = consigned[msg.sender];

    uint count = 0;

    for (uint i = 0; i < ids.length; i++) {
      if (ids[i] != 0) {
        count = count + 1;
      }
    }

    uint256[] memory validIds = new uint256[](count);
    count = 0;

    for (uint i = 0; i < ids.length; i++) {
      if (ids[i] != 0) {
        validIds[count] = ids[i];
        count = count + 1;
      }
    }

    return validIds;
  }
}
