pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

contract MockTarget {
  uint public value;

  function setValue() public {
    value = 42;
  }

  function data() public view returns (bytes memory) {
    return abi.encodeWithSelector(this.setValue.selector);
  }
}
