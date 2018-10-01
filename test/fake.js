// const Fake = artifacts.require("Fake");
// const Receiver = artifacts.require("Receiver");
//
// contract('Fake', async (accounts) => {
//
//     let contract;
//     let owner = accounts[0];
//     let beneficiary = accounts[1];
//     let tokenId;
//
//     before(async () => {
//         receiverContract = await Receiver.new({from: owner});
//
//         contract = await Fake.new('FAKE', receiverContract.address, {from: owner});
//     });
//
//     describe("Mint from Fake to Receiver", async ()  => {
//         it("should mint", async () => {
//             let watcher = contract.Mint();
//             let result = await contract.mint({from: owner});
//             let newTokenEvent = await watcher.get();
//
//             assert.equal(newTokenEvent.length, 1);
//             console.log("token id: " + newTokenEvent.args.tokenId.valueOf());
//             // assert.equal(newTokenEvent.args.tokenId.valueOf(), 2);
//         });
//     });
//
// });