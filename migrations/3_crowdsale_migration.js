var DemoCrowdsale = artifacts.require("./crowdsale/DemoCrowdsale.sol");
var DemoToken = artifacts.require("./token/DemoToken.sol");

const { duration } = require('../test/helpers/time');

module.exports = async function(deployer, network, accounts) {
    let openingTime = Math.floor(new Date().getTime() / 1000)
    let closingTime = openingTime + duration.days(90);

    deployer.deploy(DemoCrowdsale, accounts[0], DemoToken.address, openingTime, closingTime);
};