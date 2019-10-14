pragma solidity ^0.4.0;

contract VersionResolver {
    address owner;

    struct Contract {
        address addr;
        string abi;
    }

    mapping(string=>Contract) contracts;

    modifier only_owner() {
        if(msg.sender != owner) throw;
        _;
    }

    function VersionResolver() {
        owner = msg.sender;
    }

    // Our resolver supports (supportsInterface & addr) interfaces
    function supportsInterface(bytes4 interfaceID) constant view returns (bool) {
        return interfaceID == 0x3b3b57de
            || interfaceID == 0x01ffc9a7;
    }

    function addr(bytes32 nodeID) constant view returns (address) {
        return address(this);
    }

    function releaseVersion(string version, address addr, string abi) only_owner {
        Contract contr = Contract(addr, abi);
        contracts[version] = contr;
        contracts['latest'] = contr;
    }

    function getVersion(string version) constant view returns (address) {
        return contracts[version];
    }

    function() {
        throw;
    }
}
