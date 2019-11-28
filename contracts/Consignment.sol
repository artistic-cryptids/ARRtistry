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

  modifier authorized(uint256 tokenId) {
    address who = msg.sender;
    ConsignmentInfo memory consignmentInfo = consignments[who];
    address consigner = consignmentInfo.consigner;

    while (consigner != address(0)) {
      who = consigner;
      consignmentInfo = consignments[who];
      consigner = consignmentInfo.consigner;
    }

    require(registry.ownerOf(tokenId) == consigner);
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
  }
}
