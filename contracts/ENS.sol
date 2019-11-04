pragma solidity 0.5.8;

import "@ensdomains/ens/contracts/ENSRegistry.sol";
import "@ensdomains/ens/contracts/FIFSRegistrar.sol";

contract ENSResolver {

  mapping(bytes32 => address) public addresses;

  // Our resolver supports (supportsInterface & addr) interface
  function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
    return interfaceID == 0x3b3b57de
    || interfaceID == 0x01ffc9a7;
  }

  // TODO(mm): remove this hint disable
  // solhint-disable-next-line no-unused-vars
  function addr(bytes32 nodeID) public view returns (address) {
    return addresses[nodeID];
  }

  function setAddr(bytes32 nodeID, address addr) external {
    addresses[nodeID] = addr;
  }
}
