import * as dotenv from 'dotenv'
import { Configuration } from './gen/api'
import Long from 'long'
import { StdFee } from '@cosmjs/launchpad'

dotenv.config({ path: __dirname + '/.env' })

const timeoutInMinutes = 45
const timeoutTimestampInSeconds = Math.floor(
  new Date().getTime() / 1000 + 60 * timeoutInMinutes
)
const timeoutTimestampNanoseconds = Long.fromNumber(
  timeoutTimestampInSeconds
).multiply(1_000_000_000)

const fee: StdFee = {
  amount: [{ denom: 'rowan', amount: '150000' }],
  gas: '300000',
}

export default {
  apiConfig: new Configuration({
    basePath: 'https://data.sifchain.finance/beta',
  }),

  bridgeBankAddress: '0xB5F54ac4466f5ce7E0d8A5cB9FE7b8c0F35B7Ba8',

  // BridgeTokenAddress / eRowan Token Address
  // const bridgeTokenAddress = await bridgeBank().methods.getBridgeToken('erowan').call()
  bridgeTokenAddress: '0x07baC35846e5eD502aA91AdF6A9e7aA210F2DcbE',

  ethContractAddress: '0x0000000000000000000000000000000000000000',
  sifnodeLcdApi: 'https://api-int.sifchain.finance',
  sifRpc: 'https://rpc.sifchain.finance',
  ethnode: `https://:${process.env.INFURA_SECRET}@mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,

  timeoutTimestampNanoseconds,
  fee,

  exportEthbridgeCethThresholdFee: '70000000000000000', //unique cEth threshold fee that is only used when exporting eth/erc20 tokens.
  // importEthbridgeGas: (await web3.eth.getBlock('latest')).gasLimit
  importEthbridgeGas: 300000,
}
