# Sifchain SDK

A package of client software for developing client applications that connect to the [Sifchain](https://sifchain.finance/) software stack and enables you to query state or perform transactions without requiring a full installation of sifnode or browser.

## Pre-requisites

**Sifchain SDK is written in typescript and it is used in parallel with the REST API to enable off-line signing and broadcast transactions to a designated node operator.**

**Note:** A collection of Sifchain public REST endpoints can be found [here in the docs](https://data.sifchain.finance).

The code provided is an example of an implementation that you can use to develop your own client application. It is highly advised for users to put extra care in ensuring the wallet mnemonic secrets and running environment is protected.

## How to use the SDK

Sifchain SDK leverages an openapi 3.0 swagger file to auto-generate function stubs to invoke the REST API with appropriate parameters. The following steps will generate the stubs:

1. Install the node modules. `npm install`
2. Pull the latest published openapi spec and generates the new function stubs.
   `npm run nuke-api`

Once you have generated the stubs, you can test out each modules transaction functionality. In order to enable transaction signing, you create a `.env` file using the `sample.env` template and provide the wallet mnemonics, and Infura details. Next check the `config.ts` file is using the correct sifnode URL and RPC addresses to broadcast transactions to.

It is the users responsibility to ensure that your transactions are being broadcast to a safe and non-malicious node operator.

1. Causes the implemented code to be compiled into javascript and runs the index.js which drives the main application.
   `npm run start`

## Tests

The tests in the `/test` directory will run most of the available methods.

## Available Generated API methods

After generating the REST API function stubs the following methods will be available from the `/gen/api` folder. This folder has been aliased to 'sifchain' in the `package.json`.

### Pools API

- `.getPools()`
- `.getPool(symbol: string)`
- `.getLiquidityProviders(symbol: string)`
- `.getLiquidityProvider(symbol: string, lpAddress: string)`
- `.getPoolShare(symbol: string, lpAddress: string)`

Example:

```
import { PoolsApi, Configuration } from 'sifchain'
const config = new Configuration({ basePath: process.env.REST_API })
const poolsAPI = new PoolsApi(config)
async function main() {
    const res = await poolsAPI.getPools()
    console.log(res.data)
}
main()

```

### Validators API

- `.getDelegators(validatorAddress: string)`
- `.getDelegator(delegatorAddress: string)`
- `.getInactiveValidators(delegatorAddress: string)`
- `.getInactiveValidators()`
- `.getTotalStakedByDelegators()`
- `.getValidator(validatorAddress: string)`
- `.getValidators()`

Example:

```
import { ValidatorsApi, Configuration } from 'sifchain'
const config = new Configuration({ basePath: process.env.REST_API })
const validatorsApi = new ValidatorsApi(config)
async function main() {
    const res = await validatorsApi.getValidators()
    console.log(res.data)
}
main()

```

### Assets API

- `.getTokenValue(symbol: string)`
- `.getTotalSupply()`

Example:

```
import { AssetsApi, Configuration } from 'sifchain'
const config = new Configuration({ basePath: process.env.REST_API })
const assetsApi = new AssetsApi(config)
async function main() {
    const res = await assetsApi.getTotalSupply()
    console.log(res.data)
}
main()

```

### Network API

- `.getDailyPrice()`
- `.getHistoricalPrice()`
- `.getNetworkInfo()`

Example:

```
import { NetworkApi, Configuration } from 'sifchain'
const config = new Configuration({ basePath: process.env.REST_API })
const networkApi = new NetworkApi(config)
async function main() {
    const res = await networkApi.getNetworkInfo()
    console.log(res.data)
}
main()
```

## Client Methods

Client methods are located in the `/sdk` folder. These methods utilise off-line signing and the generated wallet using the `setupWallet` method.

#### Swap tokens on Sifchain

- `.swap(sentAsset, receivedAsset, sentAmount, minReceivingAmount)`
  - `sentAsset`: The swap base.
  - `receivedAsset`: The swap target.
  - `sentAmount`: The swap base amount in tokens.
  - `minReceivingAmount`: The minimum target tokens to receive.

#### Add liquidity to a pool

- `.addLiquidity(externalAsset, externalAssetAmount, nativeAssetAmount)`
  - `externalAssetAmount`: The amount of external asset to add to the pool.
  - `nativeAssetAmount`: The amount of Rowan to add to the pool.

#### Remove liquidity from a pool

- `.removeLiquidity(externalAsset, wBasisPoints, asymmetry)`
  - `externalAsset`: The external asset symbol specifying the pool to remove from.
  - `wBasisPoints`: The amount of pool share points to remove from the liquidity pool.
  - `asymmetry`: The amount of symmetry the removal should have.

#### Delegate rowan to a validator

- `.delegate(amount, toValidator)`
  - `amount`: The amount of Rowan to delegate
  - `toValidator`: The validator to delegate to.

#### Undelegate Rowan from a validator

- `.undelegate(amount, toValidator)`
  - `amount`: The amount of Rowan to undelegate
  - `toValidator`: The validator to undelegate from.

Example:

```
import { delegate } from '../sdk/validators/delegate'
const amount = 538
const toValidator = 'sifvaloper1vmtp5ul2uzmtvhchpftpzm0t49nk0hhasx52z0'
async function main() {
    const txnStatus = await delegate(amount, toValidator)
    console.log(txnStatus)
}
main()
```

## EthBridge / Peggy

Import and Export ERC20 tokens from sifchain to ethereum and back.

Be sure to check the fee and gas is set to your preference in the `config.ts` file and the hard coded values in the `exportToken` and `importToken` function bodies. All available tokens along with corresponding symbols are found in the `sdk/assets.sifchain.mainnet.json` file. The assets in this file with `homeNetwork` equal to `"ethereum"` are ERC20 tokens. 

#### Import Eth or ERC20 tokens from Ethereum to Sifchain

- `.importToken(symbol, amount)`
  - `symbol`: The token symbol.
  - `amount`: The amount of token to import

#### Export cEth or cERC20 tokens from Sifchain to Ethereum

- `.exportToken(symbol, amount)`
  - `symbol`: The token symbol.
  - `amount`: The amount of token to export  

Example:

```
import { importToken } from '../../sdk/ethbridge/importToken'
async function main() {
    await importToken('eth', '10000000000001')
}
main()

```

## IBC / Inter-Blockchain Communication

Import and Export tokens from and to sifchain and other chains on the Cosmos netowrk.

Edit the IBC chains config file at `sdk/ibc/chainsConfigIBC.ts` to set the desired `walletMnemonic`, `gas`, and `nativeFee` for each chain you will be transfering tokens to/from. 

#### Import tokens from an External Cosmos chain to Sifchain

- `.importTokenIBC(symbol, amount)`
  - `symbol`: The token symbol.
  - `amount`: The amount of token to import

#### Export tokens from Sifchain to an External Cosmos chain

- `.exportTokenIBC(symbol, amount)`
  - `symbol`: The token symbol.
  - `amount`: The amount of token to export  

Example:

```
import { exportTokenIBC } from '../../sdk/ibc/exportTokenIBC'
async function main() {
    await exportTokenIBC('uatom', '200000000002')
}
main()

```

