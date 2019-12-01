pragma solidity 0.5.12;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/ITokenRecipient.sol";

contract ERC20Eurs is ERC20, ERC20Detailed {

  constructor() public ERC20Detailed("StasisEurs", "TEURS", 2) {
    _mint(msg.sender, 1000000 * (uint256(10) ** 2));
  }

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }

  function approveAndCall(address _spender, uint256 _value, bytes memory _extraData) public returns (bool success) {
    _approve(msg.sender, _spender, _value);
    ITokenRecipient spender = ITokenRecipient(_spender);
    spender.receiveApproval(msg.sender, _value, address(this), _extraData);
    return true;
  }
}
