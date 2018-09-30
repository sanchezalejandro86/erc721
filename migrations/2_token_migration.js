var DemoToken = artifacts.require("./token/DemoToken.sol");

module.exports = function(deployer) {
    deployer.deploy(DemoToken, 'Demo', 'DEMO');
};