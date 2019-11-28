pragma solidity 0.5.12;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

import { IERC20 } from "./interfaces/IERC20.sol";
import { IRoyaltyDistributor } from "./interfaces/IRoyaltyDistributor.sol";
import { ARRCalculator } from "./ARRCalculator.sol";

/**
 * @title RoyaltyDistributor
 * @dev Convenient interface for distributing royalties
 */
contract RoyaltyDistributor is IRoyaltyDistributor {
  using SafeMath for uint;

  IERC20 public _token;

  event Distribute(address indexed from, address indexed to, uint price);

  constructor(IERC20 token) public {
    _token = token;
  }

  function token() public view returns (IERC20) {
    return _token;
  }

  function distribute(address beneficiary, uint salePrice) public {
    require(beneficiary != address(0), "RoyaltyDistributor :: Beneficiary is 0x0 address");
    require(salePrice != 0, "RoyaltyDistributor :: Amount is zero");

    uint arr = ARRCalculator.calculateARR(salePrice);

    token().transfer(beneficiary, arr);
    emit Distribute(msg.sender, beneficiary, arr);
  }

  function _preValidatePurchase(address beneficiary, uint256 amount) internal view {
    
  }

}