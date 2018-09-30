pragma solidity ^0.4.24;

contract Fake{

    string _name;
    uint256 _total;

    constructor(string name) public {
        _name = name;
    }

    function mint() public returns (uint256){
        _total = _total + 1;
        return _total;
    }

    function totalSupply() public view returns (uint256){
        return _total;
    }
}