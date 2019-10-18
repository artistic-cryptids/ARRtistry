pragma solidity 0.5.8;

contract VersionResolver {
  address private owner;

  struct Contract {
    address addr;
    string abi;
  }

  mapping(string => Contract) private contracts;

  modifier only_owner() {
    require(msg.sender == owner);
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  // Our resolver supports (supportsInterface & addr) interface
  function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
    return interfaceID == 0x3b3b57de
    || interfaceID == 0x01ffc9a7;
  }

  // solhint-disable-next-line no-unused-vars
  function addr(bytes32 nodeID) public view returns (address) {
    return address(this);
  }

  function releaseVersion(string memory _version, string memory _abi, address _addr) public only_owner {
    Contract memory contr = Contract(_addr, _abi);
    contracts[_version] = contr;
    contracts["latest"] = contr;
  }

  function getAddr(string memory _version) public view returns (address) {
    return contracts[_version].addr;
  }

  function getAbi(string memory _version) public view returns (string memory) {
    return contracts[_version].abi;
  }
}
