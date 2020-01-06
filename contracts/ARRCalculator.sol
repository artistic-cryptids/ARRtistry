pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { Math } from "@openzeppelin/contracts/math/Math.sol";

/*
 * @title ARRCalculator
 * @dev Contains functions for calculating Artist Resale Rights (ARR).
 */
library ARRCalculator {
  using SafeMath for uint;

  uint constant private DECIMAL_FACTOR = 100;
  uint constant private BAND_ONE_UPPER_BOUND = 50000 * DECIMAL_FACTOR;
  uint constant private BAND_TWO_UPPER_BOUND = 200000 * DECIMAL_FACTOR;
  uint constant private BAND_THREE_UPPER_BOUND = 350000 * DECIMAL_FACTOR;
  uint constant private BAND_FOUR_UPPER_BOUND = 500000 * DECIMAL_FACTOR;
  uint constant private MAX_ARR = 12500 * DECIMAL_FACTOR;

  /*
   * Calculates ARR given a price in cents (euros)
   */
  function calculateARR(uint salePrice) internal pure returns (uint) {
    // TODO: Take into account location of sale
    // TODO: Take into account nationality of artist
    // TODO: Take into account "bought as stock" exception
    // TODO: Take into account whether artwork is sold for first time
    if (salePrice < 1000 * DECIMAL_FACTOR) {
      return 0;
    }

    uint totalARR = fixedPointDiv(Math.min(salePrice, BAND_ONE_UPPER_BOUND).mul(4), 100);

    if (salePrice > BAND_ONE_UPPER_BOUND) {
      uint amountInBand = Math.min(BAND_TWO_UPPER_BOUND, salePrice).sub(BAND_ONE_UPPER_BOUND);
      totalARR = totalARR.add(fixedPointDiv(amountInBand.mul(3), 100));
    }

    if (salePrice > BAND_TWO_UPPER_BOUND) {
      uint amountInBand = Math.min(BAND_THREE_UPPER_BOUND, salePrice).sub(BAND_TWO_UPPER_BOUND);
      totalARR = totalARR.add(fixedPointDiv(amountInBand.mul(1), 100));
    }

    if (salePrice > BAND_THREE_UPPER_BOUND) {
      uint amountInBand = Math.min(BAND_FOUR_UPPER_BOUND, salePrice).sub(BAND_THREE_UPPER_BOUND);
      totalARR = totalARR.add(fixedPointDiv(amountInBand.mul(5), 1000));
    }

    if (salePrice > BAND_FOUR_UPPER_BOUND) {
      totalARR = totalARR.add(fixedPointDiv(salePrice.sub(BAND_FOUR_UPPER_BOUND).mul(25), 10000));
    }

    return Math.min(totalARR, MAX_ARR);
  }

  /*
   * Divides x by y, allowing correct rounding to an integer if the result
   * needs less than 3 decimal places (this is based on the scaling factor)
   * to determine correct rounding.
   */
  function fixedPointDiv(uint x, uint y) private pure returns (uint) {
    uint scalingFactor = 1000;
    uint result = x.mul(scalingFactor).div(y);
    return result.add(scalingFactor.div(2)).div(scalingFactor);
  }
}
