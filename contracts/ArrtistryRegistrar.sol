pragma solidity 0.5.12;

import "@ensdomains/ens/contracts/ENSRegistry.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

// This contract should be deployed once on rinkeby (Unless changes need to be made)
contract ArrtistryRegistrar is Ownable {
  ENSRegistry public ens;
  bytes32 public rootNode;

  modifier onlyOwner() {
    require(owner() == msg.sender);
    _;
  }

  modifier approved(bytes32 label) {
    address currentOwner = ens.owner(keccak256(abi.encodePacked(rootNode, label)));
    require(currentOwner == address(0x0) || currentOwner == msg.sender || owner() == msg.sender);
    _;
  }

  constructor(ENSRegistry ensAddr, bytes32 node) public {
    ens = ensAddr;
    rootNode = node;
  }

  function register(bytes32 label, address owner) public approved(label) {
    ens.setSubnodeOwner(rootNode, label, owner);
  }

  function setRootNode(bytes32 node) public onlyOwner {
    rootNode = node;
  }
}
