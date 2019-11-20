pragma solidity 0.5.12;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Eurs is ERC20, ERC20Detailed {

  constructor() public ERC20Detailed("StasisEursFaked", "EURS", 4) {
    _mint(msg.sender, 1000000 * (uint256(10) ** 4));
  }
}
