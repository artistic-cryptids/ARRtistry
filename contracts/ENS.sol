pragma solidity 0.5.12;

import "@ensdomains/ens/contracts/ENSRegistry.sol";
import "@ensdomains/ens/contracts/ReverseRegistrar.sol";

contract ENSResolver {

  mapping(bytes32 => address) public addresses;
  mapping(bytes32 => string) public names;

  // Our resolver supports (supportsInterface & addr & name) interface
  function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
    return interfaceID == 0x3b3b57de
    || interfaceID == 0x01ffc9a7
    || interfaceID == 0x691f3431;
  }

  // TODO(mm): remove this hint disable
  // solhint-disable-next-line no-unused-vars
  function addr(bytes32 nodeID) public view returns (address) {
    return addresses[nodeID];
  }

  function setAddr(bytes32 nodeID, address addr) external {
    addresses[nodeID] = addr;
  }

  function setName(bytes32 node, string memory name) public {
    names[node] = name;
  }

  function name(bytes32 node) public view returns (string memory) {
    return names[node];
  }
}
