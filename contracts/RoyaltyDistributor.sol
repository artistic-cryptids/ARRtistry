pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { IERC20 } from "./interfaces/IERC20.sol";
import { ITokenRecipient } from "./interfaces/ITokenRecipient.sol";
import { IARRRegistry } from "./interfaces/IARRRegistry.sol";
import { ARRCalculator } from "./ARRCalculator.sol";
/**
 * @title RoyaltyDistributor
 * @dev Convenient interface for distributing royalties
 */
contract RoyaltyDistributor is ITokenRecipient {
  using SafeMath for uint;

  IERC20 public _token;
  IARRRegistry public _arrRegistry;

  uint constant private DACS_RATE = 100;

  event Distribute(address indexed from, address indexed to, uint price);
  event RequestTransfer(uint balance, uint arr);

  constructor(IERC20 token, IARRRegistry arrRegistry) public {
    _token = token;
    _arrRegistry = arrRegistry;
  }

  function token() public view returns (IERC20) {
    return _token;
  }

  function arrRegistry() public view returns (IARRRegistry) {
    return _arrRegistry;
  }

  function calculateARR(uint256 salePrice) public pure returns (uint256) {
    return ARRCalculator.calculateARR(salePrice);
  }

  function receiveApproval(address from, uint256 tokens, address fromToken, bytes memory data) public {
    (uint arrId) = abi.decode(data, (uint));

    IARRRegistry.ARR memory arr = arrRegistry().retrieve(arrId);

    require(arr.to != address(0), "RoyaltyDistributor :: Beneficiary is 0x0 address");
    require(arr.price != 0, "RoyaltyDistributor :: Amount is zero");

    uint256 tokensDue = calculateARR(arr.price);
    require(tokensDue <= tokens, "RoyaltyDistributor :: Not enough tokens provided");

    IERC20 instanceContract = IERC20(fromToken);
    instanceContract.transferFrom(from, arrRegistry().collectingSociety(), tokensDue.mul(2).div(10));
    instanceContract.transferFrom(from, arr.to, tokensDue.mul(8).div(10));

    emit Distribute(msg.sender, arr.to, tokensDue);
    arrRegistry().markPaid(arrId);
  }


}
