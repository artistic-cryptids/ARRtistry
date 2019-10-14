pragma solidity ^0.4.0;

contract VersionResolver {
    address owner;
    mapping(string=>address) addresses;

    modifier only_owner() {
        if(msg.sender != owner) throw;
        _;
    }

    function VersionResolver() {
        owner = msg.sender;
    }

    // Our resolver supports (supportsInterface & addr) interfaces
    function supportsInterface(bytes4 interfaceID) constant returns (bool) {
        return interfaceID == 0x3b3b57de
            || interfaceID == 0x01ffc9a7;
    }

    function addr(bytes32 nodeID) constant returns (address) {
        return address(this);
    }

    function releaseVersion(string version, address addr) only_owner {
        addresses[version] = addr;
        addresses['latest'] = addr;
    }

    function getVersion(string version) constant returns (address) {
        return addresses[version];
    }

    function() {
        throw;
    }
}
