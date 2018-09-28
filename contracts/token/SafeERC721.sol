pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";
import "zeppelin-solidity/contracts/token/ERC721/ERC721.sol";

/**
 * @title SafeERC721
 * @dev Wrappers around ERC721 operations that throw on failure.
 * To use this library you can add a `using SafeERC721 for ERC721;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC721 {
    function safeTransfer(
        ERC721Basic _token,
        address _to,
        uint256 _value
    )
    internal
    {
        require(_token.transfer(_to, _value));
    }

    function safeTransferFrom(
        ERC721 _token,
        address _from,
        address _to,
        uint256 _value
    )
    internal
    {
        require(_token.transferFrom(_from, _to, _value));
    }

    function safeApprove(
        ERC721 _token,
        address _spender,
        uint256 _value
    )
    internal
    {
        require(_token.approve(_spender, _value));
    }
}
