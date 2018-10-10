pragma solidity ^0.4.24;

import "../../token/erc721/LOSKToken.sol";

contract CrowdsaleERC721 is Ownable{

    using SafeMath for uint256;

    // The token being sold
    DemoToken public token;

    // Address where funds are collected
    address public wallet;

    // Amount of wei raised
    uint256 public weiRaised;

    struct Token {
        uint256 id;
        string name;
        uint256 priceWei;
        bool available;
    }

    event NewDemoToken(uint tokenId, string name, uint256 priceWei);

    uint256[] public tokenArray;
    mapping(uint256 => Token) tokens;

    function addToken(uint256 _tokenId, string _name, uint256 _priceWei) public onlyOwner {
        require(token.exists(_tokenId));
        require(token.ownerOf(_tokenId) == msg.sender);

        Token memory _token = Token(_tokenId, _name, _priceWei, true);
        tokenArray.push(_tokenId);
        tokens[_tokenId] = _token;

        emit NewDemoToken(_tokenId, _name, _priceWei);
    }

    function getNumberOfTokens() public view returns (uint256){
        return tokenArray.length;
    }

    function getTokenByIndex(uint256 index) public view returns (uint256, string, uint256, bool){
        uint256 _tokenId = tokenArray[index];
        Token storage _token = tokens[_tokenId];
        return (_token.id, _token.name, _token.priceWei, _token.available);
    }

    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param _tokenId Id of the token purchased
     */
    event TokenPurchase(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 _tokenId
    );

    /**
     * @param _wallet Address where collected funds will be forwarded to
     * @param _token Address of the token being sold
     */
    constructor(address _wallet, DemoToken _token) public {
        require(_wallet != address(0));
        require(_token != address(0));

        wallet = _wallet;
        token = _token;
    }

    // -----------------------------------------
    // Crowdsale external interface
    // -----------------------------------------

    /**
     * @dev fallback function ***DO NOT OVERRIDE***
     */
    function () external payable {
        require(
            false,
            "You must specified a Token ID."
        );
    }

    /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param _tokenId Id of the token being purchased
   */
    function buyToken(uint256 _tokenId) public payable {

        address _beneficiary = msg.sender;

        uint256 weiAmount = msg.value;
        _preValidatePurchase(_beneficiary, weiAmount, _tokenId);

        // update state
        weiRaised = weiRaised.add(weiAmount);

        _processPurchase(_beneficiary, _tokenId);
        emit TokenPurchase(
            msg.sender,
            _beneficiary,
            weiAmount,
            _tokenId
        );

        _updatePurchasingState(_beneficiary, weiAmount, _tokenId);

        _forwardFunds();
        _postValidatePurchase(_beneficiary, weiAmount);
    }

    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use `super` in contracts that inherit from Crowdsale to extend their validations.
     * Example from CappedCrowdsale.sol's _preValidatePurchase method:
     *   super._preValidatePurchase(_beneficiary, _weiAmount);
     *   require(weiRaised.add(_weiAmount) <= cap);
     * @param _beneficiary Address performing the token purchase
     * @param _weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount,
        uint256 _tokenId
    )
    internal
    {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
        require(tokens[_tokenId].available);
        require(tokens[_tokenId].priceWei == _weiAmount);
    }

    /**
  * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid conditions are not met.
  * @param _beneficiary Address performing the token purchase
  * @param _weiAmount Value in wei involved in the purchase
  */
    function _postValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount
    )
    internal
    {
        // optional override
    }

    /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends its tokens.
     * @param _beneficiary Address performing the token purchase
     * @param _tokenId Id of token to be emitted
     */
    function _deliverTokens(
        address _beneficiary,
        uint256 _tokenId
    )
    internal
    {
        token.safeTransferFrom(address(this), _beneficiary, _tokenId);
    }

    /**
   * @dev Executed when a purchase has been validated and is ready to be executed. Not necessarily emits/sends tokens.
   * @param _beneficiary Address receiving the tokens
   * @param _tokenId Id of token to be purchased
   */
    function _processPurchase(
        address _beneficiary,
        uint256 _tokenId
    )
    internal
    {
        _deliverTokens(_beneficiary, _tokenId);
    }

    /**
   * @dev Override for extensions that require an internal state to check for validity (current user contributions, etc.)
   * @param _beneficiary Address receiving the tokens
   * @param _weiAmount Value in wei involved in the purchase
   */
    function _updatePurchasingState(
        address _beneficiary,
        uint256 _weiAmount,
        uint256 _tokenId
    )
    internal
    {
        tokens[_tokenId].available = false;
    }

    /**
     * @dev Determines how ETH is stored/forwarded on purchases.
     */
    function _forwardFunds() internal {
        wallet.transfer(msg.value);
    }
}