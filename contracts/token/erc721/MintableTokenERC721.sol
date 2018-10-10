pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 * Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
 */
contract MintableTokenERC721 is ERC721Token, Ownable {
    event Mint(address indexed to, uint256 tokenId);
    event MintFinished();

    bool public mintingFinished = false;


    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    modifier hasMintPermission() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Function to mint tokens
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(string uri)
    public
    hasMintPermission
    canMint
    returns (uint256)
    {
        uint256 _tokenId = random();
        super._mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, uri);
        emit Mint(msg.sender, _tokenId);
        return _tokenId;
    }


    /**
     * @dev Function to stop minting new tokens.
     * @return True if the operation was successful.
     */
    function finishMinting() public onlyOwner canMint returns (bool) {
        mintingFinished = true;
        emit MintFinished();
        return true;
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp, block.difficulty)));
    }
}
