pragma solidity 0.5.12;

contract ERC20Eurs {

    string public constant name = "StasisEursFaked";
    string public constant symbol = "EURS";
    uint8 public constant decimals = 4;
    uint256 public constant totalSupply = 1000000 * (uint256(10) ** decimals);


    event Approval(address indexed tokenOwner, address indexed spender, uint spendable);
    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowance;

    using SafeMath for uint256;


   constructor(uint256 total) public {
	    balances[msg.sender] = totalSupply;
      emit Transfer('0x0000000000000000000000000000000000000000', msg.sender, total);
    }

    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool success) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);

        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address spender, uint numTokens) public returns (bool success) {
        allowance[msg.sender][spender] = numTokens;

        emit Approval(msg.sender, spender, numTokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public {
        require(tokens <= balances[from]);
        require(tokens <= allowance[from][msg.sender]);

        balances[from] = balances[from].sub(tokens);
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
    }
}

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}
