## How to

### Start blockchain
```sh
cd asure-network-mvp-node/
target/release/asure-network-mvp-node --dev

# or

cargo build
cargo run
```

### Restore Alice Account with balances
```sh
subkey restore Alice
```


### Start Substrate-UI
```sh
cd asure-network-mvp-node-ui/
yarn dev
```

### Start polkadot-js/apps
```sh
cd apps/
yarn run start
```
