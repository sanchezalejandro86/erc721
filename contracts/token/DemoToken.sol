pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MintableTokenERC721.sol";

contract DemoToken is MintableTokenERC721{

    uint256 lastId = 1 ** 5;

    constructor(string _name, string _symbol)
    ERC721Token(_name, _symbol)
    public {
    }

    function mint()
    public
    hasMintPermission
    canMint
    returns (uint256)
    {
        lastId = lastId.add(1);
        super._mint(msg.sender, lastId);
        emit Mint(msg.sender, lastId);
        return lastId;
    }

}