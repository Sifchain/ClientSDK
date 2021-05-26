# Sifchain SDK

A package of client software for developing client applications that connect to the [Sifchain](https://sifchain.finance/) software stack and enables you to query state or perform transactions without requiring a full installation of sifnode or browser.

# Pre-requisites

**Sifchain SDK is written in typescript and it is used in parallel with the REST API to enable off-line signing and broadcast transactions to a designated node operator.**

The code is provided is an example of an implementation that you can use to develop your own client application. It is highly advised for users to put extra care in ensuring the wallet mnemonic secrets and running environment is protected.

## How to use the SDK

Sifchain SDK leverages an openapi 3.0 swagger file to auto-generate function stubs to invoke the REST API with appropriate parameters. The following steps will generate the stubs:

1. Install the node modules. `npm install`
2. Pull the latest published openapi spec and generates the new function stubs.
   `npm run nuke-api`

Once you have generated the stubs, you can test out each modules transaction functionality. In order to enable transaction signing, you create a .env file and provide the wallet mnemonic, as well as the sifnode URL to broadcast the transactions to.

It is the users responsibility to ensure that your transactions are being broadcast to a safe and non-malicious node operator.


1. Causes the implemented code to be compiled into javascript and runs the index.js which drives the main application.
   `npm run start`

### Client

Available client methods:

- [`swap`](#swap)
- [`addLiquidity`](#addLiquidity)
- [`removeLiquidity`](#removeLiquidity)
- [`delegate`](#delegate)
- [`undelegate`](#undelegate)

### Wallet

Available wallet methods:

- [`setupWallet`](#setupWallet)

### Client Methods

- `swap(sentAsset, receivedAsset, sentAmount, minReceivingAmount)`: Swap tokens on Sifchain <a id='swap' />
  - `sentAsset`: The swap base.
  - `receivedAsset`: The swap target.
  - `sentAmount`: The swap base amount in tokens.
  - `minReceivingAmount`: The minimum target tokens to receive.
- `addLiquidity(externalAsset, externalAssetAmount, nativeAssetAmount)`: Add liquidity to a pool <a id='addLiquidity' />
  - `externalAsset`: The external asset symbol.
  - `externalAssetAmount`: The amount of external asset to add to the pool.
  - `nativeAssetAmount`: The amount of Rowan to add to the pool.
- `removeLiquidity(externalAsset, wBasisPoints, asymmetry)`: Remove liquidity from a pool <a id='removeLiquidity' />
  - `externalAsset`: The external asset symbol specifying the pool to remove from.
  - `wBasisPoints`: The amount of pool share points to remove from the liquidity pool.
  - `asymmetry`: The amount of symmetry the removal should have.
- `delegate(amount, toValidator)`: Delegate rowan to a validator <a id='delegate' />
  - `amount`: The amount of Rowan to delegate
  - `toValidator`: The validator to delegate to.
- `undelegate(amount, toValidator)`: Undelegate Rowan from a validator <a id='undelegate' />
  - `amount`: The amount of Rowan to undelegate
  - `toValidator`: The validator to undelegate from.

### Wallet Methods

- `setupWallet()`: Imports wallet from .env config <a id='setupWallet' />