pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract DemoToken is ERC721Token, Ownable{

    uint256 lastId = 1 ** 5;

    constructor(string _name, string _symbol)
    ERC721Token(_name, _symbol)
    public {
    }

    function mint() public onlyOwner returns (uint256){
        lastId = lastId.add(1);
        super._mint(msg.sender, lastId);
        return lastId;
    }

}