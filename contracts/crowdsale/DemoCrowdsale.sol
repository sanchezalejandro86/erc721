pragma solidity ^0.4.24;

import "./PostDeliveryCrowdsaleERC721.sol";

contract DemoCrowdsale is PostDeliveryCrowdsaleERC721{

    constructor(address wallet, DemoToken token, uint256 _openingTime, uint256 _closingTime)
    CrowdsaleERC721(wallet, token)
    TimedCrowdsaleERC721(_openingTime, _closingTime)
    public{ }
}