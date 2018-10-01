pragma solidity ^0.4.24;

import "./TimedCrowdsaleERC721.sol";


/**
 * @title PostDeliveryCrowdsale
 * @dev Crowdsale that locks tokens from withdrawal until it ends.
 */
contract PostDeliveryCrowdsaleERC721 is TimedCrowdsaleERC721 {
    using SafeMath for uint256;

    mapping(address => uint256[]) public balances;

    event TokenDelivered(address to, uint256 tokenId);

    /**
     * @dev Withdraw tokens only after crowdsale ends.
     */
    function withdrawTokens() public {
        require(hasClosed(), "El Crowdsale no está cerrado");
        require(balances[msg.sender].length > 0, "El sender no tiene tokens");
        uint256[] storage _tokenIds = balances[msg.sender];
        //balances[msg.sender] = new uint256[](0); //FIXME

        for (uint i=0; i<_tokenIds.length; i++) {
            _deliverTokens(msg.sender, _tokenIds[i]);
            emit TokenDelivered(msg.sender, _tokenIds[i]);
        }

    }

    /**
     * @dev Overrides parent by storing balances instead of issuing tokens right away.
     * @param _beneficiary Token purchaser
     * @param _tokenId Id of the token purchased
     */
    function _processPurchase(
        address _beneficiary,
        uint256 _tokenId
    )
    internal
    {
        balances[_beneficiary].push(_tokenId);
    }

}
