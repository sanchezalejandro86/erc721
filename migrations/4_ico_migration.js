var LOCCToken = artifacts.require("./token/erc223/LOCCToken.sol");
var LOCC_ICO = artifacts.require("./crowdsale/erc223/LOCC_ICO.sol");

module.exports = async function(deployer, network, accounts) {
    deployer.deploy(LOCCToken, "LOCC Token", "LOCC", 18, 2000000000);

    deployer.deploy(LOCC_ICO, accounts[1], LOCCToken.address, 1000000000000000000, 5000000000000000000);
};