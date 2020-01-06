pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

contract IARRRegistry {
  struct ARR {
    address from;
    address to;
    uint256 tokenId;
    uint price;
    string location;
    string date;
    bool paid;
  }

  function markPaid(uint id) public;
  function record(ARR memory arr) public returns (uint);
  function retrieve(uint id) public view returns (ARR memory);
  function collectingSociety() public view returns (address);
}
