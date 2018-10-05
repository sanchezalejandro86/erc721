pragma solidity ^0.4.24;

import "./PostDeliveryCrowdsaleERC721.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721Receiver.sol";

contract DemoCrowdsale is PostDeliveryCrowdsaleERC721, ERC721Receiver{

    constructor(address wallet, DemoToken token, uint256 _openingTime, uint256 _closingTime)
    CrowdsaleERC721(wallet, token)
    TimedCrowdsaleERC721(_openingTime, _closingTime)
    public{ }

    // msg.sender, _from, _tokenId, _data
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes _data
    )
    public
    returns(bytes4){
        return ERC721_RECEIVED;
    }

    function sellToken(uint256 tokenId, address beneficiary) public onlyOwner {
        require(beneficiary != address(0));
        require(tokens[tokenId].available);

        _processPurchase(beneficiary, tokenId);

        emit TokenPurchase(
            msg.sender,
            beneficiary,
            0,
            tokenId
        );

        _updatePurchasingState(beneficiary, 0, tokenId);
    }
}