pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract CrowdsaleList is Ownable{
    address[] crowdsales;

    function addCrowdsale(address crowsale) public onlyOwner {
        crowdsales.push(crowsale);
    }

    function getCrowdsaleByIndex(uint256 index) public view returns(address){
        return crowdsales[index];
    }

    function getCrowdsaleCount() public view returns(uint256){
        return crowdsales.length;
    }
}