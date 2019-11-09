pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

import { IERC721ApprovalEnumerable } from "./interfaces/IERC721ApprovalEnumerable.sol";

/**
 * @title ERC721ApprovalEnumerable
 * @dev A extension the ERC721 protocol which provides support for querying
 *      the tokens an account has been approved to transfer. Currently
 *      this contract does not support the ERC721Burnable extension.
 */
contract ERC721ApprovalEnumerable is IERC721ApprovalEnumerable, ERC721Full {

  // Mapping from operators to approved tokens
  mapping (address => uint256[]) private _operatorApprovedTokens;
  // Mapping from token ID to index of the operator approved tokens list
  mapping (uint256 => uint256) private _operatorApprovedTokensIndex;

  function approve(address to, uint256 tokenId) public {
    address oldOperator = getApproved(tokenId);
    super.approve(to, tokenId);

    if (oldOperator != to) {
      if (oldOperator != address(0)) {
        _removeTokenToApprovedTokensEnumeration(oldOperator, tokenId);
      }

      if (to != address(0)) {
        // Tokens are added after removal as adding modifies
        // _operatorApprovedTokensIndex but removing depends on it
        _addTokenToApprovedTokensEnumeration(to, tokenId);
      }
    }
  }

  /* We override _transferFrom as we cannot override _clearApproval */
  function _transferFrom(address from, address to, uint256 tokenId) internal {
    address operator = getApproved(tokenId);
    super._transferFrom(from, to, tokenId);

    if (operator != address(0)) {
      _removeTokenToApprovedTokensEnumeration(operator, tokenId);
    }
  }

  function _addTokenToApprovedTokensEnumeration(address to, uint256 tokenId) private {
    _operatorApprovedTokensIndex[tokenId] = _operatorApprovedTokens[to].length;
    _operatorApprovedTokens[to].push(tokenId);
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
  }

  function getOperatorTokenIds(address operator) public view returns (uint256[] memory) {
    require(operator != address(0), "ERC721ApprovalEnumerable: operator token ids query for the zero address");

    uint256 numApprovedTokens = _operatorApprovedTokens[operator].length;

    uint256[] memory tokenIds = new uint256[](numApprovedTokens);
    for (uint i = 0; i < numApprovedTokens; i++) {
      tokenIds[i] = _operatorApprovedTokens[operator][i];
    }

    return tokenIds;
  }
}
