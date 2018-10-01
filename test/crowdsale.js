const { duration, timeTravel } = require('./helpers/time');
const expectThrow = require('./helpers/expectThrow');
const DemoCrowdsale = artifacts.require("DemoCrowdsale");
const DemoToken = artifacts.require("DemoToken");

contract('DemoCrowdsale', async (accounts) => {

    let contract, tokenContract;
    let owner = accounts[0];
    let wallet = accounts[1];
    let beneficiary = accounts[1];
    let priceWei = web3.toWei(0.1, 'ether');
    let tokenId;

    before(async () => {
        let openingTime = Math.floor(new Date().getTime() / 1000)
        let closingTime = openingTime + duration.days(90);
        tokenContract = await DemoToken.new('DEMO Token', 'DEMO', {from: owner});

        contract = await DemoCrowdsale.new(wallet, tokenContract.address, openingTime, closingTime, {from: owner});
        //contract = await DemoCrowdsale.deployed();
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

            watcher = contract.NewDemoToken();
            result = await contract.addToken(tokenId, 'DEMO', priceWei, {from: owner});
            let newTokenEvent = await watcher.get();

            assert.equal(newTokenEvent.length, 1);
            assert.equal(newTokenEvent[0].args.tokenId.valueOf(), tokenId);
            assert.equal(newTokenEvent[0].args.name.valueOf(), 'DEMO');
            assert.equal(newTokenEvent[0].args.priceWei.valueOf(), priceWei);
        });

        it("should have 1 token minted", async () => {
            let numberOfTokens = await contract.getNumberOfTokens.call();
            assert.equal(numberOfTokens.toNumber(), 1);
        });

        it("should get token minted data", async () => {
            let token = await contract.getTokenByIndex.call(0);
            assert.equal(token[0].toNumber(), tokenId);
            assert.equal(token[1], 'DEMO');
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

        it("token should not have been transfered to beneficiary while crowdsale open", async () => {
            let balance = await tokenContract.balanceOf.call(owner);
            assert.equal(balance.toNumber(), 1);

            balance = await tokenContract.balanceOf.call(beneficiary);
            assert.equal(balance.toNumber(), 0);

            let _owner = await tokenContract.ownerOf.call(tokenId);
            assert.equal(_owner, owner);
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
            timeTravel(duration.days(90)); //after 3 months, crowdsale is closed.

            let hasClosed = await contract.hasClosed.call();
            assert.equal(hasClosed, true);
        });
        it("should transfer the token", async () => {
            let watcher = contract.TokenDelivered();
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

//addToken(string _name, uint256 _priceWei) public onlyOwner
//getNumberofTokens():uint256
//getTokenByIndex(uint256 index) public view returns (uint256, string, uint256)
//buyToken(uint256 _tokenId) public payable
//hasClosed():bool
//withdrawTokens()

// _forwardFunds();?