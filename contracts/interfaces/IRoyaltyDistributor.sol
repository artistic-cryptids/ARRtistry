pragma solidity 0.5.12;

interface IRoyaltyDistributor {
    event Distributed(address indexed from, address indexed to, uint256 value);
}