const { ApiPromise } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');

// Our address for Alice on the dev chain
const Alice = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
const ALICE_SEED = 'Alice'.padEnd(32, ' ');

async function main () {
    // Create our API with a default connection to the local node
    const api = await ApiPromise.create();

    // Make our basic chain state/storage queries, all in one go
    const [accountNonce, blockPeriod] = await Promise.all([
        api.query.system.accountNonce(Alice),
        api.query.timestamp.blockPeriod(),
    ]);

    console.log(`accountNonce(${Alice}) ${accountNonce}`);
    console.log(`blockPeriod ${blockPeriod.toNumber()} seconds`);

    await callDemo(api);
    await setDemo(3, api);
    await callDemo(api);
}

async function callDemo(api) {
    const bla = await api.query.demo.someText();

    console.log(`someText ${bla.toNumber()}`);
}

async function setDemo(value, api) {
    const keyring = new Keyring();

    // Add Alice to our keyring (with the known seed for the account)
    const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));

    // Retrieve the nonce for Alice, to be used to sign the transaction
    const aliceNonce = await api.query.system.accountNonce(alice.address());

    // Create a extrinsic, transferring 12345 units to Bob. We can also create,
    // sign and send in one operation (as per the samples in the Api documentation),
    // here we split it out for the sake of readability

    const transfer = api.tx.demo.sendSometext(12345);

    // Sign the transaction using our account
    transfer.sign(alice, aliceNonce);

    // Send the transaction and retrieve the resulting Hashls

    const hash = await transfer.send();

    console.log(`transfer 12345 to Bob with hash ${hash}`);
}

main().catch(console.error).finally(_ => process.exit());