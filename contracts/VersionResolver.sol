pragma solidity ^0.5.0;

contract VersionResolver {
    address owner;

    struct Contract {
        address addr;
        string abi;
    }

    mapping(string=>Contract) contracts;

    modifier only_owner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    // Our resolver supports (supportsInterface & addr) interfaces
    function supportsInterface(bytes4 interfaceID) pure public returns (bool) {
        return interfaceID == 0x3b3b57de
            || interfaceID == 0x01ffc9a7;
    }

    function addr(bytes32 nodeID) public view returns (address) {
        return address(this);
    }

    function releaseVersion(string memory _version, string memory _abi, address _addr) public only_owner {
        Contract memory contr = Contract(_addr, _abi);
        contracts[_version] = contr;
        contracts['latest'] = contr;
    }

    function getAddr(string memory _version) public view returns (address) {
        return contracts[_version].addr;
    }

    function getAbi(string memory _version) public view returns (string memory) {
        return contracts[_version].abi;
    }
}
