pragma solidity ^0.4.24;

import "./TimedCrowdsaleERC721.sol";


/**
 * @title PostDeliveryCrowdsale
 * @dev Crowdsale that locks tokens from withdrawal until it ends.
 */
contract PostDeliveryCrowdsaleERC721 is TimedCrowdsaleERC721 {
    using SafeMath for uint256;

    mapping(address => uint256[]) public balances;

    /**
     * @dev Withdraw tokens only after crowdsale ends.
     */
    function withdrawTokens() public {
        require(hasClosed());
        uint256 amount = balances[msg.sender];
        require(amount > 0);
        balances[msg.sender] = null;
        _deliverTokens(msg.sender, amount);
    }

    /**
     * @dev Overrides parent by storing balances instead of issuing tokens right away.
     * @param _beneficiary Token purchaser
     * @param _tokenAmount Amount of tokens purchased
     */
    function _processPurchase(
        address _beneficiary,
        uint256 _tokenAmount
    )
    internal
    {
        balances[_beneficiary] = balances[_beneficiary].add(_tokenAmount);
    }

}
