pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./MintableTokenERC721.sol";

contract DemoToken is MintableTokenERC721{

    uint256 lastId = 1 ** 5;

    constructor(string _name, string _symbol)
    ERC721Token(_name, _symbol)
    public {
    }

    function mint(string uri)
    public
    hasMintPermission
    canMint
    returns (uint256)
    {
        lastId = lastId.add(1);
        super._mint(msg.sender, lastId);
        _setTokenURI(lastId, uri);
        emit Mint(msg.sender, lastId);
        return lastId;
    }

    function tokensOfOwner(address _owner)
    public
    view
    returns (uint256[])
    {
        return ownedTokens[_owner];
    }
}