pragma solidity ^0.4.24;

import "./Receiver.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Fake is Ownable{

    string _name;
    uint256 _total;
    Receiver _receiver;

    event Mint(uint256 tokenId);

    constructor(string name, Receiver receiver) public {
        _name = name;
        _receiver = receiver;
    }

    function mint() public onlyOwner returns (uint256){
        uint256 _tokenId = _receiver.mint();
        _total = _total + 1;
        emit Mint(_tokenId);
        return _tokenId;
    }

    function totalSupply() public view returns (uint256){
        return _total;
    }

}