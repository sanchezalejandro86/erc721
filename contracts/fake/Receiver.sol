pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Receiver is Ownable{

    function mint() public onlyOwner returns (uint256){
        return random();
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp, block.difficulty)));
    }
}