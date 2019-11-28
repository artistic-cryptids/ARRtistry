pragma solidity 0.5.12;

interface IRoyaltyDistributor {
    function distribute(address artist, uint salePrice) external;

    event Distributed(address indexed from, address indexed to, uint256 value);
}