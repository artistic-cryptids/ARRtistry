pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

import { IERC721ApprovalEnumerable } from "./interfaces/IERC721ApprovalEnumerable.sol";

/**
 * @title ERC721ApprovalEnumerable
 * @dev The core registry of the artifact
 */
contract ERC721ApprovalEnumerable is IERC721ApprovalEnumerable, ERC721Full {

  using Counters for Counters.Counter;

  event Test(string yes);
  event Test2(address yeses);
  event Test3(uint256[] yess);
  event Test4(uint yessses);

  // Mapping from operators to the number of tokens they have been approved to transfer
  mapping (address => Counters.Counter) private _operatorApprovedTokensCount;
  // Mapping from operators to approved tokens
  mapping (address => uint256[]) private _operatorApprovedTokens;
  // Mapping from token ID to index of the operator approved tokens list
  mapping (uint256 => uint256) private _operatorApprovedTokensIndex;

  function approve(address to, uint256 tokenId) public {
    address oldOperator = getApproved(tokenId);
    super.approve(to, tokenId);

    if (oldOperator != address(0) && to == address(0)) {
      _removeTokenToApprovedTokensEnumeration(oldOperator, tokenId);
    } else if (oldOperator != to) {
      _addTokenToApprovedTokensEnumeration(to, tokenId);
    }
  }

  /* Overriding _transferFrom as we cannot override _clearApproval */
  function _transferFrom(address from, address to, uint256 tokenId) internal {
    // _transferFrom will fail if these requires fail so we need to check them
    // before we call _removeTokenToApprovedTokensEnumeration
    require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
    require(to != address(0), "ERC721: transfer to the zero address");

    // we call _removeTokenToApprovedTokensEnumeration before _transferFrom
    // as we need to it call before the approval is cleared
    address operator = getApproved(tokenId);
    if (operator != address(0)) {
      _removeTokenToApprovedTokensEnumeration(operator, tokenId);
    }

    super._transferFrom(from, to, tokenId);
  }

  /* Overriding _burn as we cannot override _clearApproval */
  function _burn(address owner, uint256 tokenId) internal {
    // _burn will fail if this require fail so we need to check them
    // before we call _removeTokenToApprovedTokensEnumeration
    require(ownerOf(tokenId) == owner, "ERC721: burn of token that is not owned");

    // we call _removeTokenToApprovedTokensEnumeration before _transferFrom
    // as we need to it call before the approval is cleared
    address operator = getApproved(tokenId);
    if (operator != address(0)) {
      _removeTokenToApprovedTokensEnumeration(operator, tokenId);
    }

    super._burn(owner, tokenId);
  }

  function _addTokenToApprovedTokensEnumeration(address to, uint256 tokenId) private {
    _operatorApprovedTokensIndex[tokenId] = _operatorApprovedTokens[to].length;
    _operatorApprovedTokens[to].push(tokenId);
    _operatorApprovedTokensCount[to].increment();
  }

  function _removeTokenToApprovedTokensEnumeration(address from, uint256 tokenId) private {
    // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
    // then delete the last slot (swap and pop).

    uint256 lastTokenIndex = _operatorApprovedTokens[from].length.sub(1);
    uint256 tokenIndex = _operatorApprovedTokensIndex[tokenId];

    // When the token to delete is the last token, the swap operation is unnecessary
    if (tokenIndex != lastTokenIndex) {
      uint256 lastTokenId = _operatorApprovedTokens[from][lastTokenIndex];

      _operatorApprovedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
      _operatorApprovedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
    }

    // This also deletes the contents at the last position of the array
    _operatorApprovedTokens[from].length--;

    // Note that _operatorApprovedTokens[tokenId] hasn't been cleared: it still points to the old slot (now occupied by
    // lastTokenId, or just over the end of the array if the token was the last one).

    _operatorApprovedTokensCount[from].decrement();
  }

  function getOperatorTokenIds(address operator) public view returns (uint256[] memory) {
    require(operator != address(0), "ERC721ApprovalEnumerable: balance query for the zero address");

    uint256 numApprovedTokens = _operatorApprovedTokensCount[operator].current();
    uint256 numOwnedTokens = balanceOf(operator);

    uint256[] memory tokenIds = new uint256[](numApprovedTokens + numOwnedTokens);
    for (uint i = 0; i < numApprovedTokens; i++) {
      tokenIds[i] = _operatorApprovedTokens[operator][i];
    }

    //emit Test3(_operatorApprovedTokens[operator]);
    for (uint i = 0; i < numOwnedTokens; i++) {
      tokenIds[numApprovedTokens + i] = tokenOfOwnerByIndex(operator, i);
    }

    return tokenIds;
  }

  /* function approvedTokenBalanceOf(address operator) public view returns (uint256) {
    require(operator != address(0), "ERC721ApprovalEnumerable: balance query for the zero address");

    return _operatorApprovedTokensCount[operator].current();
  }

  function approvedTokenOfOperatorByIndex(address operator, uint256 index) public view returns (uint256) {
    require(index < approvedTokenBalanceOf(operator), "ERC721ApprovalEnumerable: operator index out of bounds");
    return _operatorApprovedTokens[operator][index];
  } */
}
