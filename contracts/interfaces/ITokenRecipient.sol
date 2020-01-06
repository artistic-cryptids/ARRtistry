pragma solidity 0.5.12;

interface ITokenRecipient {
  function receiveApproval(address _from, uint256 _value, address _token, bytes calldata _extraData) external;
}