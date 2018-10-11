var LOSKToken = artifacts.require("./token/erc721/LOSKToken.sol");

module.exports = function(deployer) {
    deployer.deploy(LOSKToken, 'Demo', 'DEMO');
};