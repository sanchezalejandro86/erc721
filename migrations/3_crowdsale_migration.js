var LOSKCrowdsale = artifacts.require("./crowdsale/erc721/LOSKCrowdsale.sol");
var CrowdsaleList = artifacts.require("./crowdsale/erc721/CrowdsaleList.sol");
var LOSKToken = artifacts.require("./token/erc721/LOSKToken.sol");

const { duration } = require('../test/helpers/time');

module.exports = async function(deployer, network, accounts) {
    let openingTime = Math.floor(new Date().getTime() / 1000)
    let closingTime = openingTime + duration.days(90);

    deployer.deploy(LOSKCrowdsale, accounts[0], LOSKToken.address, openingTime, closingTime);

    deployer.deploy(CrowdsaleList);
};