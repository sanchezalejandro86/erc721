const { duration, increaseTime, advanceBlock } = require('./helpers/time');
const { latestTime } = require('./helpers/latestTime');
const expectThrow = require('./helpers/expectThrow');
const LOSKCrowdsale = artifacts.require("LOSKCrowdsale");
const LOSKToken = artifacts.require("LOSKToken");

contract('LOSKCrowdsale', async (accounts) => {

    let contract, tokenContract;
    let owner = accounts[0];
    let wallet = accounts[1];
    let beneficiary = accounts[1];
    let priceWei = web3.toWei(0.1, 'ether');
    let tokenId;

    before(async () => {
        await advanceBlock();

        let openingTime = Math.floor(new Date().getTime() / 1000)
   //      let openingTime = (await latestTime()) + duration.seconds(10);
        let closingTime = openingTime + duration.days(90);
        tokenContract = await LOSKToken.new('LOSK Token', 'LOSK', {from: owner});

        contract = await LOSKCrowdsale.new(wallet, tokenContract.address, openingTime, closingTime, {from: owner});
    });

    describe("After Crowdsale creation", async ()  => {
        it("should be open", async () => {
            let hasClosed = await contract.hasClosed.call();
            assert.equal(hasClosed, false);
        });
        it("should not have tokens minted", async () => {
            let numberOfTokens = await contract.getNumberOfTokens.call();
            assert.equal(numberOfTokens, 0);
        });
        it("should not allow withdrawing", async () => {
            await expectThrow(contract.withdrawTokens.call());
        });
        it("balance should be empty", async () => {
            let numberOfTokens = await contract.getNumberOfTokens.call();
            assert.equal(numberOfTokens, 0);
        });
    });

    describe("Create tokens for Crowdsale", async ()  => {
        it("should create a token", async () => {
            var watcher = tokenContract.Transfer();
            let result = await tokenContract.mint({from: owner});
            let transfers = await watcher.get();

            assert.equal(transfers.length, 1);
            tokenId = transfers[0].args._tokenId;

            watcher = contract.NewLOSKToken();
            result = await contract.addToken(tokenId, 'LOSK', priceWei, {from: owner});
            let newTokenEvent = await watcher.get();
            assert.equal(newTokenEvent.length, 1);

            assert.equal(newTokenEvent[0].args.tokenId.valueOf(), tokenId);
            assert.equal(newTokenEvent[0].args.name.valueOf(), 'LOSK');
            assert.equal(newTokenEvent[0].args.priceWei.valueOf(), priceWei);

            result = await tokenContract.safeTransferFrom(owner, contract.address, tokenId, {from: owner});
        });

        it("should have 1 token minted", async () => {
            let numberOfTokens = await contract.getNumberOfTokens.call();
            assert.equal(numberOfTokens.toNumber(), 1);
        });

        it("should get token minted data", async () => {
            let token = await contract.getTokenByIndex.call(0);
            assert.equal(token[0].toNumber(), tokenId);
            assert.equal(token[1], 'LOSK');
            assert.equal(token[2].toNumber(), priceWei);
        });
    });

    describe("Buy Token in Crowdsale", async ()  => {
        it("should buy a token", async () => {
            let watcher = contract.TokenPurchase();
            let result = await contract.buyToken(tokenId, {from: beneficiary, value: priceWei});
            let events = await watcher.get();

            assert.equal(events.length, 1);
            assert.equal(events[0].args._tokenId.valueOf(), tokenId);
            assert.equal(events[0].args.beneficiary, beneficiary);
            assert.equal(events[0].args.value.valueOf(), priceWei);
        });

        it("crowdsale contract should be the owner of the token", async () => {
            let balance = await tokenContract.balanceOf.call(owner);
            assert.equal(balance.toNumber(), 0);

            balance = await tokenContract.balanceOf.call(beneficiary);
            assert.equal(balance.toNumber(), 0);

            balance = await tokenContract.balanceOf.call(contract.address);
            assert.equal(balance.toNumber(), 1);

            let _owner = await tokenContract.ownerOf.call(tokenId);
            assert.equal(_owner, contract.address);
        });

        it("balance should have increased wei ammount", async () => {
            let weiRaised = await contract.weiRaised.call();
            assert.equal(weiRaised.toNumber(), priceWei);
        });

        it("token should have already been bought", async () => {
            await expectThrow(contract.buyToken(tokenId, {from: beneficiary, value: priceWei}));
        });
    });

    describe("Close Crowdsale", async ()  => {
        it("should be closed", async () => {
            increaseTime(duration.days(91)); //after 3 months, crowdsale is closed.

            let hasClosed = await contract.hasClosed.call();
            assert.equal(hasClosed, true);
        });
        it("should transfer the token", async () => {
            watcher = contract.TokenDelivered();
            await contract.withdrawTokens({from: beneficiary});
            let events = await watcher.get();

            let balance = await tokenContract.balanceOf.call(owner);
            assert.equal(balance.toNumber(), 0);

            balance = await tokenContract.balanceOf.call(beneficiary);
            assert.equal(balance.toNumber(), 1);

            let _owner = await tokenContract.ownerOf.call(tokenId);
            assert.equal(_owner, beneficiary);
        });
    });

});

// _forwardFunds();?