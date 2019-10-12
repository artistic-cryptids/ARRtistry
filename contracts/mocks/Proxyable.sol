pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

contract Proxyable is Initializable {

    uint _magicValue;
    // initialise function acts as constructor
    function initialize(uint magicValue) public initializer {
        _magicValue = magicValue;
    }

    function magic() public view returns (uint) {
        return _magicValue;
    }
}
