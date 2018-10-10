var DemoToken = artifacts.require("./token/LOSKToken.sol");

module.exports = function(deployer) {
    deployer.deploy(DemoToken, 'Demo', 'DEMO');
};