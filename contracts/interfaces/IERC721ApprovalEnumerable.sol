pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract IERC721ApprovalEnumerable is IERC721 {
  function getOperatorTokenIds(address operator) public view returns (uint256[] memory);
}
