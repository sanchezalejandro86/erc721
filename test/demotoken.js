const DemoToken = artifacts.require("DemoToken");

contract('DemoToken', async (accounts) => {

    let contract;
    let owner = accounts[0];
    let beneficiary = accounts[1];
    let tokenId;

    before(async () => {
        contract = await DemoToken.new('DEMO Token', 'DEMO', {from: owner});
    });

    describe("Before tokens minted", async ()  => {
        it("should has 0 tokens minted", async () => {
            let totalSupply = await contract.totalSupply.call();
            assert.equal(totalSupply.toNumber(), 0);
        });
    });

    describe("Token being minted", async ()  => {

        it("should have 1 token minted", async () => {
            var watcher = contract.Transfer();

            let result = await contract.mint({from: owner});
            let transfers = await watcher.get();

            assert.equal(transfers.length, 1);
            assert.equal(transfers[0].args._from.valueOf(), 0);
            assert.equal(transfers[0].args._to.valueOf(), owner);

            tokenId = transfers[0].args._tokenId;

            let totalSupply = await contract.totalSupply.call();
            assert.equal(totalSupply.toNumber(), 1);

            let exists = await contract.exists.call(tokenId);
            assert.equal(exists, true);
        });

        it("should have 1 token in owner's wallet", async () => {
            let balance = await contract.balanceOf.call(owner);
            assert.equal(balance.toNumber(), 1);
        });


        it("token minted should belong to owner address", async () => {
            let _owner = await contract.ownerOf.call(tokenId);
            assert.equal(_owner.valueOf(), owner);
        });

    });


    describe("Token transfer to another account", async ()  => {
        it("token minted should belong to owner address", async () => {
            var watcher = contract.Transfer();

            let result = await contract.transferFrom(owner, beneficiary, tokenId);

            let transfers = await watcher.get();

            assert.equal(transfers.length, 1);
            assert.equal(transfers[0].args._from.valueOf(), owner);
            assert.equal(transfers[0].args._to.valueOf(), beneficiary);
            assert.equal(transfers[0].args._tokenId.valueOf(), tokenId);
        });

        it("should have 0 token in owner's wallet", async () => {
            let balance = await contract.balanceOf.call(owner);
            assert.equal(balance.toNumber(), 0);
        });


        it("should have 1 token in beneficiary's wallet", async () => {
            let balance = await contract.balanceOf.call(beneficiary);
            assert.equal(balance.toNumber(), 1);
        });


        it("token minted should belong to beneficiary's address", async () => {
            let _owner = await contract.ownerOf.call(tokenId);
            assert.equal(_owner.valueOf(), beneficiary);
        });

    });

});
