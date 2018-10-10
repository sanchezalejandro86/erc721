pragma solidity ^0.4.24;

import "./TimedCrowdsaleERC721.sol";


/**
 * @title PostDeliveryCrowdsale
 * @dev Crowdsale that locks tokens from withdrawal until it ends.
 */
contract PostDeliveryCrowdsaleERC721 is TimedCrowdsaleERC721 {
    using SafeMath for uint256;

    mapping(address => uint256[]) public balances;

    address[] beneficiaries;

    bool public released = false;

    event TokenDelivered(address to, uint256 tokenId);


    /**
     * @dev Withdraw tokens only after crowdsale ends.
     */
    function withdrawTokens() public onlyOwner{
        require(hasClosed(), "El Crowdsale no está cerrado");
        require(!released, "Los tokens ya fueron liberados");

        for (uint i=0; i<beneficiaries.length; i++) {
            uint256[] storage _tokenIds = balances[beneficiaries[i]];

            for (uint j=0; j<_tokenIds.length; j++) {
                _deliverTokens(beneficiaries[i], _tokenIds[j]);
                emit TokenDelivered(beneficiaries[i], _tokenIds[j]);
            }
        }

        released = true;
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
        if(balances[_beneficiary].length == 0){
            beneficiaries.push(_beneficiary);
        }
        balances[_beneficiary].push(_tokenId);
    }

}
